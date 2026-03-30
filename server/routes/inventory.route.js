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

const { authTokenMiddleware } = require("../middleware/auth");
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
router.get("/", (req, res, next) => {
  const responseBuilder = new responseBuild(res);

  getInventory()
    .then((items) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({
        message: "Inventory fetched successfully",
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
router.post("/", authTokenMiddleware, (req, res, next) => {
  const responseBuilder = new responseBuild(res);

  addItem(req.body, req.user)
    .then((item) => {
      responseBuilder.setStatus(201);
      responseBuilder.buildResponse({
        message: "Item added to inventory",
        data: item,
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
router.patch("/adjust/:id", authTokenMiddleware, (req, res, next) => {
  const responseBuilder = new responseBuild(res);

  manualAdjustment(req.params.id, req.body, req.user)
    .then((item) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({
        message: "Manual stock adjustment successful",
        data: item,
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
router.patch("/reduce-stock", authTokenMiddleware, (req, res, next) => {
  const responseBuilder = new responseBuild(res);

  reduceStockByInvoice(req.body, req.user)
    .then(() => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({
        message: "Stock reduced for invoice items",
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
router.patch("/increase-stock", authTokenMiddleware, (req, res, next) => {
  const responseBuilder = new responseBuild(res);

  increaseStockByPO(req.body, req.user)
    .then(() => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({
        message: "Stock increased for received Order items",
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
router.patch("/:id", authTokenMiddleware, (req, res, next) => {
  const responseBuilder = new responseBuild(res);

  updateItem(req.params.id, req.body)
    .then((item) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({
        message: "Item details updated",
        data: item,
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
router.delete("/:id", authTokenMiddleware, (req, res, next) => {
  const responseBuilder = new responseBuild(res);

  deleteItem(req.params.id)
    .then(() => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({
        message: "Item removed from inventory",
      });
    })
    .catch(next);
});

module.exports = router;