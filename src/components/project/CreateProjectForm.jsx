import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { jwtEncode } from '../../utils/utils';

const CreateProjectForm = ({ onProjectCreated, contacts = [], companies = [], resources = [] }) => {
  const ClientToken = "6e616f706c61795f73616e64626f78";
  const ClientKey = "4488aa91d7a63630e391";
  const UserToken = "332e6e616f706c61795f73616e64626f78";

  // Log resources to verify they are passed correctly
  useEffect(() => {
    console.log('Resources:', resources);
  }, [resources]);

  const [projectData, setProjectData] = useState({
    attributes: {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      projectType: '', // Initially empty
      typeOf: '' // Ensure this attribute is included
    },
    relationships: {
      contact: {
        data: {
          id: '',
          type: 'contact'
        }
      },
      company: {
        data: {
          id: '',
          type: 'company'
        }
      },
      resources: {
        data: []
      }
    }
  });

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

  const handleRelationshipChange = (event) => {
    const { name, value, options } = event.target;
    if (name === 'resources') {
      const selectedResources = [];
      for (let i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
          selectedResources.push({ id: options[i].value, type: 'resource' });
        }
      }
      setProjectData((prevState) => ({
        ...prevState,
        relationships: {
          ...prevState.relationships,
          resources: {
            data: selectedResources
          }
        }
      }));
    } else {
      setProjectData((prevState) => ({
        ...prevState,
        relationships: {
          ...prevState.relationships,
          [name]: {
            data: {
              id: value,
              type: name
            }
          }
        }
      }));
    }
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

      const response = await fetch('https://ui.boondmanager.com/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Jwt-Client-Boondmanager': jwtToken
        },
        body: JSON.stringify({ data: projectData })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('API Response:', result);
        onProjectCreated();
      } else {
        const errorResult = await response.json();
        console.error('Request failed with status:', response.status, 'and message:', errorResult.errors);
      }
    } catch (error) {
      console.error('Error during API request:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Project</h2>
      <label>
        Titre du besoin/opportunité daffaires:
        <input type="text" name="title" value={projectData.attributes.title} onChange={handleInputChange} required />
      </label>
      <label>
        Description:
        <input type="text" name="description" value={projectData.attributes.description} onChange={handleInputChange} required />
      </label>
      <label>
        Start Date:
        <input type="date" name="startDate" value={projectData.attributes.startDate} onChange={handleInputChange} required />
      </label>
      <label>
        End Date:
        <input type="date" name="endDate" value={projectData.attributes.endDate} onChange={handleInputChange} required />
      </label>
      <label>
        Agence:
        <input type="text" name="agency" value="NAOPLAY - SANDBOX" disabled />
      </label>
      <label>
        Type de projet:
        <select name="projectType" value={projectData.attributes.projectType} onChange={handleInputChange} required>
          <option value="">Select a project type</option>
          <option value="Régie">Régie</option>
          <option value="Forfait">Forfait</option>
          <option value="Recrutement">Recrutement</option>
          <option value="Produit">Produit</option>
          <option value="Projet Interne">Projet Interne</option>
        </select>
      </label>
      <label>
        Contact:
        <select name="contact" value={projectData.relationships.contact.data.id} onChange={handleRelationshipChange} required>
          <option value="">Select a contact</option>
          {contacts.map((contact) => (
            <option key={contact.id} value={contact.id}>
              {contact.attributes.firstName} {contact.attributes.lastName}
            </option>
          ))}
        </select>
      </label>
      <label>
        Company:
        <select name="company" value={projectData.relationships.company.data.id} onChange={handleRelationshipChange} required>
          <option value="">Select a company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.attributes.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Resources:
        <select name="resources" multiple value={projectData.relationships.resources.data.map((resource) => resource.id)} onChange={handleRelationshipChange} style={{ width: '100%', height: '150px' }}>
          {resources.length > 0 ? (
            resources.map((resource) => (
              <option key={resource.id} value={resource.id}>
                {resource.attributes.name || 'Unnamed Resource'}
              </option>
            ))
          ) : (
            <option disabled>No resources available</option>
          )}
        </select>
      </label>
      <button type="submit">Créer</button>
      <button
        type="button"
        onClick={() =>
          setProjectData({
            attributes: {
              title: '',
              description: '',
              startDate: '',
              endDate: '',
              projectType: '',
              typeOf: '' // Ensure this is reset as well
            },
            relationships: {
              contact: {
                data: {
                  id: '',
                  type: 'contact'
                }
              },
              company: {
                data: {
                  id: '',
                  type: 'company'
                }
              },
              resources: {
                data: []
              }
            }
          })
        }
      >
        Annuler
      </button>
    </form>
  );
};

CreateProjectForm.propTypes = {
  onProjectCreated: PropTypes.func.isRequired,
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      attributes: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired
      }).isRequired
    })
  ),
  companies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      attributes: PropTypes.shape({
        name: PropTypes.string.isRequired
      }).isRequired
    })
  ),
  resources: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      attributes: PropTypes.shape({
        name: PropTypes.string
      }).isRequired
    })
  )
};

export default CreateProjectForm;
