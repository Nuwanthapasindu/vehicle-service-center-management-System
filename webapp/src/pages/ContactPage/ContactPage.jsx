import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
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
                                    <div className="contact-method-card shadow-sm">
                                        <div className="method-icon"><i className="fa-brands fa-whatsapp"></i></div>
                                        <div className="method-info">
                                            <span>WHATSAPP</span>
                                            <h4>+1 (555) 012-3456</h4>
                                        </div>
                                    </div>
                                    <div className="contact-method-card shadow-sm">
                                        <div className="method-icon"><i className="fa-solid fa-phone"></i></div>
                                        <div className="method-info">
                                            <span>SUPPORT LINE</span>
                                            <h4>+1 (555) 012-3457</h4>
                                        </div>
                                    </div>
                                    <div className="contact-method-card shadow-sm">
                                        <div className="method-icon"><i className="fa-solid fa-envelope"></i></div>
                                        <div className="method-info">
                                            <span>EMAIL US</span>
                                            <h4>care@shinedepot.com</h4>
                                        </div>
                                    </div>
                                    <div className="contact-method-card shadow-sm">
                                        <div className="method-icon"><i className="fa-solid fa-location-dot"></i></div>
                                        <div className="method-info">
                                            <span>VISIT US</span>
                                            <h4>Automotive District, GA</h4>
                                        </div>
                                    </div>
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
                                            <h5>SHINE DEPOT HQ</h5>
                                            <p>123 Gloss Avenue, Suite 100<br/>Automotive District, GA 30303</p>
                                            <a href="#" className="dir-link">GET DIRECTIONS <i className="fa-solid fa-arrow-right"></i></a>
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
                            <div className="hour-item">
                                <span>MONDAY - FRIDAY</span>
                                <h4>8:00 AM - 7:00 PM</h4>
                            </div>
                            <div className="hour-divider"></div>
                            <div className="hour-item">
                                <span>SATURDAY</span>
                                <h4>9:00 AM - 5:00 PM</h4>
                            </div>
                            <div className="hour-divider"></div>
                            <div className="hour-item">
                                <span>SUNDAY</span>
                                <h4 style={{color: '#94A3B8'}}>CLOSED</h4>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default ContactPage;
