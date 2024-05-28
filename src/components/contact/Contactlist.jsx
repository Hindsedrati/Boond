import PropTypes from 'prop-types';

const Contactlist = ({ contacts, companies, states }) => {
  console.log("Contacts reçus dans Contactlist:", contacts);

  if (!Array.isArray(contacts)) {
    return <p>Pas de contacts disponibles</p>;
  }

  return (
    <>
      <h2>Liste de tous les contacts</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Fonction</th>
            <th>État</th>
            <th>Société</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td>{contact.id}</td>
              <td>{contact.attributes.lastName}</td>
              <td>{contact.attributes.email1}</td>
              <td>{contact.attributes.function}</td>
              <td>{states[contact.attributes.state]}</td>
              <td>{companies.find(company => company.id === contact.relationships.company.data.id)?.attributes.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

Contactlist.propTypes = {
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      attributes: PropTypes.shape({
        lastName: PropTypes.string.isRequired,
        email1: PropTypes.string.isRequired,
        function: PropTypes.string.isRequired,
        state: PropTypes.number.isRequired,
      }).isRequired,
      relationships: PropTypes.shape({
        company: PropTypes.shape({
          data: PropTypes.shape({
            id: PropTypes.string.isRequired
          }).isRequired
        }).isRequired
      }).isRequired
    })
  ).isRequired,
  companies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      attributes: PropTypes.shape({
        name: PropTypes.string.isRequired
      }).isRequired
    })
  ).isRequired,
  states: PropTypes.object.isRequired
};

export default Contactlist;
