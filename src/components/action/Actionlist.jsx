import PropTypes from 'prop-types';

const ActionList = ({ actions }) => {
  if (!Array.isArray(actions)) {
    return <p>Pas dactions disponibles</p>;
  }

  return (
    <div>
      <h2>Liste de toutes les actions</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Titre</th>
            <th>Description</th>
            <th>Date</th>
            <th>État</th>
          </tr>
        </thead>
        <tbody>
          {actions.map((action) => (
            <tr key={action.id}>
              <td>{action.id}</td>
              <td>{action.attributes.title}</td>
              <td>{action.attributes.description}</td>
              <td>{action.attributes.date}</td>
              <td>{action.attributes.state}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

ActionList.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      attributes: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        state: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default ActionList;
