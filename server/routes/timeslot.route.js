const router = require("express").Router();
const { getAvailableTimeslots } = require("../controller/timeslot.controller");
const { authTokenMiddleware } = require("../middleware/auth");
const responseBuild = require("../util/responseBuilder");

router.get("/", authTokenMiddleware, (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    const { date } = req.query;

    getAvailableTimeslots(date)
        .then((slots) => {
            responseBuilder.setStatus(200);
            responseBuilder.buildResponse({ slots });
        })
        .catch((error) => next(error));
});

module.exports = router;
