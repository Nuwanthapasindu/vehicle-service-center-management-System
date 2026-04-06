import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './ReviewsPage.css';

function ReviewsPage() {
    const reviews = [
        {
            initials: "MR",
            name: "Michael R.",
            date: "2 days ago",
            service: "CERAMIC COATING",
            text: '"Absolutely incredible results. I brought my 2023 Tesla in for the Full Ceramic package and the hydrophobic properties are insane. Rain just flies off. Professional service from start to finish."',
            response: "Thank you Michael! We're thrilled you're enjoying that ceramic shine. The Tesla looks amazing and that hydrophobic layer will make your maintenance washes a breeze."
        },
        {
            initials: "SA",
            name: "Sarah Adams",
            date: "3 hours ago",
            service: "INTERIOR DETAIL",
            text: '"Kids and dogs destroyed the inside of my minivan. Shine Depot made it look like new. Not a single stain or dog hair left. Highly recommend the interior steam cleaning!"',
            response: "Happy to help, Sarah! We know how tough kids and pets can be on interiors. Our steam cleaning process really does wonders for family vehicles."
        },
        {
            initials: "EW",
            name: "Emma Wilson",
            date: "3 weeks ago",
            service: "PAINT CORRECTION",
            text: '"I was skeptical about paint correction at first, but after 6 months my car still washes off with just a hose. The shine is deeper than a showroom finish. The team at Shine Depot explained the maintenance perfectly."',
            response: "Emma, we love hearing how the coating is performing long-term! It's all about that effortless maintenance. Thanks for sharing your 6-month update."
        },
        {
            initials: "JT",
            name: "Jason T.",
            date: "2 weeks ago",
            service: "EXPRESS WASH",
            text: '"Fast, thorough, and reasonably priced. Great for a weekly upkeep wash."',
            response: "Thanks for the feedback, Jason! We aim to make routine maintenance as efficient as possible. See you next week!"
        },
        {
            initials: "KL",
            name: "Kevin L.",
            date: "1 month ago",
            service: "WINDOW TINTING",
            text: '"Perfect tint job. No bubbles, perfectly cut edges. Noticeable heat reduction inside the car immediately."',
            response: "We're glad to hear you're feeling the difference in temperature, Kevin! Our premium films are designed for exactly that. Enjoy the cooler ride."
        },
        {
            initials: "MR",
            name: "Michael R.",
            date: "2 days ago",
            service: "CERAMIC COATING",
            text: '"Absolutely incredible results. I brought my 2023 Tesla in for the Full Ceramic package and the hydrophobic properties are insane. Rain just flies off. Professional service from start to finish."',
            response: "Thank you Michael! We're thrilled you're enjoying that ceramic shine. The Tesla looks amazing and that hydrophobic layer will make your maintenance washes a breeze."
        }
    ];

    return (
        <div className="reviews-page-wrapper">
            <Header />

            <main>
                {/* Header Section */}
                <section className="reviews-header m-section-padding">
                    <div className="m-container m-centered">
                        <div className="verified-tag">
                            <i className="fa-solid fa-circle-check"></i>
                            VERIFIED CUSTOMER FEEDBACK
                        </div>
                        <h1 className="m-hero-title">What Our <br/> <span>Customers Say</span></h1>

                        <div className="rating-summary">
                            <div className="rating-main-box">
                                <div className="rating-score">4.9</div>
                                <div className="rating-stars">
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                </div>
                                <div className="rating-count">Out of 500+ Reviews</div>
                            </div>

                            <div className="rating-bars">
                                <div className="bar-row">
                                    <span className="bar-label">5</span>
                                    <div className="bar-container"><div className="bar-fill" style={{width: '92%'}}></div></div>
                                    <span className="bar-percent">92%</span>
                                </div>
                                <div className="bar-row">
                                    <span className="bar-label">4</span>
                                    <div className="bar-container"><div className="bar-fill" style={{width: '6%'}}></div></div>
                                    <span className="bar-percent">6%</span>
                                </div>
                                <div className="bar-row">
                                    <span className="bar-label">3</span>
                                    <div className="bar-container"><div className="bar-fill" style={{width: '1%'}}></div></div>
                                    <span className="bar-percent">1%</span>
                                </div>
                                <div className="bar-row">
                                    <span className="bar-label">2</span>
                                    <div className="bar-container"><div className="bar-fill" style={{width: '1%'}}></div></div>
                                    <span className="bar-percent">1%</span>
                                </div>
                                <div className="bar-row">
                                    <span className="bar-label">1</span>
                                    <div className="bar-container"><div className="bar-fill" style={{width: '1%'}}></div></div>
                                    <span className="bar-percent">1%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Controls Section using m-container */}
                <section className="m-container">
                    <div className="reviews-controls shadow-sm">
                        <div className="filter-group">
                            <span className="control-label">FILTER BY SERVICE</span>
                            <div className="service-filter">
                                <span>All Services</span>
                                <i className="fa-solid fa-chevron-down"></i>
                            </div>
                        </div>

                        <div className="sort-group">
                            <div className="sort-btn active">Recent</div>
                            <div className="sort-btn">Top Rated</div>
                        </div>

                        <div className="reviews-count-meta">
                            Showing 542 reviews
                        </div>
                    </div>
                </section>

                {/* Reviews Grid using m-container */}
                <section className="m-container" style={{padding: '5rem 0 10rem'}}>
                    <div className="reviews-grid">
                        {reviews.map((rev, idx) => (
                            <div className="review-card shadow-sm" key={idx}>
                                <div className="review-card-header">
                                    <div className="rev-user">
                                        <div className="user-initials">{rev.initials}</div>
                                        <div className="user-info-text">
                                            <h4>{rev.name}</h4>
                                            <span>{rev.date}</span>
                                        </div>
                                    </div>
                                    <div className="rev-stars">
                                        <i className="fa-solid fa-star"></i>
                                        <i className="fa-solid fa-star"></i>
                                        <i className="fa-solid fa-star"></i>
                                        <i className="fa-solid fa-star"></i>
                                        <i className="fa-solid fa-star"></i>
                                    </div>
                                </div>
                                
                                <span className="service-tag">{rev.service}</span>
                                <p className="m-body-text" style={{fontSize: '1rem', color: '#475569', marginBottom: '2.5rem'}}>{rev.text}</p>
                                
                                {rev.response && (
                                    <div className="official-response">
                                        <div className="response-header">
                                            <i className="fa-solid fa-sparkles"></i>
                                            <h5>RESPONSE FROM SHINE DEPOT</h5>
                                        </div>
                                        <p style={{fontSize: '0.85rem', lineHeight: '1.6', color: '#64748B'}}>{rev.response}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="m-centered" style={{marginTop: '6rem'}}>
                        <button className="m-btn-outline" style={{backgroundColor: '#FFFFFF'}}>View All 542 Reviews</button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default ReviewsPage;
