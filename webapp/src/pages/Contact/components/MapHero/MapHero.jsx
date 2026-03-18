import React from 'react';
import './MapHero.css';

function MapHero() {
    return (
        <section className="map-hero-section">
            {/* Background Map Image Placeholder */}
            <div className="map-background"></div>

            <div className="map-overlay-container">
                <div className="service-center-card">
                    <div className="card-left">
                        <h2>Our Service Center</h2>
                        <p>124 Shine Avenue, Automotive District, FL 33101</p>
                    </div>
                    <div className="card-right">
                        <span className="hours-label">OPERATING HOURS</span>
                        <p className="hours-time">Mon - Sat: 08:00 AM - 07:00 PM</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default MapHero;
