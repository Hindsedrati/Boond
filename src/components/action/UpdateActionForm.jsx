import { useState } from 'react';
import PropTypes from 'prop-types';
import { jwtEncode } from '../../utils/utils';

const UpdateActionForm = ({ onActionUpdated }) => {
  const ClientToken = "6e616f706c61795f73616e64626f78";
  const ClientKey = "4488aa91d7a63630e391";
  const UserToken = "332e6e616f706c61795f73616e64626f78";

  const [actionData, setActionData] = useState({
    id: '',
    attributes: {
      date: '',
      category: '',
      type: '',
      reference: '',
      contact: '',
      action: '',
      manager: '',
      doc: ''
    }
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setActionData((prevState) => ({
      ...prevState,
      attributes: {
        ...prevState.attributes,
        [name]: value
      }
    }));
  };

  const handleIdChange = (event) => {
    setActionData((prevState) => ({
      ...prevState,
      id: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!actionData.id || !actionData.attributes.date || !actionData.attributes.type) {
      console.error('ID, Date, and Type are required.');
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
        `https://ui.boondmanager.com/api/actions/${actionData.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Jwt-Client-Boondmanager': jwtToken
          },
          body: JSON.stringify({ data: actionData })
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log('API Response:', result);
        onActionUpdated();
      } else {
        console.log('Requête en échec avec un statut HTTP ' + response.status);
      }
    } catch (error) {
      console.error('Erreur lors de la requête API:', error);
    }
  };

  return (
    <div>
      <h2>Mettre à jour une action</h2>
      <form onSubmit={handleSubmit}>
        <label>
          ID de laction:
          <input
            type="text"
            name="id"
            value={actionData.id}
            onChange={handleIdChange}
          />
        </label>
        <label>
          Date:
          <input
            type="text"
            name="date"
            value={actionData.attributes.date}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Catégorie:
          <input
            type="text"
            name="category"
            value={actionData.attributes.category}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Type:
          <input
            type="text"
            name="type"
            value={actionData.attributes.type}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Référence:
          <input
            type="text"
            name="reference"
            value={actionData.attributes.reference}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Contact:
          <input
            type="text"
            name="contact"
            value={actionData.attributes.contact}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Action:
          <input
            type="text"
            name="action"
            value={actionData.attributes.action}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Manager:
          <input
            type="text"
            name="manager"
            value={actionData.attributes.manager}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Doc:
          <input
            type="text"
            name="doc"
            value={actionData.attributes.doc}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  );
};

UpdateActionForm.propTypes = {
  onActionUpdated: PropTypes.func.isRequired
};

export default UpdateActionForm;
