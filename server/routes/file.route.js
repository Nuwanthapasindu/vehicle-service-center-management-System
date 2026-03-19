/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
const router = require("express").Router();
const { fileUploader } = require("../middleware/filUploader");
const { authTokenMiddleware } = require("../middleware/auth");
const responseBuild = require("../util/responseBuilder");
const { singleFileUpload, multipleFileUpload, getFileById, deleteFileById } = require("../controller/file.controller");

/**
 * @swagger
 * /api/v1/file:
 *   post:
 *     tags: [File]
 *     security:
 *       - bearerAuth: []
 *     summary: Upload a file
 *     description: |
 *       Upload a single file (image or PDF) for supplier payment slips or other documents.
 *       
 *       **Accepted file types:**
 *       - Images: .png, .jpg, .jpeg
 *       - Documents: .pdf
 *       
 *       **File size limit:** 10 MB
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload (PNG, JPG, JPEG, or PDF)
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 file:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: File ID in database
 *                       example: 652f1c3f0a1b2c3d4e5f6789
 *                     originalName:
 *                       type: string
 *                       description: Original filename
 *                       example: payment_slip.pdf
 *                     fileName:
 *                       type: string
 *                       description: Stored filename on server
 *                       example: 1704123456789-123456789.pdf
 *                     fileUrl:
 *                       type: string
 *                       description: URL to access the file
 *                       example: /uploads/1704123456789-123456789.pdf
 *                     fileType:
 *                       type: string
 *                       description: MIME type of the file
 *                       example: application/pdf
 *                     fileSize:
 *                       type: integer
 *                       description: File size in bytes
 *                       example: 245678
 *                     uploadedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Upload timestamp
 *                       example: 2024-01-15T10:30:00.000Z
 *       400:
 *         description: Bad Request - No file uploaded or invalid file type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 payload:
 *                   type: object
 *                   properties:
 *                     statusCode:
 *                       type: integer
 *                       example: 400
 *                     status:
 *                       type: string
 *                       example: Bad Request
 *                     message:
 *                       type: string
 *                       examples:
 *                         - No file uploaded.
 *                         - Only .png, .jpg, .jpeg and .pdf format allowed!
 *                         - File too large. Maximum size is 10 MB.
 *       401:
 *         description: Unauthorized - Missing or invalid JWT token
 *       500:
 *         description: Internal Server Error
 */
router.post("/", authTokenMiddleware, fileUploader.single("file"), async (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    try {
        const fileData = await singleFileUpload(req.file);
        responseBuilder.setStatus(201);
        responseBuilder.buildResponse({ file: fileData });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/v1/file/multiple:
 *   post:
 *     tags: [File]
 *     security:
 *       - bearerAuth: []
 *     summary: Upload multiple files
 *     description: |
 *       Upload multiple files (images or PDFs) for supplier payment slips or other documents.
 *       
 *       **Accepted file types:**
 *       - Images: .png, .jpg, .jpeg
 *       - Documents: .pdf
 *       
 *       **File size limit:** 10 MB per file
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - files
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Files to upload (PNG, JPG, JPEG, or PDF)
 *     responses:
 *       201:
 *         description: Files uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 files:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: File ID in database
 *                         example: 652f1c3f0a1b2c3d4e5f6789
 *                       originalName:
 *                         type: string
 *                         description: Original filename
 *                         example: payment_slip.pdf
 *                       fileName:
 *                         type: string
 *                         description: Stored filename on server
 *                         example: 1704123456789-123456789.pdf
 *                       fileUrl:
 *                         type: string
 *                         description: URL to access the file
 *                         example: /uploads/1704123456789-123456789.pdf
 *                       fileType:
 *                         type: string
 *                         description: MIME type of the file
 *                         example: application/pdf
 *                       fileSize:
 *                         type: integer
 *                         description: File size in bytes
 *                         example: 245678
 *                       uploadedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Upload timestamp
 *                         example: 2024-01-15T10:30:00.000Z
 *       400:
 *         description: Bad Request - No files uploaded or invalid file type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 payload:
 *                   type: object
 *                   properties:
 *                     statusCode:
 *                       type: integer
 *                       example: 400
 *                     status:
 *                       type: string
 *                       example: Bad Request
 *                     message:
 *                       type: string
 *                       examples:
 *                         - No files uploaded.
 *                         - Only .png, .jpg, .jpeg and .pdf format allowed!
 *                         - File too large. Maximum size is 10 MB.
 *       401:
 *         description: Unauthorized - Missing or invalid JWT token
 *       500:
 *         description: Internal Server Error
 */
router.post("/multiple", authTokenMiddleware, fileUploader.array("files", 10), async (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    try {
        const filesData = await multipleFileUpload(req.files);
        responseBuilder.setStatus(201);
        responseBuilder.buildResponse({ files: filesData });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/v1/file/{id}:
 *   get:
 *     tags: [File]
 *     security:
 *       - bearerAuth: []
 *     summary: Get file metadata by ID
 *     description: Retrieve file metadata including URL to access the uploaded file
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: File's MongoDB ObjectId
 *         example: 652f1c3f0a1b2c3d4e5f6789
 *     responses:
 *       200:
 *         description: File metadata retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 file:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 652f1c3f0a1b2c3d4e5f6789
 *                     originalName:
 *                       type: string
 *                       example: payment_slip.pdf
 *                     fileName:
 *                       type: string
 *                       example: 1704123456789-123456789.pdf
 *                     fileUrl:
 *                       type: string
 *                       example: /uploads/1704123456789-123456789.pdf
 *                     fileType:
 *                       type: string
 *                       example: application/pdf
 *                     fileSize:
 *                       type: integer
 *                       example: 245678
 *                     uploadedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-15T10:30:00.000Z
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: File not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", authTokenMiddleware, async (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    try {
        const fileData = await getFileById(req.params.id);
        responseBuilder.setStatus(200);
        responseBuilder.buildResponse({ file: fileData });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/v1/file/{id}:
 *   delete:
 *     tags: [File]
 *     security:
 *       - bearerAuth: []
 *     summary: Delete file by ID
 *     description: |
 *       Delete a file from both the database and storage.
 *       
 *       **Warning:** This operation is permanent and cannot be undone.
 *       The file metadata will be removed from the database and the physical file will be deleted from storage.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         description: File's MongoDB ObjectId (24 character hex string)
 *         example: 652f1c3f0a1b2c3d4e5f6789
 *     responses:
 *       200:
 *         description: File deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File deleted successfully.
 *       400:
 *         description: Bad Request - Invalid file ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 payload:
 *                   type: object
 *                   properties:
 *                     statusCode:
 *                       type: integer
 *                       example: 400
 *                     status:
 *                       type: string
 *                       example: Bad Request
 *                     message:
 *                       type: string
 *                       example: Invalid file ID format.
 *       401:
 *         description: Unauthorized - Missing or invalid JWT token
 *       404:
 *         description: File not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 payload:
 *                   type: object
 *                   properties:
 *                     statusCode:
 *                       type: integer
 *                       example: 404
 *                     status:
 *                       type: string
 *                       example: Not Found
 *                     message:
 *                       type: string
 *                       example: File not found.
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:id", authTokenMiddleware, async (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    try {
        const message = await deleteFileById(req.params.id);
        responseBuilder.setStatus(200);
        responseBuilder.buildResponse({ message });
    } catch (error) {
        next(error);
    }
});

module.exports = router;