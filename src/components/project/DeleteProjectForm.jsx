import { useState } from 'react';
import PropTypes from 'prop-types';
import { jwtEncode } from "../../utils/utils";

const DeleteProjectForm = ({ onProjectDeleted }) => {
  const ClientToken = "6e616f706c61795f73616e64626f78";
  const ClientKey = "4488aa91d7a63630e391";
  const UserToken = "332e6e616f706c61795f73616e64626f78";
  
  const [projectId, setProjectId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!projectId) {
      setErrorMessage("Veuillez entrer un ID de projet valide.");
      return;
    }

    try {
      const payload = {
        userToken: UserToken,
        clientToken: ClientToken,
        time: Math.floor(Date.now() / 1000),
        mode: "normal",
      };

      const jwtToken = jwtEncode(payload, ClientKey);
      const response = await fetch(
        `https://ui.boondmanager.com/api/projects/${projectId}/information`,
        {
          method: "DELETE",
          headers: {
            "X-Jwt-Client-Boondmanager": jwtToken,
          },
        }
      );

      if (response.ok) {
        onProjectDeleted();
        setErrorMessage("");
      } else {
        setErrorMessage(`Requête en échec avec un statut HTTP ${response.status}`);
      }
    } catch (error) {
      console.error("Erreur lors de la requête API:", error);
      setErrorMessage("Erreur lors de la requête API: " + error.message);
    }
  };

  return (
    <div>
      <h2>Supprimer un projet</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          ID du projet:
          <input
            type="text"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          />
        </label>
        <button type="submit">Supprimer</button>
      </form>
    </div>
  );
};

DeleteProjectForm.propTypes = {
  onProjectDeleted: PropTypes.func.isRequired,
};

export default DeleteProjectForm;
