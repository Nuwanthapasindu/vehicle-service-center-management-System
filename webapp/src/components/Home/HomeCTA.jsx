import React from 'react';
import { Link } from 'react-router-dom';
import './HomeCTA.css';

const HomeCTA = () => {
    return (
        <section className="home-cta m-section-padding">
            <div className="m-container">
                <div className="cta-banner shadow-lg">
                    <div className="cta-content">
                        <h2 className="m-hero-title" style={{color: '#FFFFFF', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)'}}>Ready to make your car <br/><span>shine like new?</span></h2>
                        <div className="cta-btns">
                            <Link to="/customer/service-booking" className="m-btn-lime">
                                Book Now <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                            <Link to="/contact" className="m-btn-outline" style={{borderColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF'}}>
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeCTA;
