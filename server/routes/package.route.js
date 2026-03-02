/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     PricingTier:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         name:
 *           type: string
 *           description: Pricing tier logic mapping like 'Standard' or 'Premium'
 *         price:
 *           type: number
 *           format: float
 *           description: Price for the associated tier
 *     Package:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         applicableVehicalModels:
 *           type: array
 *           items:
 *             type: string
 *             enum: [CAR, VAN, SUV, JEEP]
 *         description:
 *           type: string
 *         pricingTiers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PricingTier'
 *         servicesIncluded:
 *           type: array
 *           items:
 *             type: string
 *             description: ID references to Service entities
 *         image:
 *           type: string
 *           description: Hex ID reference to File uploads
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const router = require("express").Router();
const {
  createPackage,
} = require("../controller/package.controller");
/**
 * @swagger
 * /api/v1/package:
 *   post:
 *     summary: Create a new package
 *     tags: [Package]
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
 *               - applicableVehicalModels
 *               - pricingTiers
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               applicableVehicalModels:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: string
 *                   enum: [CAR, VAN, SUV, JEEP]
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *               pricingTiers:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   $ref: '#/components/schemas/PricingTier'
 *               servicesIncluded:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: 24 character hex object ID representing a Service
 *               image:
 *                 type: string
 *                 description: Hex ID of the uploaded File document
 *     responses:
 *       201:
 *         description: Package created successfully
 *       400:
 *         description: Bad request / validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/", authTokenMiddleware, (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const payload = req.body;

  createPackage(payload)
    .then((message) => {
      responseBuilder.setStatus(201);
      responseBuilder.buildResponse({ message });
    })
    .catch((error) => next(error));
});

