import axios from "axios";

const addReview = (payload) => {
    return axios.post("/review", payload);
};

const getBookingDetailsForReview = (bookingId) => {
    return axios.get(`/review/${bookingId}`);
};

const getMyReviews = (status = 'all') => {
    return axios.get(`/review/my`, { params: { status } });
};

const updateReview = (reviewId, payload) => {
    return axios.patch(`/review/${reviewId}`, payload);
};

const deleteReview = (reviewId) => {
    return axios.delete(`/review/${reviewId}`);
};

const getReviewDetail = (reviewId) => {
    return axios.get(`/review/detail/${reviewId}`);
};

const getPublicReviews = (params) => {
    return axios.get(`/review`, { params });
};

const reviewService = {
    addReview,
    getBookingDetailsForReview,
    getMyReviews,
    updateReview,
    deleteReview,
    getReviewDetail,
    getPublicReviews
};


export default reviewService;
