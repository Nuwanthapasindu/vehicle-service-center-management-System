import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import reviewService from '../../../services/reviewService';
import getImageUrl from '../../../util/getImageUrl';
import Sidebar from '../../../components/Customer/SideBar/CustomerSidebar';
import Header from '../../../components/Customer/Header/CustomerHeader';
import './WriteReview.css';

const WriteReview = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Parse query params for edit mode
    const queryParams = new URLSearchParams(location.search);
    const isEditMode = queryParams.get('edit') === 'true';
    const reviewId = queryParams.get('reviewId');

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch booking details for the header card
                const bookingResponse = await reviewService.getBookingDetailsForReview(bookingId);
                setBookingDetails(bookingResponse.data.payload);

                // 2. If edit mode, fetch existing review details
                if (isEditMode && reviewId) {
                    const reviewResponse = await reviewService.getReviewDetail(reviewId);
                    const reviewData = reviewResponse.data.payload;
                    setRating(reviewData.rating);
                    setComment(reviewData.comment || '');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error(error.response?.data?.payload?.message || error.response?.data?.message || 'Failed to load details');
                navigate('/customer/reviews');
            } finally {
                setLoading(false);
            }
        };

        if (bookingId) {
            fetchData();
        }
    }, [bookingId, isEditMode, reviewId, navigate]);

    const handleRatingClick = (newRating) => {
        setRating(newRating);
    };

    const handleRatingHover = (newHoverRating) => {
        setHoverRating(newHoverRating);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            toast.warning('Please select a star rating to rate your detail');
            return;
        }

        setSubmitting(true);
        try {
            if (isEditMode && reviewId) {
                const response = await reviewService.updateReview(reviewId, { rating, comment });
                toast.success(response.data?.payload?.message || response.data?.message || 'Review updated successfully');
            } else {
                const payload = {
                    bookingId,
                    rating,
                    comment
                };
                const response = await reviewService.addReview(payload);
                toast.success(response.data?.payload?.message || response.data?.message || 'Review submitted successfully');
            }
            navigate('/customer/reviews');
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error(error.response?.data?.payload?.message || error.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="customer-portal-wrapper">
                <Sidebar />
                <div className="customer-content-area">
                    <Header title="Customer Dashboard" />
                    <div className="loading-container" style={{ padding: '100px', textAlign: 'center' }}>
                        <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
                        <p>Loading details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!bookingDetails) {
        return (
            <div className="customer-portal-wrapper">
                <Sidebar />
                <div className="customer-content-area">
                    <Header title="Customer Dashboard" />
                    <div className="error-state" style={{ padding: '100px', textAlign: 'center' }}>
                        Service details not found.
                    </div>
                </div>
            </div>
        );
    }

    const { serviceDate, packageName, status, vehicleImage, vehicleName } = bookingDetails;
    const formattedDate = new Date(serviceDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <div className="customer-portal-wrapper">
            <Sidebar />
            <div className="customer-content-area">
                <Header title="Customer Dashboard" />
                <main className="write-review-page">
                    <div className="breadcrumbs">
                <Link to="/customer/dashboard">Home</Link>
                <span>&gt;</span>
                <Link to="/customer/reviews">Review</Link>
                <span>&gt;</span>
                <span className="active">{isEditMode ? 'Edit Review' : 'Write a Review'}</span>
            </div>

            <div className="write-review-header">
                <h1>{isEditMode ? 'Edit Your Review' : 'Write a Service Review'}</h1>
                <p>Your feedback helps us maintain the Shine Depot standard and improve our detailing experience.</p>
            </div>

            <div className="review-container">
                <div className="service-summary-card">
                    <div className="service-image-container">
                        <img
                            src={getImageUrl(vehicleImage) || 'https://via.placeholder.com/200x140?text=Vehicle'}
                            alt={vehicleName}
                        />
                    </div>
                    <div className="service-info">
                        <span className="status-badge">{status?.toUpperCase() || 'COMPLETED SERVICE'}</span>
                        <h2>{vehicleName} - {packageName}</h2>
                        <div className="service-date">
                            <i className="fa-regular fa-calendar"></i>
                            <span>Service Date: {formattedDate}</span>
                        </div>
                    </div>
                </div>

                <div className="rating-section">
                    <h3>How would you rate your detail?</h3>
                    <div className="stars-container">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <i
                                key={star}
                                className={`fa-star star-icon ${(hoverRating || rating) >= star ? 'fa-solid filled' : 'fa-regular'}`}
                                onClick={() => handleRatingClick(star)}
                                onMouseEnter={() => handleRatingHover(star)}
                                onMouseLeave={() => handleRatingHover(0)}
                            ></i>
                        ))}
                    </div>
                    <span className="rating-hint">Select a star to rate</span>
                </div>

                <form className="review-form" onSubmit={handleSubmitReview}>
                    <div className="form-group">
                        <div className="form-label-row">
                            <label htmlFor="detailed-comments">Detailed Comments</label>
                            <span className="optional-text">Optional</span>
                        </div>
                        <textarea
                            id="detailed-comments"
                            className="review-textarea"
                            placeholder="Share details about the quality of work, staff, and overall service experience..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="submit-button-container">
                        <button
                            type="submit"
                            className="submit-review-btn"
                            disabled={submitting}
                        >
                            {submitting ? 'Processing...' : (isEditMode ? 'Update Review' : 'Submit Review')}
                            {!submitting && <i className={`fa-solid ${isEditMode ? 'fa-pen-to-square' : 'fa-paper-plane'}`}></i>}
                        </button>
                    </div>
                </form>
            </div>
                </main>
            </div>
        </div>
    );
};

export default WriteReview;
