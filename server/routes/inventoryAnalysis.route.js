/**
 * @swagger
 * tags:
 *   name: Inventory Analysis
 *   description: Inventory analytics and reporting APIs
 */

const router = require("express").Router();
const {
  getInventoryStats,
  getCategoryBreakdown,
  getStockMovement,
} = require("../controller/inventoryAnalysis.controller");

const { authTokenMiddleware, accessControl } = require("../middleware/auth");
const { USER_ROLES } = require("../util/constants");
const responseBuild = require("../util/responseBuilder");

/**
 * @swagger
 * /api/v1/inventory-analysis/stats:
 *   get:
 *     summary: Get inventory summary statistics
 *     tags: [Inventory Analysis]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inventory statistics fetched successfully
 */
router.get("/stats", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
  const responseBuilder = new responseBuild(res);

  getInventoryStats()
    .then((result) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({
        data: result,
      });
    })
    .catch(next);
});

/**
 * @swagger
 * /api/v1/inventory-analysis/category-breakdown:
 *   get:
 *     summary: Get inventory category-wise breakdown
 *     tags: [Inventory Analysis]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category breakdown fetched successfully
 */
router.get("/category-breakdown", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
  const responseBuilder = new responseBuild(res);

  getCategoryBreakdown()
    .then((result) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({
        data: result,
      });
    })
    .catch(next);
});

/**
 * @swagger
 * /api/v1/inventory-analysis/movement:
 *   get:
 *     summary: Get stock movement history
 *     tags: [Inventory Analysis]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stock movement data fetched successfully
 */
router.get("/movement", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const { query } = req;

  getStockMovement(query)
    .then((result) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({
        data: result,
      });
    })
    .catch(next);
});

module.exports = router;