import React from 'react';
import './ReviewsHero.css';

function ReviewsHero() {
    const ratingBreakdown = [
        { stars: 5, percentage: 92 },
        { stars: 4, percentage: 6 },
        { stars: 3, percentage: 1 },
        { stars: 2, percentage: 1 },
        { stars: 1, percentage: 1 },
    ];

    return (
        <section className="reviews-hero-section">
            <div className="reviews-hero-container">

                <div className="verified-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#66DF1B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M7.5 12L10.5 15L16.5 9" stroke="#66DF1B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    VERIFIED CUSTOMER FEEDBACK
                </div>

                <h1 className="reviews-title">What Our Customers Say</h1>

                <div className="reviews-summary-block">
                    <div className="overall-rating">
                        <h2 className="rating-score">4.9</h2>
                        <div className="rating-stars-large">
                            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                        </div>
                        <p className="rating-count">Out of 500+ Reviews</p>
                    </div>

                    <div className="rating-bars">
                        {ratingBreakdown.map((row) => (
                            <div key={row.stars} className="rating-bar-row">
                                <span className="star-label">{row.stars}</span>
                                <div className="bar-container">
                                    <div
                                        className="bar-fill"
                                        style={{ width: `${row.percentage}%`, backgroundColor: row.stars >= 4 ? '#8be013' : '#e0e0e0' }}
                                    ></div>
                                </div>
                                <span className="percentage-label">{row.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}

export default ReviewsHero;
