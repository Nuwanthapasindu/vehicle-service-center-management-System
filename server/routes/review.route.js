const router = require("express").Router();
const { 
    addReview, 
    getBookingDetailsForReview, 
    getMyReviews, 
    updateReview, 
    deleteReview, 
    getReviewById 
} = require("../controller/review.controller");
const { authTokenMiddleware } = require("../middleware/auth");
const responseBuild = require("../util/responseBuilder");

router.post("/", authTokenMiddleware, (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    const mobile = req.user.mobile;
    const payload = req.body;

    addReview(payload, mobile)
        .then((message) => {
            responseBuilder.setStatus(201);
            responseBuilder.buildResponse({ message });
        })
        .catch((error) => next(error));
});

router.get("/my", authTokenMiddleware, (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    const mobile = req.user.mobile;
    const { status } = req.query;

    getMyReviews(mobile, status)
        .then((data) => {
            responseBuilder.setStatus(200);
            responseBuilder.buildResponse(data);
        })
        .catch((error) => next(error));
});

router.get("/detail/:reviewId", authTokenMiddleware, (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    const mobile = req.user.mobile;
    const { reviewId } = req.params;

    getReviewById(reviewId, mobile)
        .then((data) => {
            responseBuilder.setStatus(200);
            responseBuilder.buildResponse(data);
        })
        .catch((error) => next(error));
});

router.get("/:bookingId", authTokenMiddleware, (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    const mobile = req.user.mobile;
    const { bookingId } = req.params;

    getBookingDetailsForReview(bookingId, mobile)
        .then((data) => {
            responseBuilder.setStatus(200);
            responseBuilder.buildResponse(data);
        })
        .catch((error) => next(error));
});

router.patch("/:reviewId", authTokenMiddleware, (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    const mobile = req.user.mobile;
    const { reviewId } = req.params;
    const payload = req.body;

    updateReview(reviewId, mobile, payload)
        .then((message) => {
            responseBuilder.setStatus(200);
            responseBuilder.buildResponse({ message });
        })
        .catch((error) => next(error));
});

router.delete("/:reviewId", authTokenMiddleware, (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    const mobile = req.user.mobile;
    const { reviewId } = req.params;

    deleteReview(reviewId, mobile)
        .then((message) => {
            responseBuilder.setStatus(200);
            responseBuilder.buildResponse({ message });
        })
        .catch((error) => next(error));
});

module.exports = router;
