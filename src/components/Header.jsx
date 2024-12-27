import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <Link to="/" style={styles.navLink}>BoondManager</Link>
      </div>
      <ul style={styles.navList}>
        <li style={styles.navItem}>
          <Link to="/" style={styles.navLink}>Home</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/candidates" style={styles.navLink}>Candidates</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/contacts" style={styles.navLink}>Contacts</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/resources" style={styles.navLink}>Resources</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/projects" style={styles.navLink}>Projects</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/actions" style={styles.navLink}>Actions</Link>
        </li>
        <li style={styles.navItem} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
          <span style={styles.navLink}>Reporting</span>
          <ul style={styles.dropdownList}>
            <li style={styles.dropdownItem}>
              <Link to="/reporting-companies" style={styles.dropdownLink}>Companies</Link>
            </li>
            <li style={styles.dropdownItem}>
              <Link to="/reporting-production-plans" style={styles.dropdownLink}>Production Plans</Link>
            </li>
            <li style={styles.dropdownItem}>
              <Link to="/reporting-projects" style={styles.dropdownLink}>Projects</Link>
            </li>
            <li style={styles.dropdownItem}>
              <Link to="/reporting-resources" style={styles.dropdownLink}>Resources</Link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );

  function handleMouseOver(e) {
    const dropdown = e.currentTarget.querySelector('ul');
    dropdown.style.display = 'block';
  }

  function handleMouseOut(e) {
    const dropdown = e.currentTarget.querySelector('ul');
    dropdown.style.display = 'none';
  }
};

const styles = {
  navbar: {
    width: '100%',
    backgroundColor: '#1976d2',
    padding: '10px 10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'fixed',
    top: '0',
    left: '0',
    zIndex: '1000',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  navList: {
    listStyle: 'none',
    display: 'flex',
    marginRight: '30px',
    padding: '0',
  },
  navItem: {
    margin: '0 10px',
    position: 'relative',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
  },
  dropdownList: {
    display: 'none',
    position: 'absolute',
    top: '100%',
    left: '0',
    backgroundColor: '#1976d2',
    listStyle: 'none',
    padding: '0',
    margin: '0',
    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
    zIndex: '1000',
  },
  dropdownItem: {
    margin: '0',
  },
  dropdownLink: {
    display: 'block',
    padding: '10px 20px',
    color: 'white',
    textDecoration: 'none',
  },
};

export default Header;
