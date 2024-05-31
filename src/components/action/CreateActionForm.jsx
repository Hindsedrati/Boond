import { useState } from 'react';
import PropTypes from 'prop-types';
import { jwtEncode } from '../../utils/utils';

const CreateActionForm = ({ onActionCreated }) => {
  const ClientToken = "6e616f706c61795f73616e64626f78";
  const ClientKey = "4488aa91d7a63630e391";
  const UserToken = "332e6e616f706c61795f73616e64626f78";

  const [actionData, setActionData] = useState({
    type: 'action',
    attributes: {
      startDate: '',
      endDate: '',
      startTimezone: '',
      endTimezone: '',
      typeOf: '',
      title: '',
      description: '',
      text: '',
      location: '',
      guests: [],
      synchronizeWithAdvancedAppCalendar: false,
    },
    relationships: {
      mainManager: {
        data: {
          id: '',
          type: 'resource'
        }
      },
      dependsOn: {
        data: {
          id: '',
          type: 'resource' // or 'candidate', 'contact', etc.
        }
      },
      company: {
        data: {
          id: '',
          type: 'company'
        }
      }
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

  const handleRelationshipChange = (event) => {
    const { name, value } = event.target;
    setActionData((prevState) => ({
      ...prevState,
      relationships: {
        ...prevState.relationships,
        [name]: {
          data: {
            ...prevState.relationships[name].data,
            id: value
          }
        }
      }
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!actionData.attributes.typeOf || !actionData.relationships.dependsOn.data.id) {
      console.error('Action type and dependency ID are required.');
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
        'https://ui.boondmanager.com/api/actions',
        {
          method: 'POST',
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
        onActionCreated();
      } else {
        console.log('Request failed with HTTP status ' + response.status);
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  return (
    <div>
      <h2>Create an Action</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={actionData.attributes.title}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Description:
          <input
            type="text"
            name="description"
            value={actionData.attributes.description}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Type Of:
          <input
            type="number"
            name="typeOf"
            value={actionData.attributes.typeOf}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Depends On (Resource/Candidate/Contact/etc ID):
          <input
            type="text"
            name="dependsOn"
            value={actionData.relationships.dependsOn.data.id}
            onChange={handleRelationshipChange}
          />
        </label>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

CreateActionForm.propTypes = {
  onActionCreated: PropTypes.func.isRequired
};

export default CreateActionForm;
