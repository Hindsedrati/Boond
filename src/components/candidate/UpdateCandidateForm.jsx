import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtEncode } from "../../utils/utils";
import "../../App.css"; // ✅ Import du CSS global

const UpdateCandidateForm = ({ candidate, onClose, onCandidateUpdated }) => {
  const ClientToken = "6e616f706c61795f73616e64626f78";
  const ClientKey = "4488aa91d7a63630e391";
  const UserToken = "332e6e616f706c61795f73616e64626f78";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email1: "",
    phone1: "",
    title: "",
    state: 0,
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 📌 Chargement des données du candidat sélectionné
  useEffect(() => {
    if (candidate) {
      setFormData({
        firstName: candidate.attributes?.firstName || "",
        lastName: candidate.attributes?.lastName || "",
        email1: candidate.attributes?.email1 || "",
        phone1: candidate.attributes?.phone1 || "",
        title: candidate.attributes?.title || "",
        state: candidate.attributes?.state || 0,
      });
    }
  }, [candidate]);

  // 📌 Mise à jour des champs
  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  // 📌 Fonction pour soumettre la mise à jour à l'API
  const updateCandidate = async () => {
    if (!candidate) {
      toast.warn("Aucun candidat sélectionné !");
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

      const response = await fetch(
        `https://ui.boondmanager.com/api/candidates/${candidate.id}/information`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/vnd.api+json",
            "X-Jwt-Client-Boondmanager": jwtToken,
          },
          body: JSON.stringify({
            data: {
              type: "candidates",
              id: candidate.id,
              attributes: { ...formData },
            },
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(`Erreur API: ${JSON.stringify(result)}`);
      }

      toast.success("✅ Candidat mis à jour avec succès !");

      if (typeof onCandidateUpdated === "function") {
        onCandidateUpdated(); // ✅ Rafraîchir la liste
      } else {
        console.error("❌ onCandidateUpdated n'est pas une fonction !");
      }

      setTimeout(() => {
        onClose(); // ✅ Assurer la fermeture de la modal
      }, 500);

    } catch (error) {
      console.error("❌ Erreur mise à jour candidat :", error);
      setErrorMessage("Erreur lors de la mise à jour du candidat.");
      toast.error("❌ Échec de la mise à jour !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <h3>Modifier le candidat</h3>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <label>Nom:</label>
      <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} />

      <label>Prénom:</label>
      <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} />

      <label>Email:</label>
      <input type="email" name="email1" value={formData.email1} onChange={handleInputChange} />

      <label>Téléphone:</label>
      <input type="tel" name="phone1" value={formData.phone1} onChange={handleInputChange} />

      <label>Fonction:</label>
      <input type="text" name="title" value={formData.title} onChange={handleInputChange} />

      <button className="btn-save" onClick={updateCandidate} disabled={loading}>
        {loading ? "Mise à jour..." : "✅ Sauvegarder"}
      </button>
      <button className="btn-close" onClick={onClose}>❌ Fermer</button>
    </div>
  );
};

// 📌 Validation des props
UpdateCandidateForm.propTypes = {
  candidate: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    attributes: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      email1: PropTypes.string,
      phone1: PropTypes.string,
      title: PropTypes.string,
      state: PropTypes.number,
    }).isRequired,
  }),
  onClose: PropTypes.func.isRequired,
  onCandidateUpdated: PropTypes.func.isRequired,
};

export default UpdateCandidateForm;
