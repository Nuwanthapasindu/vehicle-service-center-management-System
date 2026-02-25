import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Top Section: Brand & Links */}
        <div className="footer-top">
          
          {/* Brand Column */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="var(--primary)"/>
                </svg>
              </div>
              <span className="logo-text">SHINE DEPOT</span>
            </div>
            <p className="brand-tagline">
              The highest standard of automotive care...
            </p>
            
            {/* Social Icons */}
            <div className="social-icons">
              <a href="#" className="social-link" aria-label="Facebook">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="footer-links">
            
            {/* Company Column */}
            <div className="link-column">
              <h4 className="column-title">COMPANY</h4>
              <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Reviews</a></li>
              </ul>
            </div>

            {/* Services Column */}
            <div className="link-column">
              <h4 className="column-title">SERVICES</h4>
              <ul>
                <li><a href="#">Ceramic Coating</a></li>
                <li><a href="#">Paint Correction</a></li>
                <li><a href="#">Auto Detailing</a></li>
                <li><a href="#">Window Tinting</a></li>
              </ul>
            </div>

            {/* Location Column */}
            <div className="link-column location-column">
              <h4 className="column-title">LOCATION</h4>
              
              <div className="info-item">
                <svg className="info-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span>123 Sample St, Sydney NSW 2000</span>
              </div>

              <div className="info-item">
                <svg className="info-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span>Mon - Fri: 8am - 5pm<br/>Sat: 9am - 12pm</span>
              </div>

              <div className="info-item">
                <svg className="info-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <span>(0) 123 456 789</span>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="footer-bottom">
          <p>© 2024 Shine Depot Management. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;