import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-top">

                    {/* Brand Info */}
                    <div className="footer-brand-section">
                        <Link to="/" className="footer-brand">
                            <div className="brand-logo">
                                <img src="logo.jpeg" alt="" className='brand-logo' />
                            </div>
                            <div className="brand-text">
                                <span>SHINE</span>
                                <span>DEPOT</span>
                            </div>
                        </Link>
                        <p className="footer-description">
                            The highest standard of automotive care. Your vehicle is our passion, and perfection is our only metric.
                        </p>
                        <div className="footer-social">
                            <a href="#" className="social-icon"><i className="fa-brands fa-instagram"></i></a>
                            <a href="#" className="social-icon"><i className="fa-solid fa-camera"></i></a>
                        </div>
                    </div>

                    {/* Company Links */}
                    <div className="footer-links-section">
                        <h4 className="footer-heading">COMPANY</h4>
                        <div className="footer-links">
                            <Link to="/">Home</Link>
                            <Link to="/about">About us</Link>
                            <Link to="/contact">Contact us</Link>
                            <Link to="/reviews">Reviews</Link>
                        </div>
                    </div>

                    {/* Services Links */}
                    <div className="footer-links-section">
                        <h4 className="footer-heading">SERVICES</h4>
                        <div className="footer-links">
                            <Link to="#">Ceramic Coating</Link>
                            <Link to="#">Paint Correction</Link>
                            <Link to="#">Interior Restoration</Link>
                            <Link to="#">Full Detailing</Link>
                        </div>
                    </div>

                    {/* Location Info */}
                    <div className="footer-location-section">
                        <h4 className="footer-heading">LOCATION</h4>
                        <div className="footer-location-info">
                            <p>123 Gloss Avenue, Suite 100<br />Automotive District, CA<br />90210</p>
                            <p className="footer-hours">Tue - Sun: 8am - 6pm<br />Mon: Closed</p>
                        </div>
                    </div>

                </div>

                <div className="footer-bottom">
                    <p>&copy; 2024 Shine Depot Management. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
