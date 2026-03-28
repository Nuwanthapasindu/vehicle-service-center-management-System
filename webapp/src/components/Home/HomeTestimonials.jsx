import React from 'react';
import './HomeTestimonials.css';

const HomeTestimonials = () => {
    const testimonials = [
        {
            name: "Marcus Chen",
            car: "TESLA MODEL S",
            text: '"The level of detail is insane. My 5-year-old Porsche looks better than the day I picked it up from the dealership. The ceramic coating is worth every penny."',
            avatar: "https://i.pravatar.cc/150?u=marcus"
        },
        {
            name: "Sarah Jenkins",
            car: "BMW M4",
            text: '"I was worried about my leather interior restoration, but Shine Depot exceeded my expectations. Professional service and quick turnaround. Highly recommend."',
            avatar: "https://i.pravatar.cc/150?u=sarah"
        },
        {
            name: "David Rivera",
            car: "AUDI RS6",
            text: '"Best detailing shop in the city. They treat every car like it\'s their own. Their hydrophobic properties of the coating are truly unbelievable."',
            avatar: "https://i.pravatar.cc/150?u=david"
        }
    ];

    return (
        <section className="home-testimonials m-section-padding">
            <div className="m-container">
                <div className="section-header-row">
                    <div className="section-title-box">
                        <span className="m-section-tag">CLIENT FEEDBACK</span>
                        <h2 className="m-section-title" style={{color: '#FFFFFF'}}>Trusted by Enthusiasts</h2>
                    </div>
                    <div className="carousel-btns">
                        <button className="carousel-btn"><i className="fa-solid fa-chevron-left"></i></button>
                        <button className="carousel-btn"><i className="fa-solid fa-chevron-right"></i></button>
                    </div>
                </div>

                <div className="testimonials-grid">
                    {testimonials.map((t, idx) => (
                        <div className="testimonial-card" key={idx}>
                            <div className="stars">
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                            </div>
                            <p className="testimonial-text">{t.text}</p>
                            <div className="testimonial-user">
                                <div className="user-avatar">
                                    <img src={t.avatar} alt={t.name} />
                                </div>
                                <div className="user-info">
                                    <h4>{t.name}</h4>
                                    <span>VERIFIED OWNER • {t.car}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeTestimonials;
