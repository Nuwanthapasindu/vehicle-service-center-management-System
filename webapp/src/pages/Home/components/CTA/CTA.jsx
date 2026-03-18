import React from 'react';
import './CTA.css';

function CTA() {
    return (
        <section className="cta-section">
            <div className="cta-container">
                <div className="cta-glow-left"></div>
                <div className="cta-content">
                    <h2 className="cta-headline">Ready to make your car shine like new?</h2>
                    <div className="cta-buttons">
                        <a href="#booking" className="btn-primary cta-btn">Book Now</a>
                        <a href="#contact" className="btn-secondary cta-btn">Contact Us</a>
                    </div>
                </div>
                <div className="cta-glow-right"></div>
            </div>
        </section>
    );
}

export default CTA;
