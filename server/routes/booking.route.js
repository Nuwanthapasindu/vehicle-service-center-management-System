const router = require("express").Router();
const { createBooking, getBookingHistory, getDashboardData } = require("../controller/booking.controller");
const { authTokenMiddleware } = require("../middleware/auth");
const responseBuild = require("../util/responseBuilder");

router.post("/", authTokenMiddleware, (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    const mobile = req.user.mobile;
    const payload = req.body;

    createBooking(payload, mobile)
        .then((booking) => {
            responseBuilder.setStatus(201);
            responseBuilder.buildResponse({ message: "Booking confirmed successfully", booking });
        })
        .catch((error) => next(error));
});

router.get("/my-history", authTokenMiddleware, (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    const mobile = req.user.mobile;
    const { search, status, vehicle, duration } = req.query;

    getBookingHistory(mobile, { search, status, vehicle, duration })
        .then((history) => {
            responseBuilder.setStatus(200);
            responseBuilder.buildResponse({ history });
        })
        .catch((error) => next(error));
});

router.get("/dashboard", authTokenMiddleware, (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    const mobile = req.user.mobile;

    getDashboardData(mobile)
        .then((data) => {
            responseBuilder.setStatus(200);
            responseBuilder.buildResponse({ data });
        })
        .catch((error) => next(error));
});

module.exports = router;
