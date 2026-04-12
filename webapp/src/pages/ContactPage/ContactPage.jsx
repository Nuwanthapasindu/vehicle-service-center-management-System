import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { CONTACT_INFO, OPENING_HOURS, OFFICE_ADDRESS } from '../../constants/contactInfo';
import './ContactPage.css';

function ContactPage() {
    return (
        <div className="contact-page-wrapper">
            <Header />

            <main>
                {/* Contact Hero Section */}
                <section className="contact-hero m-section-padding">
                    <div className="m-container">
                        <div className="contact-hero-flex">
                            <div className="contact-hero-left">
                                <span className="m-section-tag">GET IN TOUCH</span>
                                <h1 className="m-hero-title">Contact our <br/> <span>Support Team</span></h1>
                                <p className="m-body-text" style={{maxWidth: '550px', marginBottom: '3.5rem'}}>
                                    Have questions about our services or want to book a custom transformation? 
                                    Our team of specialists is here to help you achieve automotive perfection.
                                </p>

                                <div className="contact-method-grid">
                                    {Object.values(CONTACT_INFO).map((method, index) => (
                                        <a 
                                            key={index} 
                                            href={method.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="contact-method-card shadow-sm"
                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                        >
                                            <div className="method-icon">
                                                <i className={method.icon}></i>
                                            </div>
                                            <div className="method-info">
                                                <span>{method.label}</span>
                                                <h4>{method.value}</h4>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div className="contact-hero-right">
                                <div className="map-container shadow-xl">
                                    <div className="map-overlay">
                                        <div className="location-pin">
                                            <i className="fa-solid fa-location-dot"></i>
                                            <div className="pin-pulse"></div>
                                        </div>
                                        <div className="location-card shadow-lg">
                                            <h5>{OFFICE_ADDRESS.name}</h5>
                                            <p>
                                                {OFFICE_ADDRESS.address}<br/>
                                                {OFFICE_ADDRESS.city}
                                            </p>
                                            <a href={OFFICE_ADDRESS.directionsLink} className="dir-link">
                                                GET DIRECTIONS <i className="fa-solid fa-arrow-right"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ / Secondary CTA */}
                <section className="m-section-padding" style={{backgroundColor: '#FFFFFF'}}>
                    <div className="m-container m-centered">
                        <span className="m-section-tag">OUR LOCATION</span>
                        <h2 className="m-section-title">Open 6 Days a Week</h2>
                        <div className="opening-hours-grid">
                            {OPENING_HOURS.map((hour, index) => (
                                <React.Fragment key={index}>
                                    <div className="hour-item">
                                        <span>{hour.day}</span>
                                        <h4 style={hour.isClosed ? {color: '#94A3B8'} : {}}>{hour.time}</h4>
                                    </div>
                                    {index < OPENING_HOURS.length - 1 && <div className="hour-divider"></div>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default ContactPage;
