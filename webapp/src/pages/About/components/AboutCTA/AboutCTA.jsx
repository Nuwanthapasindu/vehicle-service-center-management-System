import React from 'react';
import './AboutCTA.css';

function AboutCTA() {
    return (
        <section className="about-cta-section">
            <div className="about-cta-container">
                <div className="about-cta-glow-left"></div>
                <div className="about-cta-content">
                    <h2 className="about-cta-headline">
                        Ready for a <span className="cta-highlight">Transformation?</span>
                    </h2>
                    <p className="about-cta-subtext">
                        Experience the standard of automotive care that has kept our clients returning for over a decade.
                    </p>
                    <div className="about-cta-buttons">
                        <a href="#booking" className="btn-primary cta-btn">Book a Transformation</a>
                        <a href="#services" className="btn-secondary cta-btn">Our Services</a>
                    </div>
                </div>
                <div className="about-cta-glow-right"></div>
            </div>
        </section>
    );
}

export default AboutCTA;
