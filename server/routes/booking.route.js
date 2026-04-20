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
    .then((booking) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({
        message: "Booking updated successfully",
        booking,
      });
    })
    .catch((error) => next(error));
});

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
});

module.exports = router;
