import { useState } from 'react';
import PropTypes from 'prop-types';
import { jwtEncode } from "../../utils/utils";

const CreateResourceForm = ({ onResourceCreated }) => {
  const ClientToken = "6e616f706c61795f73616e64626f78"; 
  const ClientKey = "4488aa91d7a63630e391";     
  const UserToken = "332e6e616f706c61795f73616e64626f78";     

  const [resourceData, setResourceData] = useState({
    type: "resource",
    attributes: {
      name: "",
      title: "",
      state: 0,
      availability: "",
      hourlyRate: "",
      contactDetails: "",
      position: "",
      manager: "",
      cv: ""
    }
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setResourceData(prevState => ({
      ...prevState,
      attributes: {
        ...prevState.attributes,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!resourceData.attributes.name) {
      setErrorMessage("Le champ Nom est obligatoire.");
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
        "https://ui.boondmanager.com/api/resources",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Jwt-Client-Boondmanager": jwtToken,
          },
          body: JSON.stringify({ data: resourceData })
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Resource created:", result);
        setErrorMessage("");
        onResourceCreated();
      } else {
        console.log("Requête en échec avec un statut HTTP " + response.status);
      }
    } catch (error) {
      console.error("Erreur lors de la requête API:", error);
    }
  };

  return (
    <div>
      <h2>Créer une ressource</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Nom:
          <input
            type="text"
            name="name"
            value={resourceData.attributes.name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Titre:
          <input
            type="text"
            name="title"
            value={resourceData.attributes.title}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Disponibilité:
          <input
            type="text"
            name="availability"
            value={resourceData.attributes.availability}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Tarif horaire:
          <input
            type="text"
            name="hourlyRate"
            value={resourceData.attributes.hourlyRate}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Coordonnées:
          <input
            type="text"
            name="contactDetails"
            value={resourceData.attributes.contactDetails}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Position:
          <input
            type="text"
            name="position"
            value={resourceData.attributes.position}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Manager:
          <input
            type="text"
            name="manager"
            value={resourceData.attributes.manager}
            onChange={handleInputChange}
          />
        </label>
        <label>
          CV:
          <input
            type="text"
            name="cv"
            value={resourceData.attributes.cv}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit">Créer</button>
      </form>
    </div>
  );
};

CreateResourceForm.propTypes = {
  onResourceCreated: PropTypes.func.isRequired,
};

export default CreateResourceForm;
