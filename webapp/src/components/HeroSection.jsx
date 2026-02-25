import React from 'react';
import '../styles/HeroSection.css';

const HeroSection = () => {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <main className="hero-section">
        {/* Background Image with Overlay */}
        <div className="hero-bg-image"></div>
        <div className="hero-overlay"></div>

        {/* Content */}
        <div className="hero-content">
          <span className="hero-tag">NOW ACCEPTING BOOKINGS</span>
          
          <h1 className="hero-title">
            Precision <br/>
            Detailing
          </h1>
          
          <h2 className="hero-subtitle">For The Driven.</h2>
          
          <p className="hero-description">
            Experience the ultimate in automotive care with our professional detailing services. 
            We offer ceramic coating, interior restoration, and more to keep your vehicle pristine.
          </p>

          <div className="hero-actions">
            <button className="btn-primary">
              Book Your Slot
            </button>
            <button className="btn-secondary">
              View Services
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HeroSection;