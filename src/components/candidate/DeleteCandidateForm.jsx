import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { jwtEncode } from "../../utils/utils";
import "../../App.css"; // ✅ Import du CSS global

const DeleteCandidateForm = ({ candidateId, onCandidateDeleted, onClose }) => {
  const ClientToken = "6e616f706c61795f73616e64626f78";
  const ClientKey = "4488aa91d7a63630e391";
  const UserToken = "332e6e616f706c61795f73616e64626f78";

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    console.log("🔍 ID du candidat à supprimer :", candidateId);
    if (!candidateId) {
      setErrorMessage("❌ Erreur : Aucun ID candidat sélectionné.");
    }
  }, [candidateId]);

  const deleteCandidate = async () => {
    if (!candidateId) {
      toast.warn("⚠️ Aucun ID candidat sélectionné.");
      return;
    }

    if (!window.confirm(`Voulez-vous vraiment supprimer le candidat ${candidateId} ?`)) {
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const payload = {
        userToken: UserToken,
        clientToken: ClientToken,
        time: Math.floor(Date.now() / 1000),
        mode: "normal",
      };

      const jwtToken = jwtEncode(payload, ClientKey);

      console.log("📤 Envoi de la requête DELETE pour le candidat :", candidateId);

      const response = await fetch(
        `https://ui.boondmanager.com/api/candidates/${candidateId}`, 
        {
          method: "DELETE",
          headers: {
            "X-Jwt-Client-Boondmanager": jwtToken,
          },
        }
      );

      const result = await response.json();
      console.log("📩 Réponse API après suppression :", result);

      if (!response.ok) {
        throw new Error(`Erreur DELETE: ${response.status} - ${JSON.stringify(result)}`);
      }

      toast.success(`✅ Candidat ${candidateId} supprimé avec succès !`);

      if (typeof onCandidateDeleted === "function") {
        console.log("🔄 Rafraîchissement de la liste des candidats...");
        onCandidateDeleted(); // 🔄 Rafraîchir la liste
      } else {
        console.warn("⚠️ onCandidateDeleted n'est pas défini !");
      }

      onClose(); // ✅ Ferme la popup après suppression

    } catch (error) {
      console.error("❌ Erreur suppression candidat :", error);
      setErrorMessage("Erreur lors de la suppression du candidat.");
      toast.error("❌ Échec de la suppression !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <h3>Supprimer un candidat</h3>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <label>ID du candidat :</label>
      <input type="text" value={candidateId || ""} readOnly />

      <button className="btn-delete" onClick={deleteCandidate} disabled={loading}>
        {loading ? "Suppression..." : "🗑️ Supprimer"}
      </button>
      <button className="btn-close" onClick={onClose}>❌ Annuler</button>
    </div>
  );
};

// 📌 Validation des props
DeleteCandidateForm.propTypes = {
  candidateId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onCandidateDeleted: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DeleteCandidateForm;
