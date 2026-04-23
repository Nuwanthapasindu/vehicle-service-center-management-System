import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./ContactPage.css";

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
                <h1 className="m-hero-title">
                  Contact our <br /> <span>Support Team</span>
                </h1>
                <p
                  className="m-body-text"
                  style={{ maxWidth: "550px", marginBottom: "3.5rem" }}
                >
                  Have questions about our services or want to book a custom
                  transformation? Our team of specialists is here to help you
                  achieve automotive perfection.
                </p>

                <div className="contact-method-grid">
                  <div className="contact-method-card shadow-sm">
                    <div className="method-icon">
                      <i className="fa-brands fa-whatsapp"></i>
                    </div>
                    <div className="method-info">
                      <span>WHATSAPP</span>
                      <h4>+94 77 767 3368</h4>
                    </div>
                  </div>
                  <div className="contact-method-card shadow-sm">
                    <div className="method-icon">
                      <i className="fa-solid fa-phone"></i>
                    </div>
                    <div className="method-info">
                      <span>SUPPORT LINE</span>
                      <h4>+94 77 767 3368</h4>
                    </div>
                  </div>
                  <div className="contact-method-card shadow-sm">
                    <div className="method-icon">
                      <i className="fa-solid fa-envelope"></i>
                    </div>
                    <div className="method-info">
                      <span>EMAIL US</span>
                      <h4>care@shinedepot.com</h4>
                    </div>
                  </div>
                  <div className="contact-method-card shadow-sm">
                    <div className="method-icon">
                      <i className="fa-solid fa-location-dot"></i>
                    </div>
                    <div className="method-info">
                      <span>VISIT US</span>
                      <h4>
                        108 Old Kottawa Rd, <br /> Nugegoda
                      </h4>
                    </div>
                  </div>
                </div>
              </div>

              <div className="contact-hero-right">
                <div className="map-container shadow-xl">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.1517257605724!2d79.90499779999999!3d6.872416899999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25b6135989113%3A0xad65a135d9f36203!2sShine%20Depot!5e0!3m2!1sen!2slk!4v1776679664331!5m2!1sen!2slk"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Map"
                  ></iframe>
                  <div className="map-overlay">
                    <div className="location-card shadow-lg">
                      <h5>SHINE DEPOT HQ</h5>
                      <p>
                        108 Old Kottawa Rd, <br /> Nugegoda
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ / Secondary CTA */}
        <section
          className="m-section-padding"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <div className="m-container m-centered">
            <span className="m-section-tag">OUR LOCATION</span>
            <h2 className="m-section-title">Open 6 Days a Week</h2>
            <div className="opening-hours-grid">
              <div className="hour-item">
                <span>TUESDAY - SATURDAY</span>
                <h4>8:00 AM - 7:00 PM</h4>
              </div>
              <div className="hour-divider"></div>
              <div className="hour-item">
                <span> SUNDAY</span>
                <h4>9:00 AM - 5:00 PM</h4>
              </div>
              <div className="hour-divider"></div>
              <div className="hour-item">
                <span> MONDAY</span>
                <h4 style={{ color: "#94A3B8" }}>CLOSED</h4>
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
