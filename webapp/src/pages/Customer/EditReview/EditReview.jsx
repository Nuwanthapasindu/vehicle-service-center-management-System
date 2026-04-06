import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import { ReviewSchema as EditReviewSchema } from '../../../schemas/review';
import reviewService from '../../../services/reviewService';
import getImageUrl from '../../../util/getImageUrl';
import Sidebar from '../../../components/Customer/SideBar/CustomerSidebar';
import Header from '../../../components/Customer/Header/CustomerHeader';
import StarRating from '../../../components/Customer/StarRating/StarRating';
import { formatShortDate } from '../../../util/dateFormatter';
import { enums } from '../../../constants/enum';
import './EditReview.css';

const EditReview = () => {
    const { reviewId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [hoverRating, setHoverRating] = useState(0);
    const [initialValues, setInitialValues] = useState({ rating: 0, comment: '' });

    useEffect(() => {
        const fetchReviewAndBooking = async () => {
            try {
                // 1. Fetch review details
                const reviewResponse = await reviewService.getReviewDetail(reviewId);
                const reviewData = reviewResponse.data.payload;
                setInitialValues({
                    rating: reviewData.rating,
                    comment: reviewData.comment || ''
                });

                // 2. Fetch booking details for the summary card
                const bookingResponse = await reviewService.getBookingDetailsForReview(reviewData.booking);
                setBookingDetails(bookingResponse.data.payload);
            } catch (error) {
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

    const handleSubmitUpdate = async (values, { setSubmitting }) => {
        try {
            const payload = { rating: values.rating, comment: values.comment };
            const response = await reviewService.updateReview(reviewId, payload);
            toast.success(response.data?.payload?.message || 'Review updated successfully');
            navigate('/customer/reviews');
        } catch (error) {
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
    const formattedDate = formatShortDate(serviceDate);

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
                            validationSchema={EditReviewSchema}
                            onSubmit={handleSubmitUpdate}
                            enableReinitialize
                        >
                            {({ values, setFieldValue, isSubmitting, errors, touched }) => (
                                <>
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
                                            <span className="error-text" style={{ color: 'red', fontSize: '13px', fontWeight: 'bold' }}>{errors.rating}</span>
                                        ) : (
                                            <span className="rating-hint">Select a star to update your rating</span>
                                        )}
                                    </div>

                                    <Form className="review-form">
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
                                                type="button"
                                                className="cancel-btn"
                                                onClick={() => navigate('/customer/reviews')}
                                                disabled={isSubmitting}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="update-review-btn"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? 'Updating...' : 'Update Review'}
                                                {!isSubmitting && <i className="fa-solid fa-pen-to-square"></i>}
                                            </button>
                                        </div>
                                    </Form>
                                </>
                            )}
                        </Formik>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default EditReview;
