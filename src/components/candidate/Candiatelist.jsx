import PropTypes from 'prop-types';

const Candiatelist = ({ candidates }) => {
  console.log("Candidats reçus dans Candiatelist:", candidates);
  
  if (!Array.isArray(candidates)) {
    return <p>Pas de candidats disponibles</p>;
  }

  return (
    <>
      <h2>Liste de tous les candidats</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prénoms</th>
            <th>Civilité</th>
            <th>État</th>
            <th>Fonction</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate.id}>
              <td>{candidate.id}</td>
              <td>{candidate.attributes.lastName}</td>
              <td>{candidate.attributes.firstName}</td>
              <td>{candidate.attributes.civility}</td>
              <td>{candidate.attributes.state}</td>
              <td>{candidate.attributes.title}</td>
              <td>{candidate.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

Candiatelist.propTypes = {
  candidates: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      attributes: PropTypes.shape({
        lastName: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        civility: PropTypes.number.isRequired,
        state: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
      }).isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Candiatelist;
