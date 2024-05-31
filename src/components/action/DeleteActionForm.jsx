import { useState } from 'react';
import PropTypes from 'prop-types';
import { jwtEncode } from '../../utils/utils';

const DeleteActionForm = ({ onActionDeleted }) => {
  const ClientToken = "6e616f706c61795f73616e64626f78";
  const ClientKey = "4488aa91d7a63630e391";
  const UserToken = "332e6e616f706c61795f73616e64626f78";

  const [actionId, setActionId] = useState('');

  const handleInputChange = (event) => {
    setActionId(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!actionId) {
      console.error('Action ID is required.');
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
        `https://ui.boondmanager.com/api/actions/${actionId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-Jwt-Client-Boondmanager': jwtToken
          }
        }
      );

      if (response.ok) {
        console.log('Action deleted successfully');
        onActionDeleted();
      } else {
        console.log('Requête en échec avec un statut HTTP ' + response.status);
      }
    } catch (error) {
      console.error('Erreur lors de la requête API:', error);
    }
  };

  return (
    <div>
      <h2>Supprimer une action</h2>
      <form onSubmit={handleSubmit}>
        <label>
          ID de laction:
          <input
            type="text"
            name="id"
            value={actionId}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit">Supprimer</button>
      </form>
    </div>
  );
};

DeleteActionForm.propTypes = {
  onActionDeleted: PropTypes.func.isRequired
};

export default DeleteActionForm;
