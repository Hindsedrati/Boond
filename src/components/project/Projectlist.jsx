import PropTypes from 'prop-types';

const ProjectList = ({ projects }) => {
  if (!projects || projects.length === 0) {
    return <p>Pas de projets disponibles</p>;
  }

  return (
    <>
      <h2>Liste de tous les projets</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Description</th>
            <th>État</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.id}</td>
              <td>{project.attributes.name}</td>
              <td>{project.attributes.description}</td>
              <td>{project.attributes.state}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

ProjectList.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      attributes: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        state: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default ProjectList;
