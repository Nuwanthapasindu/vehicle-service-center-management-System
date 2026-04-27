const router = require('express').Router();
const {
  createPurchaseOrder,
  getAllPurchaseOrders,
  updatePurchaseOrder,
  deletePurchaseOrder,
} = require('../controller/purchaseOrder.controller');
const responseBuild = require('../util/responseBuilder');
const { authTokenMiddleware, accessControl } = require('../middleware/auth');
const { USER_ROLES } = require('../util/constants');

router.use(authTokenMiddleware, accessControl([USER_ROLES.ADMIN]));

/**
 * @swagger
 * /api/v1/purchase-orders:
 *   post:
 *     summary: Create a purchase order
 *     tags: [Purchase Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               supplierId:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     itemId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *     responses:
 *       201:
 *         description: Purchase order created successfully
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

  createPurchaseOrder(payload)
    .then((order) => {
      responseBuilder.setStatus(201);
      responseBuilder.buildResponse({ order });
    })
    .catch((error) => next(error));
});

/**
 * @swagger
 * /api/v1/purchase-orders:
 *   get:
 *     summary: Get all purchase orders
 *     tags: [Purchase Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Purchase orders retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', (req, res, next) => {
  const responseBuilder = new responseBuild(res);

  getAllPurchaseOrders()
    .then((orders) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({ orders });
    })
    .catch((error) => next(error));
});

/**
 * @swagger
 * /api/v1/purchase-orders/{id}:
 *   put:
 *     summary: Update a purchase order
 *     tags: [Purchase Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Purchase Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Purchase order updated successfully
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

  updatePurchaseOrder(id, payload)
    .then((message) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({ message });
    })
    .catch((error) => next(error));
});

/**
 * @swagger
 * /api/v1/purchase-orders/{id}:
 *   delete:
 *     summary: Delete a purchase order
 *     tags: [Purchase Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Purchase Order ID
 *     responses:
 *       200:
 *         description: Purchase order deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.delete('/:id', (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const { id } = req.params;

  deletePurchaseOrder(id)
    .then((message) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({ message });
    })
    .catch((error) => next(error));
});

module.exports = router;
