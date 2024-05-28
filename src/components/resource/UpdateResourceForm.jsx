import { useState } from 'react';
import PropTypes from 'prop-types';
import { jwtEncode } from '../../utils/utils';

const UpdateResourceForm = ({ onResourceUpdated }) => {
  const ClientToken = "6e616f706c61795f73616e64626f78";
  const ClientKey = "4488aa91d7a63630e391";
  const UserToken = "332e6e616f706c61795f73616e64626f78";

  const [resourceId, setResourceId] = useState('');
  const [resourceData, setResourceData] = useState({
    attributes: {
      name: '',
      title: '',
      availability: '',
      rate: '',
      coordinates: '',
      position: '',
      manager: '',
      cv: ''
    }
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setResourceData((prevState) => ({
      ...prevState,
      attributes: {
        ...prevState.attributes,
        [name]: value
      }
    }));
  };

  const handleIdChange = (event) => {
    setResourceId(event.target.value);
  };

  const handleSearch = async () => {
    if (!resourceId) {
      console.error('Resource ID is required.');
      return;
    }

    try {
      const payload = {
        userToken: UserToken,
        clientToken: ClientToken,
        time: Math.floor(Date.now() / 1000),
        mode: 'normal'
      };

      const jwtToken = jwtEncode(payload, ClientKey);

      const response = await fetch(
        `https://ui.boondmanager.com/api/resources/${resourceId}`,
        {
          method: 'GET',
          headers: {
            'X-Jwt-Client-Boondmanager': jwtToken
          }
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log('API Response:', result);
        const attributes = result.data.attributes || {};
        setResourceData({
          attributes: {
            name: attributes.name || '',
            title: attributes.title || '',
            availability: attributes.availability || '',
            rate: attributes.rate || '',
            coordinates: attributes.coordinates || '',
            position: attributes.position || '',
            manager: attributes.manager || '',
            cv: attributes.cv || ''
          }
        });
      } else {
        console.log('Requête en échec avec un statut HTTP ' + response.status);
      }
    } catch (error) {
      console.error('Erreur lors de la requête API:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!resourceId || !resourceData.attributes.name) {
      console.error('Resource ID and Name are required.');
      return;
    }

    try {
      const payload = {
        userToken: UserToken,
        clientToken: ClientToken,
        time: Math.floor(Date.now() / 1000),
        mode: 'normal'
      };

      const jwtToken = jwtEncode(payload, ClientKey);

      const response = await fetch(
        `https://ui.boondmanager.com/api/resources/${resourceId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Jwt-Client-Boondmanager': jwtToken
          },
          body: JSON.stringify({ data: { id: resourceId, attributes: resourceData.attributes } })
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log('API Response:', result);
        onResourceUpdated();
      } else {
        console.log('Requête en échec avec un statut HTTP ' + response.status);
      }
    } catch (error) {
      console.error('Erreur lors de la requête API:', error);
    }
  };

  return (
    <div>
      <h2>Mettre à jour une ressource</h2>
      <form onSubmit={handleSubmit}>
        <label>
          ID de la ressource:
          <input
            type="text"
            name="id"
            value={resourceId}
            onChange={handleIdChange}
          />
          <button type="button" onClick={handleSearch}>Rechercher</button>
        </label>
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
          Tarif HT:
          <input
            type="text"
            name="rate"
            value={resourceData.attributes.rate}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Coordonnées:
          <input
            type="text"
            name="coordinates"
            value={resourceData.attributes.coordinates}
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
        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  );
};

UpdateResourceForm.propTypes = {
  onResourceUpdated: PropTypes.func.isRequired
};

export default UpdateResourceForm;
