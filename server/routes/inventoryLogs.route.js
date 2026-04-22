/**
 * @swagger
 * tags:
 *   name: Inventory Logs
 *   description: Inventory logs and tracking APIs
 */

const router = require("express").Router();
const {
  getLogs,
  getLogsByItem,
} = require("../controller/inventoryLogs.controller");

const { authTokenMiddleware, accessControl } = require("../middleware/auth");
const { USER_ROLES } = require("../util/constants");
const responseBuild = require("../util/responseBuilder");

/**
 * @swagger
 * /api/v1/inventory-logs:
 *   get:
 *     summary: Get all inventory logs
 *     tags: [Inventory Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: actionType
 *         schema:
 *           type: string
 *         description: Filter logs by action type (e.g., PO, INVOICE, ADJUST)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *         description: Filter logs from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *         description: Filter logs until this date
 *     responses:
 *       200:
 *         description: Inventory logs fetched successfully
 */
router.get("/", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
  const responseBuilder = new responseBuild(res);

  getLogs(req.query)
    .then((result) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse(result);
    })
    .catch(next);
});

/**
 * @swagger
 * /api/v1/inventory-logs/{inventoryId}:
 *   get:
 *     summary: Get logs for a specific inventory item
 *     tags: [Inventory Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: inventoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Inventory item ID
 *       - in: query
 *         name: actionType
 *         schema:
 *           type: string
 *         description: Filter logs by action type
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *         description: Filter logs from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *         description: Filter logs until this date
 *     responses:
 *       200:
 *         description: Inventory logs for item fetched successfully
 */
router.get("/:inventoryId", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
  const responseBuilder = new responseBuild(res);

  getLogsByItem(req.params.inventoryId, req.query)
    .then((result) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse(result);
    })
    .catch(next);
});

module.exports = router;