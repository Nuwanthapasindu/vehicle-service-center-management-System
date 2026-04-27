const router = require("express").Router();
const {
  createBooking,
  getBookingHistory,
  getDashboardData,
  getAdminBookingDetails,
  updateBookingByAdmin,
  cancelBookingByAdmin,
} = require("../controller/booking.controller");
const { USER_ROLES } = require("../util/constants");
const { authTokenMiddleware, accessControl } = require("../middleware/auth");
const responseBuild = require("../util/responseBuilder");

/**
 * @swagger
 * /api/v1/booking:
 *   post:
 *     summary: Create a new booking
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehicleId:
 *                 type: string
 *               serviceId:
 *                 type: string
 *               packageId:
 *                 type: string
 *               timeslotId:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking confirmed successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/", authTokenMiddleware, (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const mobile = req.user.mobile;
  const payload = req.body;

  createBooking(payload, mobile)
    .then((booking) => {
      responseBuilder.setStatus(201);
      responseBuilder.buildResponse({
        message: "Booking confirmed successfully",
        booking,
      });
    })
    .catch((error) => next(error));
});

/**
 * @swagger
 * /api/v1/booking/my-history:
 *   get:
 *     summary: Get user booking history
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Booking status filter
 *       - in: query
 *         name: vehicle
 *         schema:
 *           type: string
 *         description: Vehicle ID filter
 *       - in: query
 *         name: duration
 *         schema:
 *           type: string
 *         description: Duration filter
 *     responses:
 *       200:
 *         description: Booking history retrieved successfully
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @swagger
 * /api/v1/booking/dashboard:
 *   get:
 *     summary: Get user dashboard data
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @swagger
 * /api/v1/booking/admin/{id}/details:
 *   get:
 *     summary: Get admin booking details
 *     tags: [Booking Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking details retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// Admin Booking Details
router.get(
  "/admin/:id/details",
  authTokenMiddleware,
  accessControl([USER_ROLES.ADMIN]),
  (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    const bookingId = req.params.id;

    getAdminBookingDetails(bookingId)
      .then((data) => {
        responseBuilder.setStatus(200);
        responseBuilder.buildResponse({ data });
      })
      .catch((error) => next(error));
  },
);

/**
 * @swagger
 * /api/v1/booking/admin/{id}:
 *   patch:
 *     summary: Update booking by admin
 *     tags: [Booking Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// Admin Update Booking
router.patch(
  "/admin/:id",
  authTokenMiddleware,
  accessControl([USER_ROLES.ADMIN]),
  (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    const bookingId = req.params.id;
    const payload = req.body;

    updateBookingByAdmin(bookingId, payload)
      .then((message) => {
        responseBuilder.setStatus(200);
        responseBuilder.buildResponse({
          message,
        });
      })
      .catch((error) => next(error));
  },
);

/**
 * @swagger
 * /api/v1/booking/admin/{id}:
 *   delete:
 *     summary: Cancel booking by admin
 *     tags: [Booking Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// Admin Cancel Booking
router.delete(
  "/admin/:id",
  authTokenMiddleware,
  accessControl([USER_ROLES.ADMIN]),
  (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    const bookingId = req.params.id;

    cancelBookingByAdmin(bookingId)
      .then((result) => {
        responseBuilder.setStatus(200);
        responseBuilder.buildResponse(result);
      })
      .catch((error) => next(error));
  },
);

module.exports = router;
