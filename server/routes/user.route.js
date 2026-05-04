const router = require("express").Router();
const {
  updateProfile,
  searchCustomersByMobile,
  getAllCustomers,
  getCustomerDetails,
} = require("../controller/user.controller");
const { authTokenMiddleware, accessControl } = require("../middleware/auth");
const { USER_ROLES } = require("../util/constants");
const responseBuild = require("../util/responseBuilder");

/**
 * @swagger
 * /api/v1/user/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.put("/profile", authTokenMiddleware, (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const payload = req.body;
  const mobile = req.user.mobile;

  updateProfile(payload, mobile)
    .then((user) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({
        message: "Profile updated successfully",
        user,
      });
    })
    .catch((error) => next(error));
});

/**
 * @swagger
 * /api/v1/user/search-mobile/{mobile}:
 *   get:
 *     summary: Search customers by mobile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mobile
 *         required: true
 *         schema:
 *           type: string
 *         description: Mobile number to search
 *     responses:
 *       200:
 *         description: Customers retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/search-mobile/:mobile",
  authTokenMiddleware,
  accessControl([USER_ROLES.ADMIN]),
  (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    const { mobile } = req.params;

    searchCustomersByMobile(mobile)
      .then((customers) => {
        responseBuilder.setStatus(200);
        responseBuilder.buildResponse({ customers });
      })
      .catch((error) => next(error));
  },
);

/**
 * @swagger
 * /api/v1/user/customers:
 *   get:
 *     summary: Get all customers
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customers retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/customers",
  authTokenMiddleware,
  accessControl([USER_ROLES.ADMIN]),
  (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    const { search } = req.query;

    getAllCustomers(search)
      .then((customers) => {
        responseBuilder.setStatus(200);
        responseBuilder.buildResponse({ customers });
      })
      .catch((error) => next(error));
  },
);

/**
 * @swagger
 * /api/v1/user/customers/{customerId}:
 *   get:
 *     summary: Get customer details by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer details retrieved successfully
 *       404:
 *         description: Customer not found
 */
router.get("/customers/:customerId", authTokenMiddleware, (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const { customerId } = req.params;

  getCustomerDetails(customerId)
    .then((data) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse(data);
    })
    .catch((error) => next(error));
});

module.exports = router;
