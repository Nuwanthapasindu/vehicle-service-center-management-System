const router = require("express").Router();
const {
  getAvailableTimeslots,
  getAllTimeslots,
  createTimeslot,
  updateTimeslot,
  updateTimeslotState,
  deleteTimeslot,
  getTimeslotById,
  getDailySchedule,
} = require("../controller/timeslot.controller");
const { authTokenMiddleware, accessControl } = require("../middleware/auth");
const responseBuild = require("../util/responseBuilder");
const { USER_ROLES } = require("../util/constants");
const AppError = require("../error/AppError");

/**
 * @swagger
 * /api/v1/timeslot/available:
 *   get:
 *     summary: Get available timeslots
 *     tags: [Timeslot]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: Date to check for available timeslots
 *     responses:
 *       200:
 *         description: Available timeslots retrieved successfully
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @swagger
 * /api/v1/timeslot/all:
 *   get:
 *     summary: Get all timeslots
 *     tags: [Timeslot]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All timeslots retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// Admin view (get all)
router.get(
  "/all",
  authTokenMiddleware,
  accessControl([USER_ROLES.ADMIN]),
  (req, res, next) => {
    const responseBuilder = new responseBuild(res);

    getAllTimeslots()
      .then((slots) => {
        responseBuilder.setStatus(200);
        responseBuilder.buildResponse({ slots });
      })
      .catch((error) => next(error));
  },
);

/**
 * @swagger
 * /api/v1/timeslot/schedule:
 *   get:
 *     summary: Get daily schedule
 *     tags: [Timeslot]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: Date for the schedule
 *     responses:
 *       200:
 *         description: Schedule retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// Admin schedule (with vehicles)
router.get(
  "/schedule",
  authTokenMiddleware,
  accessControl([USER_ROLES.ADMIN]),
  (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    const { date } = req.query;

    getDailySchedule(date)
      .then((schedule) => {
        responseBuilder.setStatus(200);
        responseBuilder.buildResponse({ schedule });
      })
      .catch((error) => next(error));
  },
);

/**
 * @swagger
 * /api/v1/timeslot/{id}:
 *   get:
 *     summary: Get timeslot by ID
 *     tags: [Timeslot]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Timeslot ID
 *     responses:
 *       200:
 *         description: Timeslot retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// Admin get by id
router.get(
  "/:id",
  authTokenMiddleware,
  accessControl([USER_ROLES.ADMIN]),
  (req, res, next) => {
    const responseBuilder = new responseBuild(res);

    getTimeslotById(req.params.id)
      .then((slot) => {
        responseBuilder.setStatus(200);
        responseBuilder.buildResponse({ slot });
      })
      .catch((error) => next(error));
  },
);

/**
 * @swagger
 * /api/v1/timeslot:
 *   post:
 *     summary: Create a timeslot
 *     tags: [Timeslot]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               capacity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Timeslot created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// Admin create
router.post(
  "/",
  authTokenMiddleware,
  accessControl([USER_ROLES.ADMIN]),
  (req, res, next) => {
    const responseBuilder = new responseBuild(res);

    createTimeslot(req.body)
      .then((slot) => {
        responseBuilder.setStatus(201);
        responseBuilder.buildResponse({
          message: "Timeslot created successfully",
          slot,
        });
      })
      .catch((error) => next(error));
  },
);

/**
 * @swagger
 * /api/v1/timeslot/{id}:
 *   put:
 *     summary: Update a timeslot
 *     tags: [Timeslot]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Timeslot ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               capacity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Timeslot updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// Admin update
router.put(
  "/:id",
  authTokenMiddleware,
  accessControl([USER_ROLES.ADMIN]),
  (req, res, next) => {
    const responseBuilder = new responseBuild(res);

    updateTimeslot(req.params.id, req.body)
      .then((slot) => {
        responseBuilder.setStatus(200);
        responseBuilder.buildResponse({
          message: "Timeslot updated successfully",
          slot,
        });
      })
      .catch((error) => next(error));
  },
);

/**
 * @swagger
 * /api/v1/timeslot/{id}/state:
 *   patch:
 *     summary: Toggle timeslot state
 *     tags: [Timeslot]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Timeslot ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Timeslot status updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// Admin toggle state
router.patch(
  "/:id/state",
  authTokenMiddleware,
  accessControl([USER_ROLES.ADMIN]),
  (req, res, next) => {
    const responseBuilder = new responseBuild(res);

    updateTimeslotState(req.params.id, req.body.isActive)
      .then((slot) => {
        responseBuilder.setStatus(200);
        responseBuilder.buildResponse({
          message: "Timeslot status updated successfully",
          slot,
        });
      })
      .catch((error) => next(error));
  },
);

/**
 * @swagger
 * /api/v1/timeslot/{id}:
 *   delete:
 *     summary: Delete a timeslot
 *     tags: [Timeslot]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Timeslot ID
 *     responses:
 *       200:
 *         description: Timeslot deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// Admin delete
router.delete(
  "/:id",
  authTokenMiddleware,
  accessControl([USER_ROLES.ADMIN]),
  (req, res, next) => {
    const responseBuilder = new responseBuild(res);

    deleteTimeslot(req.params.id)
      .then(() => {
        responseBuilder.setStatus(200);
        responseBuilder.buildResponse({
          message: "Timeslot deleted successfully",
        });
      })
      .catch((error) => next(error));
  },
);

module.exports = router;
