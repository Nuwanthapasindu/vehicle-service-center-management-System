const router = require('express').Router();
const {
  createSupplier,
  getAllSuppliers,
  updateSupplier,
  deleteSupplier,
} = require('../controller/supplier.controller');
const responseBuild = require('../util/responseBuilder');
const { authTokenMiddleware, accessControl } = require('../middleware/auth');
const { USER_ROLES } = require('../util/constants');

router.use(authTokenMiddleware, accessControl([USER_ROLES.ADMIN]));

/**
 * @swagger
 * /api/v1/suppliers:
 *   post:
 *     summary: Create a supplier
 *     tags: [Supplier]
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
 *               contactPerson:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Supplier created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const payload = req.body;

  createSupplier(payload)
    .then((supplier) => {
      responseBuilder.setStatus(201);
      responseBuilder.buildResponse({ supplier });
    })
    .catch((error) => next(error));
});

/**
 * @swagger
 * /api/v1/suppliers:
 *   get:
 *     summary: Get all suppliers
 *     tags: [Supplier]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Suppliers retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', (req, res, next) => {
  const responseBuilder = new responseBuild(res);

  getAllSuppliers()
    .then((suppliers) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({ suppliers });
    })
    .catch((error) => next(error));
});

/**
 * @swagger
 * /api/v1/suppliers/{id}:
 *   put:
 *     summary: Update a supplier
 *     tags: [Supplier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Supplier ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               contactPerson:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Supplier updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put('/:id', (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const payload = req.body;
  const { id } = req.params;

  updateSupplier(id, payload)
    .then((message) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({ message });
    })
    .catch((error) => next(error));
});

/**
 * @swagger
 * /api/v1/suppliers/{id}:
 *   delete:
 *     summary: Delete a supplier
 *     tags: [Supplier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Supplier ID
 *     responses:
 *       200:
 *         description: Supplier deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.delete('/:id', (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const { id } = req.params;

  deleteSupplier(id)
    .then((message) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({ message });
    })
    .catch((error) => next(error));
});

module.exports = router;