import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="footer-section">
            <div className="footer-container">
                <div className="footer-brand">
                    <Link to="/" className="footer-logo">
                        <div className="logo-icon dark">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="2" width="20" height="20" rx="4" fill="#131313" />
                                <path d="M7 17L17 7M7 7L17 17" stroke="#66DF1B" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div className="logo-text">
                            <span>SHINE</span>
                            <span>DEPOT</span>
                        </div>
                    </Link>
                    <p className="footer-mission">
                        The highest standard of automotive care. Your vehicle is our passion, and perfection is our only metric.
                    </p>
                    <div className="social-links">
                        <a href="#" className="social-icon">IN</a>
                        <a href="#" className="social-icon">IG</a>
                    </div>
                </div>

                <div className="footer-links-wrapper">
                    <div className="footer-column">
                        <h4>COMPANY</h4>
                        <ul className="footer-links">
                            <li><Link to="/home">Home</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact us</Link></li>
                            <li><Link to="/reviews">Reviews</Link></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4>SERVICES</h4>
                        <ul className="footer-links">
                            <li><Link to="/services/ceramic">Ceramic Coating</Link></li>
                            <li><Link to="/services/paint">Paint Correction</Link></li>
                            <li><Link to="/services/interior">Interior Restoration</Link></li>
                            <li><Link to="/services/full">Full Detailing</Link></li>
                        </ul>
                    </div>

                    <div className="footer-column location-column">
                        <h4>LOCATION</h4>
                        <p className="address-text">
                            123 Glass Avenue, Suite 100<br />
                            Automotive District, CA<br />
                            90210
                        </p>
                        <p className="hours-text">
                            Tue - Sun: 8am - 6pm<br />
                            Mon: Closed
                        </p>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Shine Depot Management. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
