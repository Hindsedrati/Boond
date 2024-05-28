import { useState } from 'react';
import PropTypes from 'prop-types';
import { jwtEncode } from '../../utils/utils';

const CreateProjectForm = ({ onProjectCreated, companies, contacts, resources }) => {
  const ClientToken = "6e616f706c61795f73616e64626f78";
  const ClientKey = "4488aa91d7a63630e391";
  const UserToken = "332e6e616f706c61795f73616e64626f78";

  const [projectData, setProjectData] = useState({
    type: "project",
    attributes: {
      title: "",
      typeOf: "Régie",
      company: null,
      contact: null,
      resource: null,
    }
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProjectData((prevState) => ({
      ...prevState,
      attributes: {
        ...prevState.attributes,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!projectData.attributes.title || !projectData.attributes.typeOf) {
      setErrorMessage("Les champs Titre et Type sont obligatoires.");
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
        "https://ui.boondmanager.com/api/projects",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Jwt-Client-Boondmanager": jwtToken,
          },
          body: JSON.stringify({ data: projectData })
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("API Response:", result);
        setErrorMessage("");
        onProjectCreated(); // Lever l'état pour indiquer la création
      } else {
        console.log("Requête en échec avec un statut HTTP " + response.status);
      }
    } catch (error) {
      console.error("Erreur lors de la requête API:", error);
    }
  };

  return (
    <div>
      <h2>Créer un projet</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Titre:
          <input
            type="text"
            name="title"
            value={projectData.attributes.title}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Type de projet:
          <select
            name="typeOf"
            value={projectData.attributes.typeOf}
            onChange={handleInputChange}
          >
            <option value="Régie">Régie</option>
            <option value="Forfait">Forfait</option>
          </select>
        </label>
        <label>
          Société:
          <select
            name="company"
            value={projectData.attributes.company || ""}
            onChange={(e) =>
              setProjectData((prevState) => ({
                ...prevState,
                attributes: {
                  ...prevState.attributes,
                  company: e.target.value
                }
              }))
            }
          >
            <option value="">Sélectionner une société</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.attributes.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Contact:
          <select
            name="contact"
            value={projectData.attributes.contact || ""}
            onChange={(e) =>
              setProjectData((prevState) => ({
                ...prevState,
                attributes: {
                  ...prevState.attributes,
                  contact: e.target.value
                }
              }))
            }
          >
            <option value="">Sélectionner un contact</option>
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.attributes.firstName} {contact.attributes.lastName}
              </option>
            ))}
          </select>
        </label>
        <label>
          Ressource:
          <select
            name="resource"
            value={projectData.attributes.resource || ""}
            onChange={(e) =>
              setProjectData((prevState) => ({
                ...prevState,
                attributes: {
                  ...prevState.attributes,
                  resource: e.target.value
                }
              }))
            }
          >
            <option value="">Sélectionner une ressource</option>
            {resources.map((resource) => (
              <option key={resource.id} value={resource.id}>
                {resource.attributes.name}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Créer</button>
      </form>
    </div>
  );
};

CreateProjectForm.propTypes = {
  onProjectCreated: PropTypes.func.isRequired,
  companies: PropTypes.array.isRequired,
  contacts: PropTypes.array.isRequired,
  resources: PropTypes.array.isRequired,
};

export default CreateProjectForm;
