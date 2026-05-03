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
const { authTokenMiddleware, accessControl } = require("../middleware/auth");
const { USER_ROLES } = require("../util/constants");

/**
 * @swagger
 * /api/v1/job-cards:
 *   post:
 *     summary: Create a job card
 *     tags: [Job Card]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingId:
 *                 type: string
 *               services:
 *                 type: array
 *                 items:
 *                   type: string
 *               packages:
 *                 type: array
 *                 items:
 *                   type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Job Card created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// Create Job Card
router.post("/", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
    const builder = new responseBuilder(res);
    createJobCard(req.body).then((data) => {
        builder.setStatus(201);
        builder.buildResponse({ message: "Job Card created successfully", data });
    }).catch(next);
});

/**
 * @swagger
 * /api/v1/job-cards/eligible-teams:
 *   get:
 *     summary: Get eligible teams for a job
 *     tags: [Job Card]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Eligible teams retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// Get Eligible Teams
router.get("/eligible-teams", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
    const builder = new responseBuilder(res);
    getEligibleTeamsForJob().then((data) => {
        builder.setStatus(200);
        builder.buildResponse({ data });
    }).catch(next);
});

/**
 * @swagger
 * /api/v1/job-cards/assign:
 *   patch:
 *     summary: Assign a team to a job card
 *     tags: [Job Card]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobCardId:
 *                 type: string
 *               teamId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Team assigned and job started
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// Assign Team
router.patch("/assign", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
    const builder = new responseBuilder(res);
    assignTeam(req.body).then((data) => {
        builder.setStatus(200);
        builder.buildResponse({ message: "Team assigned and job started", data });
    }).catch(next);
});

/**
 * @swagger
 * /api/v1/job-cards/my-tasks:
 *   get:
 *     summary: Get tasks for the current mechanic
 *     tags: [Job Card]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// Get My Tasks (Employee)
router.get("/my-tasks", authTokenMiddleware, accessControl([USER_ROLES.MECHANIC]), (req, res, next) => {
    const builder = new responseBuilder(res);
    getMyTasks(req.user).then((data) => {
        builder.setStatus(200);
        builder.buildResponse({ message: "Tasks retrieved successfully", data });
    }).catch(next);
});

/**
 * @swagger
 * /api/v1/job-cards/bookings:
 *   get:
 *     summary: Get all bookings for job cards
 *     tags: [Job Card]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// Get Bookings
router.get("/bookings", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
    const builder = new responseBuilder(res);
    getAllBookings().then((data) => {
        builder.setStatus(200);
        builder.buildResponse({ data });
    }).catch(next);
});

/**
 * @swagger
 * /api/v1/job-cards/packages:
 *   get:
 *     summary: Get all packages for job cards
 *     tags: [Job Card]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Packages retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// Get Packages
router.get("/packages", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
    const builder = new responseBuilder(res);
    getAllPackages().then((data) => {
        builder.setStatus(200);
        builder.buildResponse({ data });
    }).catch(next);
});

/**
 * @swagger
 * /api/v1/job-cards/services:
 *   get:
 *     summary: Get all services for job cards
 *     tags: [Job Card]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Services retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// Get Services
router.get("/services", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
    const builder = new responseBuilder(res);
    getAllServices().then((data) => {
        builder.setStatus(200);
        builder.buildResponse({ data });
    }).catch(next);
});

module.exports = router;