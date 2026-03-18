import React, { useState } from 'react';
import './ReviewsList.css';

function ReviewsList() {
    const [filterType, setFilterType] = useState('Recent');

    const reviews = [
        {
            id: 1,
            name: "Michael R.",
            time: "2 days ago",
            initials: "MR",
            bgColor: "#e5fbe4",
            textColor: "#4aad17",
            rating: 5,
            service: "CERAMIC COATING",
            text: '"Absolutely incredible results. I brought my 2023 Tesla in for the Full Ceramic package and the hydrophobic properties are insane. Rain just flies off. Professional service from start to finish."',
            response: "Thank you Michael! We're thrilled you're enjoying that ceramic shine. The Tesla looks amazing and that hydrophobic layer will make your maintenance washes a breeze."
        },
        {
            id: 2,
            name: "Sarah Adams",
            time: "3 hours ago",
            initials: "SA",
            bgColor: "#f0f0f0",
            textColor: "#666",
            rating: 5,
            service: "INTERIOR DETAIL",
            text: '"Kids and dogs destroyed the inside of my minivan. Shine Depot made it look like new. Not a single stain or dog hair left. Highly recommend the interior steam cleaning!"',
            response: "Happy to help, Sarah! We know how tough kids and pets can be on interiors. Our steam cleaning process really does wonders for family vehicles."
        },
        {
            id: 3,
            name: "Emma Wilson",
            time: "3 weeks ago",
            initials: null,
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            rating: 5,
            service: "CERAMIC COATING",
            text: '"I was skeptical about ceramic coating at first, but after 6 months my car still washes off with just a hose. The shine is deeper than a showroom finish. The team at Shine Depot explained the maintenance perfectly."',
            response: "Emma, we love hearing how the coating is performing long-term! It's all about that effortless maintenance. Thanks for sharing your 6-month update."
        },
        {
            id: 4,
            name: "Michael R.",
            time: "2 days ago",
            initials: "MR",
            bgColor: "#f0f0f0",
            textColor: "#666",
            rating: 5,
            service: "CERAMIC COATING",
            text: '"Absolutely incredible results. I brought my 2023 Tesla in for the Full Ceramic package and the hydrophobic properties are insane. Rain just flies off. Professional service from start to finish."',
            response: "Thank you Michael! We're thrilled you're enjoying that ceramic shine. The Tesla looks amazing and that hydrophobic layer will make your maintenance washes a breeze."
        },
        {
            id: 5,
            name: "Jason T.",
            time: "2 weeks ago",
            initials: "JT",
            bgColor: "#e5fbe4",
            textColor: "#4aad17",
            rating: 4,
            service: "EXPRESS WASH",
            text: '"Fast, thorough, and reasonably priced. Great for a weekly upkeep wash."',
            response: "Thanks for the feedback, Jason! We aim to make routine maintenance as efficient as possible. See you next week!"
        },
        {
            id: 6,
            name: "Kevin L.",
            time: "1 month ago",
            initials: "KL",
            bgColor: "#f0f0f0",
            textColor: "#666",
            rating: 5,
            service: "WINDOW TINTING",
            text: '"Perfect tint job. No bubbles, perfectly cut edges. Noticeable heat reduction inside the car immediately."',
            response: "We're glad to hear you're feeling the difference in temperature, Kevin! Our premium films are designed for exactly that. Enjoy the cooler ride."
        }
    ];

    const renderStars = (rating) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < rating ? "star filled" : "star"}>★</span>
        ));
    };

    return (
        <section className="reviews-list-section">
            <div className="reviews-list-container">

                {/* FILTERS */}
                <div className="reviews-filter-bar">
                    <div className="filter-dropdown">
                        <span className="filter-label">FILTER BY SERVICE</span>
                        <select className="service-select">
                            <option>All Services</option>
                            <option>Ceramic Coating</option>
                            <option>Interior Detail</option>
                            <option>Window Tinting</option>
                        </select>
                        <div className="dropdown-arrow">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 9L12 15L18 9" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    <div className="sort-toggles">
                        <button
                            className={`sort-btn ${filterType === 'Recent' ? 'active' : ''}`}
                            onClick={() => setFilterType('Recent')}
                        >
                            Recent
                        </button>
                        <button
                            className={`sort-btn ${filterType === 'Top Rated' ? 'active' : ''}`}
                            onClick={() => setFilterType('Top Rated')}
                        >
                            Top Rated
                        </button>
                    </div>

                    <div className="review-count">
                        Showing 542 reviews
                    </div>
                </div>

                {/* GRID */}
                <div className="reviews-grid">
                    {reviews.map((review) => (
                        <div key={review.id} className="review-item">

                            {/* Header */}
                            <div className="review-header">
                                <div className="reviewer-info">
                                    {review.avatar ? (
                                        <img src={review.avatar} alt={review.name} className="reviewer-avatar-img" />
                                    ) : (
                                        <div
                                            className="reviewer-initials"
                                            style={{ backgroundColor: review.bgColor, color: review.textColor }}
                                        >
                                            {review.initials}
                                        </div>
                                    )}
                                    <div className="reviewer-details">
                                        <h4>{review.name}</h4>
                                        <span>{review.time}</span>
                                    </div>
                                </div>
                                <div className="review-stars-small">
                                    {renderStars(review.rating)}
                                </div>
                            </div>

                            {/* Service Badge */}
                            <div className="service-badge">
                                {review.service}
                            </div>

                            {/* Body */}
                            <p className="review-body">
                                {review.text}
                            </p>

                            {/* Response */}
                            {review.response && (
                                <div className="reviewer-response">
                                    <div className="response-header">
                                        <span className="response-icon">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="12" r="10" fill="#8be013" />
                                                <path d="M8 12L11 15L16 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </span>
                                        <span className="response-title">RESPONSE FROM SHINE DEPOT</span>
                                    </div>
                                    <p className="response-text">{review.response}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* LOAD MORE */}
                <div className="view-all-container">
                    <button className="view-all-btn">View All 542 Reviews</button>
                </div>

            </div>
        </section>
    );
}

export default ReviewsList;
