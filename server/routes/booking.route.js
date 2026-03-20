const router = require("express").Router();
const { getAvailableTimeslots, createBooking } = require("../controller/booking.controller");
const { authTokenMiddleware } = require("../middleware/auth");
const responseBuild = require("../util/responseBuilder");

router.get("/timeslots", authTokenMiddleware, (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    const { date } = req.query;

    getAvailableTimeslots(date)
        .then((slots) => {
            responseBuilder.setStatus(200);
            responseBuilder.buildResponse({ slots });
        })
        .catch((error) => next(error));
});

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

module.exports = router;
