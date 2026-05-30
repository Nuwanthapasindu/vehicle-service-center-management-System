import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import serviceService from "../../services/serviceService";

function Footer() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await serviceService.getPublicServices();
        const fetchedServices = response.data?.payload?.services || [];
        setServices(fetchedServices.slice(0, 4));
      } catch (error) {
        console.error("Error fetching services for footer:", error);
      }
    };
    fetchServices();
  }, []);

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          {/* Brand Info */}
          <div className="footer-brand-section">
            <Link to="/" className="footer-brand">
              <div className="brand-logo">
                <img src="logo.jpeg" alt="" className="brand-logo" />
              </div>
              <div className="brand-text">
                <span>SHINE</span>
                <span>DEPOT</span>
              </div>
            </Link>
            <p className="footer-description">
              The highest standard of automotive care. Your vehicle is our
              passion, and perfection is our only metric.
            </p>
            <div className="footer-social">
              <a href="https://www.facebook.com/shinedepotlk/" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="https://www.instagram.com/shinedepotlk/" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="fa-brands fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div className="footer-links-section">
            <h4 className="footer-heading">COMPANY</h4>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/gallery">Gallery</Link>
              <Link to="/reviews">Reviews</Link>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact Us</Link>
            </div>
          </div>

          {/* Services Links */}
          <div className="footer-links-section">
            <h4 className="footer-heading">SERVICES</h4>
            <div className="footer-links">
              {services.length > 0 ? (
                services.map((service) => (
                  <Link key={service._id} to="/customer/service-booking">
                    {service.name}
                  </Link>
                ))
              ) : (
                <>
                  <Link to="/customer/service-booking">Ceramic Coating</Link>
                  <Link to="/customer/service-booking">Paint Correction</Link>
                  <Link to="/customer/service-booking">Interior Restoration</Link>
                  <Link to="/customer/service-booking">Full Detailing</Link>
                </>
              )}
            </div>
          </div>

          {/* Location Info */}
          <div className="footer-location-section">
            <h4 className="footer-heading">LOCATION</h4>
            <div className="footer-location-info">
              <p>
                108 Old Kottawa Rd, Nugegoda
                <br />
                Sri Lanka
                <br />
              </p>
              <p className="footer-hours">
                Tue - Sun: 8.30am - 6.00pm
                <br />
                Mon: Closed
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Shine Depot Management. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
