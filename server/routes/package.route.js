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
  getPackages,
  getPackageById,
  updatePackage,
  deletePackage,
  getAllPackagesForJobCard: getAllPublicPackages,
} = require("../controller/package.controller");
const { authTokenMiddleware, accessControl } = require("../middleware/auth");
const { USER_ROLES } = require("../util/constants");
const responseBuild = require("../util/responseBuilder");

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
router.post("/", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const payload = req.body;

  createPackage(payload)
    .then((message) => {
      responseBuilder.setStatus(201);
      responseBuilder.buildResponse({ message });
    })
    .catch((error) => next(error));
});

/**
 * @swagger
 * /api/v1/package:
 *   get:
 *     summary: Get all packages with pagination and filtering
 *     tags: [Package]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Search by package name
 *       - in: query
 *         name: model
 *         schema:
 *           type: string
 *           enum: [CAR, VAN, SUV, JEEP]
 *         description: Filter packages by vehicle model
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
 *                 packages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Package'
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

  getPackages(query)
    .then((packages) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse(packages); // Direct passing as output includes pagination properties wrapper natively
    })
    .catch((error) => next(error));
});

/**
 * @swagger
 * /api/v1/package/public:
 *   get:
 *     summary: Get all published packages for public view
 *     tags: [Package]
 *     responses:
 *       200:
 *         description: Successful retrieval
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 packages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Package'
 */
router.get("/public", (req, res, next) => {
  const responseBuilder = new responseBuild(res);

  getAllPublicPackages()
    .then((packages) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({ packages });
    })
    .catch((error) => next(error));
});

/**
 * @swagger
 * /api/v1/package/{id}:
 *   get:
 *     summary: Get package by ID
 *     tags: [Package]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Package ID
 *     responses:
 *       200:
 *         description: Successful retrieval
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Package'
 *       404:
 *         description: Package not found
 */
router.get("/:id", (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const { id } = req.params;

  getPackageById(id)
    .then((package) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({ package });
    })
    .catch((error) => next(error));
});

/**
 * @swagger
 * /api/v1/package/{id}:
 *   put:
 *     summary: Update an existing package
 *     tags: [Package]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Package ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Package updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request / validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Package not found
 */
router.put("/:id", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const payload = req.body;
  const { id } = req.params;

  updatePackage(id, payload)
    .then((message) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({ message });
    })
    .catch((error) => next(error));
});

/**
 * @swagger
 * /api/v1/package/{id}:
 *   delete:
 *     summary: Delete a package
 *     tags: [Package]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Package ID
 *     responses:
 *       200:
 *         description: Package deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Package not found
 */
router.delete("/:id", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const { id } = req.params;

  deletePackage(id)
    .then((message) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({ message });
    })
    .catch((error) => next(error));
});

module.exports = router;
