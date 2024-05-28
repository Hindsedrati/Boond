import PropTypes from 'prop-types';

const ResourceList = ({ resources }) => {
  return (
    <div>
      <h2>Liste des ressources</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Titre</th>
            <th>Disponibilité</th>
            <th>Tarif HT</th>
            <th>Coordonnées</th>
            <th>Position</th>
            <th>Manager</th>
            <th>CV</th>
          </tr>
        </thead>
        <tbody>
          {resources.map(resource => (
            <tr key={resource.id}>
              <td>{resource.id}</td>
              <td>{resource.attributes.name}</td>
              <td>{resource.attributes.title}</td>
              <td>{resource.attributes.availability}</td>
              <td>{resource.attributes.rate}</td>
              <td>{resource.attributes.coordinates}</td>
              <td>{resource.attributes.position}</td>
              <td>{resource.attributes.manager}</td>
              <td>{resource.attributes.cv}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

ResourceList.propTypes = {
  resources: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      attributes: PropTypes.shape({
        name: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        availability: PropTypes.string.isRequired,
        rate: PropTypes.string.isRequired,
        coordinates: PropTypes.string.isRequired,
        position: PropTypes.string.isRequired,
        manager: PropTypes.string.isRequired,
        cv: PropTypes.string.isRequired
      }).isRequired
    })
  ).isRequired
};

export default ResourceList;
