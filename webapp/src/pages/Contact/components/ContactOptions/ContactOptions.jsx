import React from 'react';
import './ContactOptions.css';

function ContactOptions() {
    const options = [
        {
            id: 1,
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            title: "WhatsApp Chat",
            description: "Fastest for quick quotes and sending vehicle photos.",
            action: (
                <div className="status-online">
                    <span className="dot"></span> Online: &lt; 5 min response
                </div>
            )
        },
        {
            id: 2,
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            title: "Call Our Studio",
            description: "Direct line for booking slots and service consultations.",
            action: <span className="action-text">+1 (555) 000-SHINE</span>
        },
        {
            id: 3,
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            title: "Email Inquiries",
            description: "For corporate packages, fleets, or formal detailing proposals.",
            action: <a href="mailto:hello@shinedepot.com" className="action-link">hello@shinedepot.com</a>
        }
    ];

    return (
        <section className="contact-options-section">
            <div className="contact-options-container">

                <div className="options-header">
                    <h2 className="options-title">Get Your Shine On</h2>
                    <p className="options-subtitle">
                        No complicated forms here. Choose your preferred way to reach our detailing
                        experts. We typically respond within minutes.
                    </p>
                </div>

                <div className="options-grid">
                    {options.map((option) => (
                        <div key={option.id} className="option-card">
                            <div className="icon-container-circle">
                                {option.icon}
                            </div>
                            <h3 className="card-title">{option.title}</h3>
                            <p className="card-description">{option.description}</p>
                            <div className="card-action">
                                {option.action}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

export default ContactOptions;
