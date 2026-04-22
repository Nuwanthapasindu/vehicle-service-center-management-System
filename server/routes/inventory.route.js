/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Inventory management APIs
 */

const router = require("express").Router();
const {
  getInventory,
  addItem,
  manualAdjustment,
  reduceStockByInvoice,
  increaseStockByPO,
  updateItem,
  deleteItem,
} = require("../controller/inventory.controller");

const { authTokenMiddleware, accessControl } = require("../middleware/auth");
const { USER_ROLES } = require("../util/constants");
const responseBuild = require("../util/responseBuilder");

/**
 * @swagger
 * /api/v1/inventory:
 *   get:
 *     summary: Get all inventory items
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: Inventory fetched successfully
 */
router.get("/", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const { search, names } = req.query;
  const searchedNames = names ? names.split(",") : undefined;
  getInventory(search, searchedNames)
    .then((items) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({
        data: items,
      });
    })
    .catch(next);
});

/**
 * @swagger
 * /api/v1/inventory:
 *   post:
 *     summary: Add new inventory item
 *     tags: [Inventory]
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
 *               - qty
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *               qty:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Item added to inventory
 */
router.post("/", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
  const responseBuilder = new responseBuild(res);

  addItem(req.body, req.user)
    .then((message) => {
      responseBuilder.setStatus(201);
      responseBuilder.buildResponse({
        message,
      });
    })
    .catch(next);
});

/**
 * @swagger
 * /api/v1/inventory/adjust/{id}:
 *   patch:
 *     summary: Manually adjust stock
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               - quantityChange
 *             properties:
 *               quantityChange:
 *                 type: number
 *     responses:
 *       200:
 *         description: Stock adjusted successfully
 */
router.patch("/adjust/:id", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
  const responseBuilder = new responseBuild(res);

  manualAdjustment(req.params.id, req.body, req.user)
    .then((message) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({
        message,
      });
    })
    .catch(next);
});

/**
 * @swagger
 * /api/v1/inventory/reduce-stock:
 *   patch:
 *     summary: Reduce stock based on invoice
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     inventoryId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *     responses:
 *       200:
 *         description: Stock reduced successfully
 */
router.patch("/reduce-stock", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
  const responseBuilder = new responseBuild(res);

  reduceStockByInvoice(req.body, req.user)
    .then((message) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({
        message,
      });
    })
    .catch(next);
});

/**
 * @swagger
 * /api/v1/inventory/increase-stock:
 *   patch:
 *     summary: Increase stock from purchase order
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     inventoryId:
 *                       type: string
 *                     quantityReceived:
 *                       type: number
 *     responses:
 *       200:
 *         description: Stock increased successfully
 */
router.patch("/increase-stock", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
  const responseBuilder = new responseBuild(res);

  increaseStockByPO(req.body, req.user)
    .then((message) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({
        message,
      });
    })
    .catch(next);
});

/**
 * @swagger
 * /api/v1/inventory/{id}:
 *   patch:
 *     summary: Update inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item updated
 */
router.patch("/:id", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
  const responseBuilder = new responseBuild(res);

  updateItem(req.params.id, req.body)
    .then((message) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({
        message,
      });
    })
    .catch(next);
});

/**
 * @swagger
 * /api/v1/inventory/{id}:
 *   delete:
 *     summary: Delete inventory item (soft delete)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item deleted
 */
router.delete("/:id", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
  const responseBuilder = new responseBuild(res);

  deleteItem(req.params.id)
    .then((message) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({
        message,
      });
    })
    .catch(next);
});

module.exports = router;