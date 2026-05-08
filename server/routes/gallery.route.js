const router = require("express").Router();
const {
  createGalleryImage,
  getAllGalleryImages,
  deleteGalleryImage,
} = require("../controller/gallery.controller");
const { authTokenMiddleware, accessControl } = require("../middleware/auth");
const { USER_ROLES } = require("../util/constants");
const responseBuild = require("../util/responseBuilder");

/**
 * @swagger
 * tags:
 *   name: Gallery
 *   description: API for managing gallery images and metadata
 */

/**
 * @swagger
 * /api/v1/gallery:
 *   post:
 *     tags: [Gallery]
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new gallery item
 *     description: |
 *       Create a gallery record with title, description, and a reference to an uploaded file.
 *       **Admin access only.**
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title for the gallery image
 *                 example: "New Service Center Opening"
 *               description:
 *                 type: string
 *                 description: Detailed description of the image
 *                 example: "A photo of our new state-of-the-art facility in Colombo."
 *               image:
 *                 type: string
 *                 description: MongoDB ObjectId of the uploaded file
 *                 example: 652f1c3f0a1b2c3d4e5f6789
 *     responses:
 *       201:
 *         description: Gallery item created successfully
 *       400:
 *         description: Bad Request - Missing image ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.post(
  "/",
  authTokenMiddleware,
  accessControl([USER_ROLES.ADMIN]),
  (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    createGalleryImage(req.body)
      .then((data) => {
        responseBuilder.setStatus(201);
        responseBuilder.buildResponse(data);
      })
      .catch((error) => next(error));
  }
);

/**
 * @swagger
 * /api/v1/gallery:
 *   get:
 *     tags: [Gallery]
 *     summary: Get all gallery images
 *     description: Retrieve a list of all active gallery images with populated file details.
 *     responses:
 *       200:
 *         description: List of gallery items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   image:
 *                     type: object
 *                     properties:
 *                       filePath:
 *                         type: string
 *                       fileName:
 *                         type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 */
router.get("/", (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  getAllGalleryImages(req.query)
    .then((data) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse(data);
    })
    .catch((error) => next(error));
});

/**
 * @swagger
 * /api/v1/gallery/delete-multiple:
 *   delete:
 *     tags: [Gallery]
 *     security:
 *       - bearerAuth: []
 *     summary: Delete multiple gallery items
 *     description: |
 *       Delete multiple gallery records and their associated physical files.
 *       **Admin access only.**
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Images deleted successfully
 */
router.delete(
  "/delete-multiple",
  authTokenMiddleware,
  accessControl([USER_ROLES.ADMIN]),
  (req, res, next) => {
    const { deleteMultipleGalleryImages } = require("../controller/gallery.controller");
    const responseBuilder = new responseBuild(res);
    deleteMultipleGalleryImages(req.body)
      .then((data) => {
        responseBuilder.setStatus(200);
        responseBuilder.buildResponse(data);
      })
      .catch((error) => next(error));
  }
);

/**
 * @swagger
 * /api/v1/gallery/{id}:
 *   delete:
 *     tags: [Gallery]
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a gallery item
 *     description: |
 *       Permanently delete a gallery record and its associated physical file from storage.
 *       **Admin access only.**
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Gallery record ID
 *     responses:
 *       200:
 *         description: Gallery item deleted successfully
 *       404:
 *         description: Gallery item not found
 */
router.delete(
  "/:id",
  authTokenMiddleware,
  accessControl([USER_ROLES.ADMIN]),
  (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    deleteGalleryImage(req.params.id)
      .then((data) => {
        responseBuilder.setStatus(200);
        responseBuilder.buildResponse(data);
      })
      .catch((error) => next(error));
  }
);

module.exports = router;
