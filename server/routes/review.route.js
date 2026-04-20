const router = require("express").Router();
const {
  addReview,
  getBookingDetailsForReview,
  getMyReviews,
  updateReview,
  deleteReview,
  getReviewById,
  getAllPublicReviews,
  getAllReviews,
  addAdminReply,
  updateAdminReply,
  deleteAdminReply,
  updateReviewApprovalStatus,
  getCustomerReviewById,
} = require("../controller/review.controller");
const { getAdminReviewReport } = require("../controller/report.controller");
const { authTokenMiddleware, accessControl } = require("../middleware/auth");
const { USER_ROLES } = require("../util/constants");
const responseBuild = require("../util/responseBuilder");

/**
 * @swagger
 * /api/v1/review:
 *   get:
 *     summary: Get all public/approved reviews
 *     tags: [Review]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sorting method (recent, top-rated)
 *       - in: query
 *         name: service
 *         schema:
 *           type: string
 *         description: Filter by service name
 *     responses:
 *       200:
 *         description: List of public reviews
 */
router.get("/", (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const query = req.query;

  getAllPublicReviews(query)
    .then((data) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse(data);
    })
    .catch((error) => next(error));
});

/**
 * @swagger
 * /api/v1/review:
 *   post:
 *     summary: Add a new review
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *               - rating
 *             properties:
 *               bookingId:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review submitted successfully
 *       400:
 *         description: Validation or booking errors
 */
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

/**
 * @swagger
 * /api/v1/review/admin:
 *   get:
 *     summary: Get all reviews for admin dashboard
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: isApproved
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of all reviews
 */
router.get(
  "/admin",
  authTokenMiddleware,
  accessControl([USER_ROLES.ADMIN]),
  (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    const { page, limit, isApproved } = req.query;

    getAllReviews(page, limit, isApproved)
      .then((reviews) => {
        responseBuilder.setStatus(200);
        responseBuilder.buildResponse({ reviews });
      })
      .catch((error) => next(error));
  },
);

/**
 * @swagger
 * /api/v1/review/admin/report:
 *   get:
 *     summary: Get review report statistics for admin
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Admin review report statistics
 */
router.get(
  "/admin/report",
  authTokenMiddleware,
  accessControl([USER_ROLES.ADMIN]),
  (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    const query = req.query;

    getAdminReviewReport(query)
      .then((data) => {
        responseBuilder.setStatus(200);
        responseBuilder.buildResponse(data);
      })
      .catch((error) => next(error));
  },
);

/**
 * @swagger
 * /api/v1/review/admin/{reviewId}:
 *   get:
 *     summary: Get specific review details for admin
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review details
 */
router.get(
  "/admin/:reviewId",
  authTokenMiddleware,
  accessControl([USER_ROLES.ADMIN]),
  (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    const { reviewId } = req.params;

    getCustomerReviewById(reviewId)
      .then((review) => {
        responseBuilder.setStatus(200);
        responseBuilder.buildResponse({ review });
      })
      .catch((error) => next(error));
  },
);

/**
 * @swagger
 * /api/v1/review/admin/{reviewId}/reply:
 *   post:
 *     summary: Add an admin reply to a review
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reply
 *             properties:
 *               reply:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin reply added successfully
 */
router.post(
  "/admin/:reviewId/reply",
  authTokenMiddleware,
  accessControl([USER_ROLES.ADMIN]),
  (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    const { reviewId } = req.params;
    const payload = req.body;

    addAdminReply(reviewId, payload)
      .then((message) => {
        responseBuilder.setStatus(201);
        responseBuilder.buildResponse({ message });
      })
      .catch((error) => next(error));
  },
);

/**
 * @swagger
 * /api/v1/review/admin/{reviewId}/reply:
 *   patch:
 *     summary: Update an existing admin reply
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reply
 *             properties:
 *               reply:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin reply updated successfully
 */
router.patch(
  "/admin/:reviewId/reply",
  authTokenMiddleware,
  accessControl([USER_ROLES.ADMIN]),
  (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    const { reviewId } = req.params;
    const payload = req.body;

    updateAdminReply(reviewId, payload)
      .then((message) => {
        responseBuilder.setStatus(200);
        responseBuilder.buildResponse({ message });
      })
      .catch((error) => next(error));
  },
);

/**
 * @swagger
 * /api/v1/review/admin/{reviewId}/reply:
 *   delete:
 *     summary: Delete an admin reply
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin reply deleted successfully
 */
router.delete(
  "/admin/:reviewId/reply",
  authTokenMiddleware,
  accessControl([USER_ROLES.ADMIN]),
  (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    const { reviewId } = req.params;

    deleteAdminReply(reviewId)
      .then((message) => {
        responseBuilder.setStatus(200);
        responseBuilder.buildResponse({ message });
      })
      .catch((error) => next(error));
  },
);

/**
 * @swagger
 * /api/v1/review/admin/{reviewId}/approval:
 *   patch:
 *     summary: Approve or reject a review
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isApproved
 *             properties:
 *               isApproved:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Approval status updated
 */
router.patch(
  "/admin/:reviewId/approval",
  authTokenMiddleware,
  accessControl([USER_ROLES.ADMIN]),
  (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    const { reviewId } = req.params;
    const payload = req.body;

    updateReviewApprovalStatus(reviewId, payload)
      .then((message) => {
        responseBuilder.setStatus(200);
        responseBuilder.buildResponse({ message });
      })
      .catch((error) => next(error));
  },
);

/**
 * @swagger
 * /api/v1/review/my:
 *   get:
 *     summary: Get reviews submitted by the authenticated user
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter status (all, published, pending)
 *     responses:
 *       200:
 *         description: List of user's reviews
 */
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

/**
 * @swagger
 * /api/v1/review/detail/{reviewId}:
 *   get:
 *     summary: Get a specific review by ID
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review details
 *       404:
 *         description: Review not found
 */
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

/**
 * @swagger
 * /api/v1/review/{bookingId}:
 *   get:
 *     summary: Get booking details associated with a review
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking context data
 */
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

/**
 * @swagger
 * /api/v1/review/{reviewId}:
 *   patch:
 *     summary: Update an existing review
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated successfully
 */
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

/**
 * @swagger
 * /api/v1/review/{reviewId}:
 *   delete:
 *     summary: Delete a customer review
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 */
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
