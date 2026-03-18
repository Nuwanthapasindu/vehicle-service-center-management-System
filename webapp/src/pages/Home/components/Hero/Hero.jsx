import React from 'react';
import './Hero.css';

function Hero() {
    return (
        <section className="hero-section">
            <div className="hero-background-overlay"></div>

            <div className="hero-content">
                <div className="status-badge">
                    <span className="dot"></span>
                    <span>NOW ACCEPTING BOOKINGS</span>
                </div>

                <h1 className="hero-headline">
                    Precision Detailing <br />
                    <span className="text-highlight">For The Driven.</span>
                </h1>

                <p className="hero-subheadline">
                    Experience the ultimate in automotive care. Professional
                    ceramic coating, interior restoration, and paint protection
                    designed for car enthusiasts.
                </p>

                <div className="hero-buttons">
                    <a href="#booking" className="btn-primary">
                        Book Your Slot
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                    <a href="#services" className="btn-secondary">
                        View Services
                    </a>
                </div>
            </div>

            <div className="stats-bar">
                <div className="stat-item">
                    <div className="stat-icon">🛡️</div>
                    <div className="stat-text">
                        <h4>1,200+</h4>
                        <p>CARS PROTECTED</p>
                    </div>
                </div>
                <div className="stat-item">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-text">
                        <h4>4.9/5.0</h4>
                        <p>CLIENT RATING</p>
                    </div>
                </div>
                <div className="stat-item">
                    <div className="stat-icon">🏆</div>
                    <div className="stat-text">
                        <h4>Ceramic Pro</h4>
                        <p>CERTIFIED INSTALLER</p>
                    </div>
                </div>
                <div className="stat-item">
                    <div className="stat-icon">⏱️</div>
                    <div className="stat-text">
                        <h4>12 Years</h4>
                        <p>COMBINED EXPERIENCE</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
