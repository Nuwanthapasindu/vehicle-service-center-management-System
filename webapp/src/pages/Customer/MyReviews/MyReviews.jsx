import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import reviewService from '../../../services/reviewService';
import CustomerLayout from '../../../components/Customer/Layout/CustomerLayout';
import './MyReviews.css';

const MyReviews = () => {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [visibleCount, setVisibleCount] = useState(3);

    useEffect(() => {
        fetchReviews();
    }, [activeTab]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await reviewService.getMyReviews(activeTab);
            setReviews(response.data.payload || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error(error.response?.data?.message || 'Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
            try {
                await reviewService.deleteReview(reviewId);
                setReviews(prev => prev.filter(r => r._id !== reviewId));
                toast.success('Review deleted successfully');
            } catch (error) {
                console.error('Error deleting review:', error);
                toast.error(error.response?.data?.message || 'Failed to delete review');
            }
        }
    };

    const handleEditReview = (reviewId) => {
        navigate(`/customer/reviews/edit/${reviewId}`);
    };


    const loadMore = () => {
        setVisibleCount(prev => prev + 3);
    };

    const renderStars = (rating) => {
        return (
            <div className="review-star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                    <i
                        key={star}
                        className={`fa-star mini-star ${star <= rating ? 'fa-solid' : 'fa-regular'}`}
                    ></i>
                ))}
            </div>
        );
    };

    return (
        <CustomerLayout title="My Reviews">
            <div className="my-reviews-page">
                <nav className="breadcrumbs" style={{ display: 'flex', gap: '8px', fontSize: '14px', color: 'var(--secondary)', marginBottom: '24px' }}>
                    <Link to="/customer/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
                    <span>&gt;</span>
                    <span className="active" style={{ color: 'var(--dark)', fontWeight: '500' }}>My Review</span>
                </nav>

                <div className="my-reviews-header">
                    <h1>My Reviews</h1>
                    <div className="reviews-top-row">
                        <p>Manage and track all the feedback you've shared about our professional detailing services</p>
                        <Link to="/customer/service-history" className="add-review-btn">
                            <i className="fa-solid fa-plus"></i>
                            <span>ADD NEW REVIEW</span>
                        </Link>
                    </div>
                </div>

                <div className="reviews-tabs">
                    <button
                        className={`tab-item ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All Reviews
                    </button>
                    <button
                        className={`tab-item ${activeTab === 'published' ? 'active' : ''}`}
                        onClick={() => setActiveTab('published')}
                    >
                        Published
                    </button>
                    <button
                        className={`tab-item ${activeTab === 'pending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        Pending Approval
                    </button>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
                        <p>Loading your reviews...</p>
                    </div>
                ) : (
                    <>
                        {reviews.length === 0 ? (
                            <div className="empty-reviews">
                                <i className="fa-solid fa-message"></i>
                                <p>You haven't {activeTab === 'all' ? 'written' : activeTab} any reviews yet.</p>
                            </div>
                        ) : (
                            <div className="reviews-list">
                                {reviews.slice(0, visibleCount).map((review) => (
                                    <div className="review-card" key={review._id}>
                                        <div className="review-card-header">
                                            <div>
                                                {renderStars(review.rating)}
                                                <h2 className="review-service-title">
                                                    {review.booking?.vehicle?.make} {review.booking?.vehicle?.model} - {review.packageDetails}
                                                </h2>
                                                <p className="review-service-date">
                                                    Service Date: {new Date(review.serviceDate).toLocaleDateString('en-US', {
                                                        month: 'long',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <span className="verified-badge">VERIFIED SERVICE</span>
                                        </div>

                                        <p className="review-comment">
                                            {review.comment || "No comments provided."}
                                        </p>

                                        <div className="review-actions">
                                            <button
                                                className="action-btn edit-btn"
                                                onClick={() => handleEditReview(review._id)}
                                            >

                                                <i className="fa-regular fa-pen-to-square"></i>
                                                Edit Review
                                            </button>
                                            <button
                                                className="action-btn delete-btn"
                                                onClick={() => handleDeleteReview(review._id)}
                                            >
                                                <i className="fa-regular fa-trash-can"></i>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {visibleCount < reviews.length && (
                                    <div className="pagination-container">
                                        <button className="load-more-btn" onClick={loadMore}>
                                            Load More History
                                            <i className="fa-solid fa-chevron-down"></i>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </CustomerLayout>
    );
};

export default MyReviews;
