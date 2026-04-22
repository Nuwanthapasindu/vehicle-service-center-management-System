/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category management APIs
 */

const router = require("express").Router();
const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require("../controller/category.controller");

const { authTokenMiddleware, accessControl } = require("../middleware/auth");
const { USER_ROLES } = require("../util/constants");
const responseBuild = require("../util/responseBuilder");

/**
 * @swagger
 * /api/v1/category:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Categories fetched successfully
 */
router.get("/", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
  const responseBuilder = new responseBuild(res);

  getAllCategories()
    .then((categories) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({
        data: categories,
      });
    })
    .catch((error) => next(error));
});

/**
 * @swagger
 * /api/v1/category:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Engine Parts
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation error
 */
router.post("/", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const payload = req.body;

  createCategory(payload)
    .then((message) => {
      responseBuilder.setStatus(201);
      responseBuilder.buildResponse({
        message,
      });
    })
    .catch((error) => next(error));
});

/**
 * @swagger
 * /api/v1/category/{id}:
 *   patch:
 *     summary: Update a category
 *     tags: [Category]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Category Name
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 */
router.patch("/:id", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
  const responseBuilder = new responseBuild(res);

  updateCategory(req.params.id, req.body)
    .then((message) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({
        message,
      });
    })
    .catch((error) => next(error));
});

/**
 * @swagger
 * /api/v1/category/{id}:
 *   delete:
 *     summary: Delete a category (soft delete)
 *     tags: [Category]
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
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
router.delete("/:id", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
  const responseBuilder = new responseBuild(res);

  deleteCategory(req.params.id)
    .then((message) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({
        message
      });
    })
    .catch((error) => next(error));
});

module.exports = router;