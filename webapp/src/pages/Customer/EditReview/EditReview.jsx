import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import reviewService from '../../../services/reviewService';
import getImageUrl from '../../../util/getImageUrl';
import Sidebar from '../../../components/Customer/SideBar/CustomerSidebar';
import Header from '../../../components/Customer/Header/CustomerHeader';
import './EditReview.css';

const EditReview = () => {
    const { reviewId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        const fetchReviewAndBooking = async () => {
            try {
                // 1. Fetch review details
                const reviewResponse = await reviewService.getReviewDetail(reviewId);
                const reviewData = reviewResponse.data.payload;
                setRating(reviewData.rating);
                setComment(reviewData.comment || '');

                // 2. Fetch booking details for the summary card
                const bookingResponse = await reviewService.getBookingDetailsForReview(reviewData.booking);
                setBookingDetails(bookingResponse.data.payload);
            } catch (error) {
                console.error('Error fetching review details:', error);
                const errorMsg = error.response?.data?.payload?.message || 'Failed to load review details';
                toast.error(errorMsg);
                navigate('/customer/reviews');
            } finally {

                setLoading(false);
            }
        };

        if (reviewId) {
            fetchReviewAndBooking();
        }
    }, [reviewId, navigate]);

    const handleRatingClick = (newRating) => {
        setRating(newRating);
    };

    const handleRatingHover = (newHoverRating) => {
        setHoverRating(newHoverRating);
    };

    const handleSubmitUpdate = async (e) => {
        e.preventDefault();
        
        if (rating === 0) {
            toast.warning('Please select a star rating to rate your detail');
            return;
        }

        setSubmitting(true);
        try {
            const payload = { rating, comment };
            const response = await reviewService.updateReview(reviewId, payload);
            toast.success(response.data?.payload?.message || response.data?.message || 'Review updated successfully');
            navigate('/customer/reviews');
        } catch (error) {
            console.error('Error updating review:', error);
            const errorMsg = error.response?.data?.payload?.message || 'Failed to update review';
            toast.error(errorMsg);
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
                    <div className="loading-state" style={{ padding: '100px', textAlign: 'center' }}>
                        <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
                        <p>Loading your review details...</p>
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
                <main className="edit-review-page">
                    <div className="breadcrumbs">
                <Link to="/customer/dashboard">Home</Link>
                <span>&gt;</span>
                <Link to="/customer/reviews">Review</Link>
                <span>&gt;</span>
                <span className="active">Edit Review</span>
            </div>

            <div className="edit-review-header">
                <h1>Edit Your Review</h1>
                <p>You can update your rating and comments based on your service experience.</p>
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
                    <span className="rating-hint">Select a star to update your rating</span>
                </div>

                <form className="review-form" onSubmit={handleSubmitUpdate}>
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
                            type="button" 
                            className="cancel-btn"
                            onClick={() => navigate('/customer/reviews')}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="update-review-btn"
                            disabled={submitting}
                        >
                            {submitting ? 'Updating...' : 'Update Review'}
                            {!submitting && <i className="fa-solid fa-pen-to-square"></i>}
                        </button>
                    </div>
                </form>
            </div>
                </main>
            </div>
        </div>
    );
};

export default EditReview;
