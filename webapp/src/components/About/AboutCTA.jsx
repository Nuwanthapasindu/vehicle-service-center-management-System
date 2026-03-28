import React from 'react';
import { Link } from 'react-router-dom';
import './AboutCTA.css';

const AboutCTA = () => {
    return (
        <section className="cta-section">
            <div className="cta-banner">
                <div className="cta-content">
                    <h2>Ready for a Next <span>Transformation?</span></h2>
                    <p>Experience the highest level of detail for your vehicle today with our master detailing team.</p>
                    <div className="cta-btns">
                        <Link to="/customer/service-booking" className="btn-lime">
                            BOOK A TRANSFORMATION <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                        <Link to="/about" className="btn-outline">
                            OUR SERVICES
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutCTA;
