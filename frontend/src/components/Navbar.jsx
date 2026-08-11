import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/" style={{ fontWeight: 800, fontSize: '1.1rem' }}>
        HealthTwin
      </Link>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/digital-twin">Digital Twin</Link>
        <Link to="/simulation">Simulation</Link>
      </div>
    </nav>
  );
}

export default Navbar;
