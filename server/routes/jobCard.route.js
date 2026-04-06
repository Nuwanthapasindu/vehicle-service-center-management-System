const express = require("express");
const router = express.Router();
const { 
    createJobCard, 
    getEligibleTeamsForJob, 
    assignTeam, 
    getMyTasks, 
    getAllBookings, 
    getAllPackages, 
    getAllServices 
} = require("../controller/jobCard.controller");
const responseBuilder = require("../util/responseBuilder");
const { authTokenMiddleware } = require("../middleware/auth");

// Create Job Card
router.post("/", authTokenMiddleware, (req, res, next) => {
    const builder = new responseBuilder(res);
    createJobCard(req.body).then((data) => {
        builder.setStatus(201);
        builder.buildResponse({ message: "Job Card created successfully", data });
    }).catch(next);
});

// Get Eligible Teams
router.get("/eligible-teams", authTokenMiddleware, (req, res, next) => {
    const builder = new responseBuilder(res);
    getEligibleTeamsForJob().then((data) => {
        builder.setStatus(200);
        builder.buildResponse({ data });
    }).catch(next);
});

// Assign Team
router.patch("/assign", authTokenMiddleware, (req, res, next) => {
    const builder = new responseBuilder(res);
    assignTeam(req.body).then((data) => {
        builder.setStatus(200);
        builder.buildResponse({ message: "Team assigned and job started", data });
    }).catch(next);
});

// Get My Tasks (Employee)
router.get("/my-tasks", authTokenMiddleware, (req, res, next) => {
    const builder = new responseBuilder(res);
    getMyTasks(req.user).then((data) => {
        builder.setStatus(200);
        builder.buildResponse({ message: "Tasks retrieved successfully", data });
    }).catch(next);
});

// Get Bookings
router.get("/bookings", authTokenMiddleware, (req, res, next) => {
    const builder = new responseBuilder(res);
    getAllBookings().then((data) => {
        builder.setStatus(200);
        builder.buildResponse({ data });
    }).catch(next);
});

// Get Packages
router.get("/packages", authTokenMiddleware, (req, res, next) => {
    const builder = new responseBuilder(res);
    getAllPackages().then((data) => {
        builder.setStatus(200);
        builder.buildResponse({ data });
    }).catch(next);
});

// Get Services
router.get("/services", authTokenMiddleware, (req, res, next) => {
    const builder = new responseBuilder(res);
    getAllServices().then((data) => {
        builder.setStatus(200);
        builder.buildResponse({ data });
    }).catch(next);
});

module.exports = router;