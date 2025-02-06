import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { jwtEncode } from "../../utils/utils";
import "../../App.css"; 

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
      const response = await fetch(`https://ui.boondmanager.com/api/candidates/${candidateId}`, {
        method: "DELETE",
        headers: { "X-Jwt-Client-Boondmanager": jwtToken },
      });

      if (!response.ok) throw new Error(`Erreur DELETE: ${response.status}`);

      toast.success(`✅ Candidat ${candidateId} supprimé avec succès !`);
      onCandidateDeleted(); // ✅ Met à jour la liste
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
      <p>ID du candidat : {candidateId}</p>
      <button className="btn-delete" onClick={deleteCandidate} disabled={loading}>
        {loading ? "Suppression..." : "🗑️ Supprimer"}
      </button>
      <button className="btn-close" onClick={onClose}>❌ Annuler</button>
    </div>
  );
};

DeleteCandidateForm.propTypes = {
  candidateId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onCandidateDeleted: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};



export default DeleteCandidateForm;
