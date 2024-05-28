//import React from 'react';
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
        
      </ul>
    </nav>
  );
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
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
  }
};

export default Header;
