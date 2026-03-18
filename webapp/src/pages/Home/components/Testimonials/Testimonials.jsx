import React from 'react';
import './Testimonials.css';

function Testimonials() {
    const testimonials = [
        {
            id: 1,
            rating: 5,
            text: "The level of detail is insane. My 5-year-old Porsche looks better than the day I picked it up from the dealership. The ceramic coating is worth every penny.",
            author: "Marcus Chen",
            details: "Verified Owner • 1988 Model S",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
            id: 2,
            rating: 5,
            text: "I was worried about my leather interior restoration, but Shine Depot exceeded my expectations. Professional service and quick turnaround. Highly recommend.",
            author: "Sarah Jenkins",
            details: "Verified Owner • BMW M4",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
            id: 3,
            rating: 5,
            text: "Best detailing shop in the city. They treat every car like it's their own. The hydrophobic properties of the ceramic coating are truly unbelievable.",
            author: "David Rivera",
            details: "Verified Owner • Audi RS5",
            avatar: "https://randomuser.me/api/portraits/men/85.jpg"
        }
    ];

    const renderStars = (rating) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < rating ? "star filled" : "star"}>★</span>
        ));
    };

    return (
        <section className="testimonials-section">
            <div className="testimonials-container">
                <div className="testimonials-header">
                    <div className="testimonials-header-text">
                        <span className="section-subtitle">CLIENT FEEDBACK</span>
                        <h2 className="section-title text-light">Trusted by Enthusiasts</h2>
                    </div>
                    <div className="testimonials-nav">
                        <button className="nav-btn prev-btn" aria-label="Previous testimonials">&larr;</button>
                        <button className="nav-btn next-btn" aria-label="Next testimonials">&rarr;</button>
                    </div>
                </div>

                <div className="testimonials-grid">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="testimonial-card">
                            <div className="rating">
                                {renderStars(testimonial.rating)}
                            </div>
                            <p className="testimonial-text">"{testimonial.text}"</p>
                            <div className="testimonial-author-block">
                                <img src={testimonial.avatar} alt={testimonial.author} className="author-avatar" />
                                <div className="author-info">
                                    <h4 className="author-name">{testimonial.author}</h4>
                                    <span className="author-details">{testimonial.details}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Testimonials;
