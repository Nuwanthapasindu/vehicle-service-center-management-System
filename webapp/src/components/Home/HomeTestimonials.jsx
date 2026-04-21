import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomeTestimonials.css';
import reviewService from '../../services/reviewService';

const HomeTestimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestReviews = async () => {
            try {
                const response = await reviewService.getPublicReviews({ limit: 3, sort: 'recent' });
                if (response.data?.payload?.reviews) {
                    setTestimonials(response.data.payload.reviews);
                }
            } catch (error) {
                console.error("Error fetching testimonials:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestReviews();
    }, []);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i key={i} className="fa-solid fa-star"
                    style={{ color: i <= rating ? '#8EDB00' : 'rgba(255, 255, 255, 0.1)' }}></i>
            );
        }
        return stars;
    };

    const getInitials = (name) => {
        if (!name) return "??";
        const parts = name.split(" ");
        return parts.map(p => p[0]).join("").toUpperCase().substring(0, 2);
    };

    if (loading || testimonials.length === 0) {
        return null;
    }

    return (
        <section className="home-testimonials m-section-padding">
            <div className="m-container">
                <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
                    <div className="section-title-box">
                        <span className="m-section-tag">CLIENT FEEDBACK</span>
                        <h2 className="m-section-title" style={{color: '#FFFFFF', marginBottom: 0}}>Trusted by Enthusiasts</h2>
                    </div>
                    <Link to="/reviews" className="m-btn-outline" style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.2)' }}>
                        VIEW ALL FEEDBACKS
                    </Link>
                </div>

                <div className="testimonials-grid">
                    {testimonials.map((t, idx) => (
                        <div className="testimonial-card" key={t._id || idx}>
                            <div className="stars">
                                {renderStars(t.rating)}
                            </div>
                            <p className="testimonial-text">
                                "{t.comment?.split('\n')[0]}{t.comment?.includes('\n') || t.comment?.length > 150 ? '...' : ''}"
                            </p>
                            <div className="testimonial-user">
                                <div className="user-avatar" style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    fontSize: '0.9rem',
                                    fontWeight: '800',
                                    color: '#8EDB00',
                                    background: 'rgba(142, 219, 0, 0.1)'
                                }}>
                                    {getInitials(t.customerName)}
                                </div>
                                <div className="user-info">
                                    <h4>{t.customerName}</h4>
                                    <span>VERIFIED OWNER • {t.service}</span>
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
