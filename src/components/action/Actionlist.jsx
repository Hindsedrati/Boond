import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { jwtEncode } from '../../utils/utils';

const ActionList = () => {
  const [actions, setActions] = useState([]);
  const ClientToken = "6e616f706c61795f73616e64626f78";
  const ClientKey = "4488aa91d7a63630e391";
  const UserToken = "332e6e616f706c61795f73616e64626f78";

  useEffect(() => {
    const fetchActions = async () => {
      const payload = {
        userToken: UserToken,
        clientToken: ClientToken,
        time: Math.floor(Date.now() / 1000),
        mode: 'normal'
      };

      const jwtToken = jwtEncode(payload, ClientKey);

      try {
        const response = await fetch('https://ui.boondmanager.com/api/actions', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Jwt-Client-Boondmanager': jwtToken
          }
        });

        if (response.ok) {
          const result = await response.json();
          setActions(result.data);
        } else {
          console.error('Failed to fetch actions:', response.status);
        }
      } catch (error) {
        console.error('Error during API request:', error);
      }
    };

    fetchActions();
  }, []);

  return (
    <div>
      <h2>Liste des actions</h2>
      <ul>
        {actions.map((action) => (
          <li key={action.id}>
            {action.attributes.title} - {action.attributes.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

ActionList.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      attributes: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired
      }).isRequired
    })
  )
};

export default ActionList;
