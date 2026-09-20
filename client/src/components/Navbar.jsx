import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaSearch } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="eventx-nav">
      <div className="eventx-nav-inner">
        <Link to="/" className="eventx-brand"><b>EVENT<span>X</span></b></Link>
        <div className="eventx-nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <a href="/#events">Events</a>
          <a href="/#events">Explore</a>
          <a href="/#events">About</a>
        </div>
        <div className="eventx-nav-actions">
          <a href="/#events" className="nav-search-icon" aria-label="Search events"><FaSearch /></a>
          {user ? (
            <>
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="nav-login">Dashboard</Link>
              <button onClick={handleLogout} className="nav-signup">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-login">Login</Link>
              <Link to="/register" className="nav-signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
