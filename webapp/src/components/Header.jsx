import React from 'react';
import '../styles/variable.css';
import "../styles/Header.css";
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="logo-container">
        <div className="logo-icon">
          <img src="" alt="Logo" />
        </div>
        <span className="logo-text">SHINE DEPOT</span>
      </div>

      <nav className="nav-menu">
        <ul>
          <li>
            <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>Home</Link>
          </li>
          <li>
            <Link to="/about" className={`nav-link ${location.pathname === "/about" ? "active" : ""}`}>About Us</Link>
          </li>
          <li>
            <Link to="/contact" className={`nav-link ${location.pathname === "/contact" ? "active" : ""}`}>Contact Us</Link>
          </li>
          <li>
            <Link to="/reviews" className={`nav-link ${location.pathname === "/reviews" ? "active" : ""}`}>Reviews</Link>
          </li>
        </ul>
      </nav>

      <div className="auth-actions">
        <Link to="/login" className="btn-login">Login</Link>
        <button className="btn-book">BOOK A SLOT</button>
      </div>
    </header>
  );
};

export default Header;