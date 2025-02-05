import { useState } from "react";
import PropTypes from "prop-types";
import UpdateCandidateForm from "./UpdateCandidateForm"; // Import de la modale
import "../../App.css";

const Candiatelist = ({ candidates, onCandidateUpdated }) => {
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
              <td>{candidate.attributes.title || "Non renseigné"}</td>
              <td>
                <button className="btn-edit" onClick={() => setSelectedCandidate(candidate)}>📝 Modifier</button>
                <button className="btn-delete" onClick={() => deleteCandidate(candidate.id)}>🗑 Supprimer</button>
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

// 📌 Fonction pour supprimer un candidat
const deleteCandidate = (id) => {
  if (window.confirm("Voulez-vous vraiment supprimer ce candidat ?")) {
    console.log("🗑 Suppression du candidat ID :", id);
    alert(`Candidat ${id} supprimé`);
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
        title: PropTypes.string,
      }).isRequired,
    })
  ).isRequired,
  onCandidateUpdated: PropTypes.func.isRequired,
};

export default Candiatelist;
