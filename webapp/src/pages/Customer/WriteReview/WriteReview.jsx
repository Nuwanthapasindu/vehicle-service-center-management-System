import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import { ReviewSchema } from '../../../schemas/review';
import reviewService from '../../../services/reviewService';
import getImageUrl from '../../../util/getImageUrl';
import Sidebar from '../../../components/Customer/SideBar/CustomerSidebar';
import Header from '../../../components/Customer/Header/CustomerHeader';
import StarRating from '../../../components/Customer/StarRating/StarRating';
import { formatShortDate } from '../../../util/dateFormatter';
import { enums } from '../../../constants/enum';
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
    const [bookingDetails, setBookingDetails] = useState(null);
    const [hoverRating, setHoverRating] = useState(0);
    const [initialValues, setInitialValues] = useState({ rating: 0, comment: '' });

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
                    setInitialValues({
                        rating: reviewData.rating || 0,
                        comment: reviewData.comment || ''
                    });
                }
            } catch (error) {
                toast.error(error.response?.data?.payload?.message || 'Failed to load details');
                navigate('/customer/reviews');
            } finally {
                setLoading(false);
            }
        };

        if (bookingId) {
            fetchData();
        }
    }, [bookingId, isEditMode, reviewId, navigate]);

    const handleSubmitReview = async (values, { setSubmitting }) => {
        try {
            if (isEditMode && reviewId) {
                const response = await reviewService.updateReview(reviewId, { rating: values.rating, comment: values.comment });
                toast.success(response.data?.payload?.message || 'Review updated successfully');
            } else {
                const payload = {
                    bookingId,
                    rating: values.rating,
                    comment: values.comment
                };
                const response = await reviewService.addReview(payload);
                toast.success(response.data?.payload?.message || 'Review submitted successfully');
            }
            navigate('/customer/reviews');
        } catch (error) {
            toast.error(error.response?.data?.payload?.message || 'Failed to submit review');
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
    const formattedDate = formatShortDate(serviceDate);

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
                                <span className="status-badge">{status?.toUpperCase() || enums.JOBCARD_STATUS.FINISH}</span>
                                <h2>{vehicleName} - {packageName}</h2>
                                <div className="service-date">
                                    <i className="fa-regular fa-calendar"></i>
                                    <span>Service Date: {formattedDate}</span>
                                </div>
                            </div>
                        </div>

                        <Formik
                            initialValues={initialValues}
                            enableReinitialize={true}
                            validationSchema={ReviewSchema}
                            onSubmit={handleSubmitReview}
                        >
                            {({ isSubmitting, setFieldValue, values, errors, touched }) => (
                                <Form className="review-form">
                                    <div className="rating-section">
                                        <h3>How would you rate your detail?</h3>
                                        <StarRating 
                                            rating={values.rating}
                                            hoverRating={hoverRating}
                                            interactive={true}
                                            onRatingChange={(star) => setFieldValue('rating', star)}
                                            onHoverChange={setHoverRating}
                                        />
                                        {errors.rating && touched.rating ? (
                                            <span className="rating-hint" style={{color: '#ef4444', marginTop: '10px'}}>{errors.rating}</span>
                                        ) : (
                                            <span className="rating-hint">Select a star to rate</span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <div className="form-label-row">
                                            <label htmlFor="detailed-comments">Detailed Comments</label>
                                            <span className="optional-text">Optional</span>
                                        </div>
                                        <Field
                                            as="textarea"
                                            id="detailed-comments"
                                            name="comment"
                                            className="review-textarea"
                                            placeholder="Share details about the quality of work, staff, and overall service experience..."
                                        />
                                    </div>

                                    <div className="submit-button-container">
                                        <button
                                            type="submit"
                                            className="submit-review-btn"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Processing...' : (isEditMode ? 'Update Review' : 'Submit Review')}
                                            {!isSubmitting && <i className={`fa-solid ${isEditMode ? 'fa-pen-to-square' : 'fa-paper-plane'}`}></i>}
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default WriteReview;
