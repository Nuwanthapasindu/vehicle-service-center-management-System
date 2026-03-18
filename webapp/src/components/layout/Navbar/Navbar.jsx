import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="navbar-container">
            <div className="navbar-wrapper">
                {/* LOGO */}
                <Link to="/" className="navbar-logo">
                    <div className="logo-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="2" y="2" width="20" height="20" rx="4" fill="#131313" />
                            <path d="M7 17L17 7M7 7L17 17" stroke="#66DF1B" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div className="logo-text">
                        <span>SHINE</span>
                        <span>DEPOT</span>
                    </div>
                </Link>

                {/* MOBILE MENU BUTTON */}
                <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {isOpen ? (
                            <path d="M18 6L6 18M6 6L18 18" stroke="#131313" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        ) : (
                            <path d="M4 6H20M4 12H20M4 18H20" stroke="#131313" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        )}
                    </svg>
                </button>

                {/* NAVIGATION LINKS */}
                <nav className={`navbar-links ${isOpen ? 'active' : ''}`}>
                    <a href="#home" onClick={() => setIsOpen(false)}>Home</a>
                    <a href="#about" onClick={() => setIsOpen(false)}>About us</a>
                    <a href="#contact" onClick={() => setIsOpen(false)}>Contact us</a>
                    <a href="#reviews" onClick={() => setIsOpen(false)}>Reviews</a>
                </nav>

                {/* ACTION BUTTONS */}
                <div className={`navbar-actions ${isOpen ? 'active' : ''}`}>
                    <Link to="/login" className="login-link">Log In</Link>
                    <a href="#book" className="book-btn">BOOK A SLOT</a>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
