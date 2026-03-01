/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     PriceEntry:
 *       type: object
 *       required:
 *         - model
 *         - price
 *       properties:
 *         model:
 *           type: string
 *           enum: [CAR, VAN, SUV, JEEP]
 *           description: Vehicle model
 *         price:
 *           type: number
 *           format: float
 *           description: Price for the specific vehicle model
 *     Service:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         image:
 *           type: string
 *           description: ID of the uploaded file
 *         prices:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PriceEntry'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const router = require("express").Router();
const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  bulkPriceUpdate,
} = require("../controller/service.controller");
const { authTokenMiddleware } = require("../middleware/auth");
const responseBuild = require("../util/responseBuilder");

/**
 * @swagger
 * /api/v1/service:
 *   post:
 *     summary: Create a new service
 *     tags: [Service]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - prices
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 500
 *               image:
 *                 type: string
 *                 description: Hex ID of the uploaded File document
 *               prices:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   $ref: '#/components/schemas/PriceEntry'
 *     responses:
 *       201:
 *         description: Service created successfully
 *       400:
 *         description: Bad request / validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/", authTokenMiddleware, (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const payload = req.body;

  createService(payload)
    .then((message) => {
      responseBuilder.setStatus(201);
      responseBuilder.buildResponse({ message });
    })
    .catch((error) => next(error));
});
/**
 * @swagger
 * /api/v1/service:
 *   get:
 *     summary: Get all services with pagination and filtering
 *     tags: [Service]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Search by service name
 *       - in: query
 *         name: model
 *         schema:
 *           type: string
 *           enum: [CAR, VAN, SUV, JEEP]
 *         description: Filter services by vehicle model availability
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Filter by minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Filter by maximum price
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *           enum: [name, createdAt, updatedAt]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           default: desc
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Successful query
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 services:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Service'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 pages:
 *                   type: integer
 */
router.get("/", (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const query = req.query;

  getServices(query)
    .then((services) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({ services });
    })
    .catch((error) => next(error));
});

/**
 * @swagger
 * /api/v1/service/bulk-update-price:
 *   patch:
 *     summary: Bulk update prices for multiple services
 *     tags: [Service]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceIds
 *               - priceUpdates
 *             properties:
 *               serviceIds:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: string
 *               priceUpdates:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - model
 *                     - newPrice
 *                   properties:
 *                     model:
 *                       type: string
 *                       enum: [CAR, VAN, SUV, JEEP]
 *                     newPrice:
 *                       type: number
 *     responses:
 *       200:
 *         description: Prices updated successfully
 *       400:
 *         description: Bad request / validation error
 *       401:
 *         description: Unauthorized
 */
