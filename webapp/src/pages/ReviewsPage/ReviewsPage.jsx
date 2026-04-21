import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import reviewService from '../../services/reviewService';
import { formatTimeAgo } from '../../util/dateFormatter';
import './ReviewsPage.css';
import packageService from '../../services/packageService';
import { useNavigate } from 'react-router-dom';

function ReviewsPage() {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({
        average: 0,
        total: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    });
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [filterService, setFilterService] = useState('All Services');
    const [sortBy, setSortBy] = useState('recent'); // 'recent' or 'top-rated'
    const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);

    const fetchDetails = async () => {
        setLoading(true);
        try {
            const [reviewsRes, packageRes] = await Promise.all([
                reviewService.getPublicReviews({
                    page,
                    limit: 12,
                    sort: sortBy,
                    service: filterService === 'All Services' ? undefined : filterService
                }),
                packageService.getPublicPackages()
            ]);
            if (reviewsRes.data?.payload) {
                setReviews(reviewsRes.data.payload.reviews || []);
                setStats(reviewsRes.data.payload.stats || {
                    average: 0, total: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
                });
            }

            if (packageRes.data.payload.packages) {
                setServices(packageRes.data.payload.packages);
            } else if (Array.isArray(packageRes.data?.payload?.packages)) {
                setServices(packageRes.data.payload.packages);
            } else {
                setServices([]);
            }
        } catch (error) {
            toast.error("Error fetching reviews");
            navigate('/');
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [page, filterService, sortBy]);

    const getInitials = (name) => {
        if (!name) return "??";
        const parts = name.split(" ");
        return parts.map(p => p[0]).join("").toUpperCase().substring(0, 2);
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i key={i} className={`fa-solid fa-star ${i <= rating ? 'filled' : 'empty'}`}
                    style={{ color: i <= rating ? '#8EDB00' : '#E2E8F0' }}></i>
            );
        }
        return stars;
    };

    const getBarWidth = (count) => {
        if (stats.total === 0) return '0%';
        return `${(count / stats.total) * 100}%`;
    };

    const getBarPercent = (count) => {
        if (stats.total === 0) return '0%';
        return `${Math.round((count / stats.total) * 100)}%`;
    };

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
                        <h1 className="m-hero-title">What Our <br /> <span>Customers Say</span></h1>

                        <div className="rating-summary">
                            <div className="rating-main-box">
                                <div className="rating-score">{stats.average || '0.0'}</div>
                                <div className="rating-stars">
                                    {renderStars(Math.round(stats.average || 5))}
                                </div>
                                <div className="rating-count">Out of {stats.total} Reviews</div>
                            </div>

                            <div className="rating-bars">
                                {[5, 4, 3, 2, 1].map(num => (
                                    <div className="bar-row" key={num}>
                                        <span className="bar-label">{num}</span>
                                        <div className="bar-container">
                                            <div className="bar-fill" style={{ width: getBarWidth(stats.distribution[num]) }}></div>
                                        </div>
                                        <span className="bar-percent">{getBarPercent(stats.distribution[num])}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Controls Section using m-container */}
                <section className="m-container">
                    <div className="reviews-controls shadow-sm">
                        <div className="filter-group">
                            <span className="control-label">FILTER BY SERVICE</span>
                            <div className="service-filter-wrapper" style={{ position: 'relative' }}>
                                <div className="service-filter" onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}>
                                    <span>{filterService}</span>
                                    <i className="fa-solid fa-chevron-down"></i>
                                </div>
                                {isServiceDropdownOpen && (
                                    <div className="service-dropdown shadow-xl">
                                        <div className="dropdown-item" onClick={() => { setFilterService('All Services'); setIsServiceDropdownOpen(false); }}>All Services</div>
                                        {services.map(s => (
                                            <div key={s._id} className="dropdown-item" onClick={() => { setFilterService(s.name); setIsServiceDropdownOpen(false); }}>{s.name}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="sort-group">
                            <div className={`sort-btn ${sortBy === 'recent' ? 'active' : ''}`} onClick={() => setSortBy('recent')}>Recent</div>
                            <div className={`sort-btn ${sortBy === 'top-rated' ? 'active' : ''}`} onClick={() => setSortBy('top-rated')}>Top Rated</div>
                        </div>

                        <div className="reviews-count-meta">
                            {loading ? 'Fetching...' : `Showing ${reviews.length} reviews`}
                        </div>
                    </div>
                </section>

                {/* Reviews Grid using m-container */}
                <section className="m-container" style={{ padding: '5rem 0 10rem' }}>
                    {loading && reviews.length === 0 ? (
                        <div className="m-centered" style={{ padding: '5rem 0' }}>
                            <i className="fa-solid fa-spinner fa-spin fa-2xl" style={{ color: '#8EDB00' }}></i>
                        </div>
                    ) : reviews.length > 0 ? (
                        <div className="reviews-grid">
                            {reviews.map((rev) => (
                                <div className="review-card shadow-sm" key={rev._id}>
                                    <div className="review-card-header">
                                        <div className="rev-user">
                                            <div className="user-initials">{getInitials(rev.customerName)}</div>
                                            <div className="user-info-text">
                                                <h4>{rev.customerName}</h4>
                                                <span>{formatTimeAgo(rev.date)}</span>
                                            </div>
                                        </div>
                                        <div className="rev-stars">
                                            {renderStars(rev.rating)}
                                        </div>
                                    </div>

                                    <span className="service-tag">{rev.service}</span>
                                    <p className="m-body-text" style={{ fontSize: '1rem', color: '#475569', marginBottom: '2.5rem', minHeight: '80px' }}>{rev.comment}</p>

                                    {rev.adminReply && (
                                        <div className="official-response">
                                            <div className="response-header">
                                                <i className="fa-solid fa-sparkles"></i>
                                                <h5>RESPONSE FROM SHINE DEPOT</h5>
                                            </div>
                                            <p style={{ fontSize: '0.85rem', lineHeight: '1.6', color: '#64748B' }}>{rev.adminReply}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="m-centered" style={{ padding: '8rem 0' }}>
                            <i className="fa-solid fa-comment-slash fa-4x" style={{ color: '#E2E8F0', marginBottom: '1.5rem' }}></i>
                            <h3 style={{ color: '#64748B' }}>No reviews found</h3>
                            <p style={{ color: '#94A3B8' }}>Try adjusting your filters or service selection.</p>
                        </div>
                    )}

                    {reviews.length < stats.total && reviews.length > 0 && (
                        <div className="m-centered" style={{ marginTop: '6rem' }}>
                            <button
                                className="m-btn-outline"
                                style={{ backgroundColor: '#FFFFFF' }}
                                onClick={() => setPage(p => p + 1)}
                            >
                                View More Reviews
                            </button>
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default ReviewsPage;
