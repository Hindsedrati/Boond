import {useState}from 'react';
import PropTypes from 'prop-types';
import { jwtEncode } from '../../utils/utils';

const DeleteResourceForm = ({ onResourceDeleted }) => {
  const ClientToken = "6e616f706c61795f73616e64626f78";
  const ClientKey = "4488aa91d7a63630e391";
  const UserToken = "332e6e616f706c61795f73616e64626f78";

  const [resourceId, setResourceId] = useState('');

  const handleInputChange = (event) => {
    setResourceId(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        userToken: UserToken,
        clientToken: ClientToken,
        time: Math.floor(Date.now() / 1000),
        mode: 'normal'
      };

      const jwtToken = jwtEncode(payload, ClientKey);

      const response = await fetch(`https://ui.boondmanager.com/api/resources/${resourceId}`, {
        method: 'DELETE',
        headers: {
          'X-Jwt-Client-Boondmanager': jwtToken
        }
      });

      if (response.ok) {
        console.log('Resource deleted');
        onResourceDeleted();
      } else {
        console.log('Requête en échec avec un statut HTTP ' + response.status);
      }
    } catch (error) {
      console.error('Erreur lors de la requête API:', error);
    }
  };

  return (
    <div>
      <h2>Supprimer une ressource</h2>
      <form onSubmit={handleSubmit}>
        <label>
          ID de la ressource:
          <input
            type="text"
            value={resourceId}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit">Supprimer</button>
      </form>
    </div>
  );
};

DeleteResourceForm.propTypes = {
  onResourceDeleted: PropTypes.func.isRequired,
};

export default DeleteResourceForm;
