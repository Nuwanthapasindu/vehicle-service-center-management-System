const router = require("express").Router();
const { 
    getAvailableTimeslots, 
    getAllTimeslots, 
    createTimeslot, 
    updateTimeslot, 
    updateTimeslotState,
    deleteTimeslot,
    getTimeslotById,
    getDailySchedule
} = require("../controller/timeslot.controller");
const { authTokenMiddleware } = require("../middleware/auth");
const responseBuild = require("../util/responseBuilder");
const { USER_ROLES } = require("../util/constants");
const AppError = require("../error/AppError");

// Customer view
router.get("/available", authTokenMiddleware, (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    const { date } = req.query;

    getAvailableTimeslots(date)
        .then((slots) => {
            responseBuilder.setStatus(200);
            responseBuilder.buildResponse({ slots });
        })
        .catch((error) => next(error));
});

// Admin view (get all)
router.get("/all", authTokenMiddleware, (req, res, next) => {
    if (req.user.role !== USER_ROLES.ADMIN) return next(new AppError("Unauthorized", 403));
    const responseBuilder = new responseBuild(res);

    getAllTimeslots()
        .then((slots) => {
            responseBuilder.setStatus(200);
            responseBuilder.buildResponse({ slots });
        })
        .catch((error) => next(error));
});

// Admin schedule (with vehicles)
router.get("/schedule", authTokenMiddleware, (req, res, next) => {
    if (req.user.role !== USER_ROLES.ADMIN) return next(new AppError("Unauthorized", 403));
    const responseBuilder = new responseBuild(res);
    const { date } = req.query;

    getDailySchedule(date)
        .then((schedule) => {
            responseBuilder.setStatus(200);
            responseBuilder.buildResponse({ schedule });
        })
        .catch((error) => next(error));
});

// Admin get by id
router.get("/:id", authTokenMiddleware, (req, res, next) => {
    if (req.user.role !== USER_ROLES.ADMIN) return next(new AppError("Unauthorized", 403));
    const responseBuilder = new responseBuild(res);

    getTimeslotById(req.params.id)
        .then((slot) => {
            responseBuilder.setStatus(200);
            responseBuilder.buildResponse({ slot });
        })
        .catch((error) => next(error));
});

// Admin create
router.post("/", authTokenMiddleware, (req, res, next) => {
    if (req.user.role !== USER_ROLES.ADMIN) return next(new AppError("Unauthorized", 403));
    const responseBuilder = new responseBuild(res);

    createTimeslot(req.body)
        .then((slot) => {
            responseBuilder.setStatus(201);
            responseBuilder.buildResponse({ message: "Timeslot created successfully", slot });
        })
        .catch((error) => next(error));
});

// Admin update
router.put("/:id", authTokenMiddleware, (req, res, next) => {
    if (req.user.role !== USER_ROLES.ADMIN) return next(new AppError("Unauthorized", 403));
    const responseBuilder = new responseBuild(res);

    updateTimeslot(req.params.id, req.body)
        .then((slot) => {
            responseBuilder.setStatus(200);
            responseBuilder.buildResponse({ message: "Timeslot updated successfully", slot });
        })
        .catch((error) => next(error));
});

// Admin toggle state
router.patch("/:id/state", authTokenMiddleware, (req, res, next) => {
    if (req.user.role !== USER_ROLES.ADMIN) return next(new AppError("Unauthorized", 403));
    const responseBuilder = new responseBuild(res);

    updateTimeslotState(req.params.id, req.body.isActive)
        .then((slot) => {
            responseBuilder.setStatus(200);
            responseBuilder.buildResponse({ message: "Timeslot status updated successfully", slot });
        })
        .catch((error) => next(error));
});

// Admin delete
router.delete("/:id", authTokenMiddleware, (req, res, next) => {
    if (req.user.role !== USER_ROLES.ADMIN) return next(new AppError("Unauthorized", 403));
    const responseBuilder = new responseBuild(res);

    deleteTimeslot(req.params.id)
        .then(() => {
            responseBuilder.setStatus(200);
            responseBuilder.buildResponse({ message: "Timeslot deleted successfully" });
        })
        .catch((error) => next(error));
});

module.exports = router;
