import React from 'react';
import aboutHero from '../../assets/imgs/about/about_hero.png';
import './AboutHero.css';

const AboutHero = () => {
    return (
        <section className="about-hero m-section-padding">
            <div className="m-container">
                <div className="about-hero-flex">
                    <div className="about-hero-left">
                        <span className="m-section-tag">since 2012</span>
                        <h1 className="m-hero-title">Detailing by <br/> <span>Professionals.</span></h1>
                        <p className="m-body-text" style={{maxWidth: '550px', marginBottom: '4rem'}}>
                            At Shine Depot, we don’t just wash cars; we curate automotive art. 
                            Our journey began with a simple vision: to provide the highest level 
                            of precision and care for the world's finest vehicles.
                        </p>
                        <div className="about-hero-stats">
                            <div className="about-stat">
                                <span className="stat-val">12+</span>
                                <span className="stat-lab">YEARS OF PASSION</span>
                            </div>
                            <div className="about-stat">
                                <span className="stat-val">5K+</span>
                                <span className="stat-lab">CARS PERFECTED</span>
                            </div>
                            <div className="about-stat">
                                <span className="stat-val">15+</span>
                                <span className="stat-lab">MASTER DETAILERS</span>
                            </div>
                        </div>
                    </div>
                    <div className="about-hero-right">
                        <div className="about-hero-img-box shadow-xl">
                            <img src={aboutHero} alt="Master Detailer at work" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutHero;
