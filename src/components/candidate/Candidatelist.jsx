import { useState } from "react";
import PropTypes from "prop-types";
import UpdateCandidateForm from "./UpdateCandidateForm"; // Import de la modale
import { jwtEncode } from "../../utils/utils"; // Utilitaire pour BoondManager
import "../../App.css";

const ClientToken = "6e616f706c61795f73616e64626f78";
const ClientKey = "4488aa91d7a63630e391";
const UserToken = "332e6e616f706c61795f73616e64626f78";

const Candiatelist = ({ candidates, onCandidateUpdated, onCandidateDeleted }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null); // Stocke le candidat sélectionné

  if (!Array.isArray(candidates) || candidates.length === 0) {
    return <p>Pas de candidats disponibles</p>;
  }

  return (
    <>
      <h2>Liste des candidats</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Fonction</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate.id}>
              <td>{candidate.id}</td>
              <td>{candidate.attributes.lastName || "Non renseigné"}</td>
              <td>{candidate.attributes.firstName || "Non renseigné"}</td>
              <td>{candidate.attributes.email1 || "Non renseigné"}</td>
              <td>{candidate.attributes.title || "Non renseigné"}</td>
              <td>
                <button className="btn-edit" onClick={() => setSelectedCandidate(candidate)}>📝 Modifier</button>
                <button className="btn-delete" onClick={() => deleteCandidate(candidate.id, onCandidateDeleted)}>🗑 Supprimer</button>
                <button className="btn-email" onClick={() => sendEmail(candidate)}>📧 Envoyer Email</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 📌 Affichage de la modale si un candidat est sélectionné */}
      {selectedCandidate && (
        <UpdateCandidateForm
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onCandidateUpdated={onCandidateUpdated}
        />
      )}
    </>
  );
};

// ✅ Fonction pour supprimer un candidat via l'API BoondManager
const deleteCandidate = async (id, onCandidateDeleted) => {
  if (!id) {
    alert("ID du candidat invalide !");
    return;
  }

  const confirmation = window.confirm(`Voulez-vous vraiment supprimer le candidat ${id} ?`);
  if (!confirmation) return;

  console.log("🗑 Suppression en cours du candidat ID :", id);

  try {
    const payload = {
      userToken: UserToken,
      clientToken: ClientToken,
      time: Math.floor(Date.now() / 1000),
      mode: "normal",
    };

    const jwtToken = jwtEncode(payload, ClientKey);

    const response = await fetch(`https://ui.boondmanager.com/api/candidates/${id}`, {
      method: "DELETE",
      headers: {
        "X-Jwt-Client-Boondmanager": jwtToken,
      },
    });

    if (!response.ok) {
      throw new Error(`❌ Erreur DELETE: ${response.status}`);
    }

    console.log(`✅ Candidat ${id} supprimé avec succès`);
    alert(`✅ Candidat ${id} supprimé !`);

    // 🔄 Met à jour la liste après suppression
    if (onCandidateDeleted) {
      onCandidateDeleted();
    }
  } catch (error) {
    console.error("❌ Erreur lors de la suppression :", error);
    alert("Erreur lors de la suppression !");
  }
};

// 📌 Fonction pour envoyer un email
const sendEmail = (candidate) => {
  console.log(`📤 Envoi d'un email à ${candidate.attributes.firstName} ${candidate.attributes.lastName}`);
  alert(`Email envoyé à ${candidate.attributes.firstName} ${candidate.attributes.lastName}`);
};

// 📌 Validation des props
Candiatelist.propTypes = {
  candidates: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      attributes: PropTypes.shape({
        lastName: PropTypes.string,
        firstName: PropTypes.string,
        email1: PropTypes.string,
        title: PropTypes.string,
      }).isRequired,
    })
  ).isRequired,
  onCandidateUpdated: PropTypes.func.isRequired,
  onCandidateDeleted: PropTypes.func.isRequired,
};

export default Candiatelist;
