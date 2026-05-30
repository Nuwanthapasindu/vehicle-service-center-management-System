import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="header-brand">
                    <div className="brand-logo">
                        <img src="logo.jpeg" alt="" className='brand-logo' />
                    </div>
                    <div className="brand-text">
                        <span>SHINE</span>
                        <span>DEPOT</span>
                    </div>
                </Link>

                <nav className={`header-nav ${isMobileMenuOpen ? 'active' : ''}`}>
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/gallery" className="nav-link">Gallery</Link>
                    <Link to="/reviews" className="nav-link">Reviews</Link>
                    <Link to="/about" className="nav-link">About Us</Link>
                    <Link to="/contact" className="nav-link">Contact Us</Link>
                </nav>

                <div className="header-actions">
                    <Link to="/login" className="login-btn">Log In</Link>
                    <Link to="/customer/service-booking" className="book-btn" style={{ textDecoration: 'none', textAlign: 'center', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>BOOK A SLOT</Link>

                    <button
                        className="mobile-toggle"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;
