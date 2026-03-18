import React from 'react';
import './Services.css';

function Services() {
    const servicesData = [
        {
            id: 1,
            title: "Ceramic Coating",
            description: "Long-lasting protection and mirror-like finish with 9H hardness technology. Protect against UV, salt, and chemicals.",
            price: "From $499",
            image: "https://images.unsplash.com/photo-1601362840469-51e4d8d587ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            tag: "CERAMIC COATING"
        },
        {
            id: 2,
            title: "Interior Restoration",
            description: "Deep clean, conditioning, and odor removal. We restore every surface including leather, alcantara, and carpets.",
            price: "From $199",
            image: "https://images.unsplash.com/photo-1632823465311-64d1f2e9603e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            tag: "INTERIOR"
        },
        {
            id: 3,
            title: "Full Exterior Prep",
            description: "Touchless wash and hand-polished perfection. Multi-stage wash process to ensure a scratch-free showroom shine.",
            price: "From $149",
            image: "https://images.unsplash.com/photo-1552930294-6b595f4c2974?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            tag: "EXTERIOR"
        }
    ];

    return (
        <section className="services-section" id="services">
            <div className="services-container">
                <div className="section-header">
                    <span className="section-subtitle">ELITE MAINTENANCE</span>
                    <h2 className="section-title">Our Professional Services</h2>
                </div>

                <div className="services-grid">
                    {servicesData.map((service) => (
                        <div key={service.id} className="service-card">
                            <div className="service-image-container">
                                <img src={service.image} alt={service.title} className="service-image" />
                                <div className="service-tag">{service.tag}</div>
                            </div>
                            <div className="service-content">
                                <h3 className="service-title">{service.title}</h3>
                                <p className="service-description">{service.description}</p>
                                <div className="service-price">{service.price}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Services;
