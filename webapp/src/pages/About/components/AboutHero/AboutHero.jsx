import React from 'react';
import './AboutHero.css';

function AboutHero() {
    return (
        <section className="about-hero-section">
            <div className="about-hero-container">
                <div className="about-hero-content">
                    <span className="since-badge">SINCE 2012</span>
                    <h1 className="about-hero-title">
                        Detailing by <br />
                        <span className="text-highlight">Professionals.</span>
                    </h1>
                    <p className="about-hero-description">
                        At Shine Depot, we don't just wash cars; we pursue automotive art.
                        Our journey began with a simple mission: to provide the highest level
                        of protection and care for the world's most exquisite vehicles.
                    </p>
                    <div className="about-hero-stats">
                        <div className="stat">
                            <h2>12+</h2>
                            <p>YEARS EXPERIENCE</p>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat">
                            <h2>5K+</h2>
                            <p>CARS PROTECTED</p>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat">
                            <h2>15+</h2>
                            <p>MASTER DETAILERS</p>
                        </div>
                    </div>
                </div>
                <div className="about-hero-image">
                    <img src="https://images.unsplash.com/photo-1601362840469-51e4d8d587ce?auto=format&fit=crop&q=80&w=800" alt="Professional Detailing" />
                </div>
            </div>
        </section>
    );
}

export default AboutHero;
