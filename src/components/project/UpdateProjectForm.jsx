import { useState } from 'react';
import PropTypes from 'prop-types';
import { jwtEncode } from "../../utils/utils";

const UpdateProjectForm = ({ onProjectUpdated }) => {
  
  const ClientToken = "6e616f706c61795f73616e64626f78";
  const ClientKey = "4488aa91d7a63630e391";
  const UserToken = "332e6e616f706c61795f73616e64626f78";

  const [projectId, setProjectId] = useState("");
  const [projectData, setProjectData] = useState({
    name: "",
    description: ""
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProjectData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSearch = async () => {
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
          method: "GET",
          headers: {
            "X-Jwt-Client-Boondmanager": jwtToken,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        const project = result.data.attributes;
        setProjectData({
          name: project.name || "",
          description: project.description || ""
        });
        setErrorMessage("");
      } else {
        setErrorMessage(`Requête en échec avec un statut HTTP ${response.status}`);
      }
    } catch (error) {
      console.error("Erreur lors de la requête API:", error);
      setErrorMessage("Erreur lors de la requête API: " + error.message);
    }
  };

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
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Jwt-Client-Boondmanager": jwtToken,
          },
          body: JSON.stringify({
            data: {
              type: "project",
              id: projectId,
              attributes: {
                name: projectData.name,
                description: projectData.description
              }
            },
          }),
        }
      );

      if (response.ok) {
        onProjectUpdated();
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
      <h2>Mettre à jour un projet</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <label>
        ID du projet:
        <input
          type="text"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        />
        <button type="button" onClick={handleSearch}>
          Rechercher
        </button>
      </label>
      <form onSubmit={handleSubmit}>
        <label>
          Nom:
          <input
            type="text"
            name="name"
            value={projectData.name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Description:
          <input
            type="text"
            name="description"
            value={projectData.description}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  );
};

UpdateProjectForm.propTypes = {
  onProjectUpdated: PropTypes.func.isRequired,
};

export default UpdateProjectForm;
