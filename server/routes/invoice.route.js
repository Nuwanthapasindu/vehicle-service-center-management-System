const router = require("express").Router();
const {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  addInvoiceItem,
  removeInvoiceItem,
  completeInvoice,
  getInvoiceByJobCard,
} = require("../controller/invoice.controller");
const { getIncomeReport } = require("../controller/report.controller");
const { authTokenMiddleware, accessControl } = require("../middleware/auth");
const { USER_ROLES } = require("../util/constants");
const responseBuilder = require("../util/responseBuilder");

/**
 * @swagger
 * /api/v1/invoice:
 *   post:
 *     summary: Create a new invoice
 *     tags: [Invoice]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer
 *             properties:
 *               jobCard:
 *                 type: string
 *                 description: Valid ObjectId string for the associated JobCard
 *               customer:
 *                 type: string
 *                 description: Valid ObjectId string for the Customer
 *               selectedPackage:
 *                 type: object
 *                 properties:
 *                   package:
 *                     type: string
 *                     description: Valid ObjectId for the Package
 *                   selectedPackageTier:
 *                     type: object
 *                     required:
 *                       - name
 *                       - price
 *                     properties:
 *                       name:
 *                         type: string
 *                       price:
 *                         type: number
 *               additionalItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - item
 *                     - qty
 *                     - sellingPrice
 *                   properties:
 *                     item:
 *                       type: string
 *                     qty:
 *                       type: integer
 *                     sellingPrice:
 *                       type: number
 *               additionalServices:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - service
 *                     - charge
 *                   properties:
 *                     service:
 *                       type: string
 *                     charge:
 *                       type: number
 *               isCompleted:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Invoice created successfully
 *       400:
 *         description: Bad request (Validation failed)
 *       404:
 *         description: Referenced entities (JobCard or Customer) not found
 *       409:
 *         description: Conflict (Invoice already exists for this JobCard)
 *       500:
 *         description: Internal server error
 */
router.post("/", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
  const builder = new responseBuilder(res);
  createInvoice(req.body)
    .then((invoice) => {
      builder.setStatus(201);
      builder.buildResponse(invoice);
    })
    .catch(next);
});

/**
 * @swagger
 * /api/v1/invoice:
 *   get:
 *     summary: Get all invoices
 *     tags: [Invoice]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isCompleted
 *         schema:
 *           type: boolean
 *         description: Filter invoices by their completion status
 *     responses:
 *       200:
 *         description: Successfully retrieved invoices
 *       500:
 *         description: Internal server error
 */
router.get("/", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
  const builder = new responseBuilder(res);
  getAllInvoices(req.query)
    .then((invoices) => {
      builder.setStatus(200);
      builder.buildResponse({ invoices });
    })
    .catch(next);
});

/**
 * @swagger
 * /api/v1/invoice/reports/income:
 *   get:
 *     summary: Get invoice income report
 *     tags: [Invoice]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: range
 *         schema:
 *           type: string
 *           enum: [today, weekly, monthly, yearly, custom]
 *         description: Reporting time range
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *         description: Required if range is custom
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *         description: Required if range is custom
 *     responses:
 *       200:
 *         description: Successfully retrieved income report
 *       500:
 *         description: Internal server error
 */
router.get("/reports/income", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
  const builder = new responseBuilder(res);
  const { range, startDate, endDate } = req.query;
  getIncomeReport(range, startDate, endDate)
    .then((report) => {
      builder.setStatus(200);
      builder.buildResponse({ report });
    })
    .catch(next);
});

/**
 * @swagger
 * /api/v1/invoice/{id}:
 *   get:
 *     summary: Get invoice by ID
 *     tags: [Invoice]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The invoice ID
 *     responses:
 *       200:
 *         description: Successful retrieval
 *       400:
 *         description: Invalid invoice ID
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
  const builder = new responseBuilder(res);
  getInvoiceById(req.params.id)
    .then((invoice) => {
      builder.setStatus(200);
      builder.buildResponse({ invoice });
    })
    .catch(next);
});

/**
 * @swagger
 * /api/v1/invoice/{id}/items/add:
 *   post:
 *     summary: Add an item or service to an invoice
 *     tags: [Invoice]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The invoice ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - data
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [ITEM, SERVICE]
 *               data:
 *                 type: object
 *                 description: Provide item/qty/sellingPrice if type is ITEM, or service/charge if type is SERVICE
 *     responses:
 *       200:
 *         description: Successfully added item
 *       400:
 *         description: Invalid request payload or invoice ID
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id/items/add", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
  const builder = new responseBuilder(res);
  addInvoiceItem(req.params.id, req.body)
    .then((message) => {
      builder.setStatus(200);
      builder.buildResponse({ message });
    })
    .catch(next);
});

/**
 * @swagger
 * /api/v1/invoice/{id}/items/remove:
 *   delete:
 *     summary: Remove an item or service from an invoice
 *     tags: [Invoice]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The invoice ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - targetId
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [ITEM, SERVICE]
 *               targetId:
 *                 type: string
 *                 description: Valid ObjectId of the item or service to remove
 *     responses:
 *       200:
 *         description: Successfully removed item
 *       400:
 *         description: Invalid request payload or invoice ID
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id/items/remove", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
  const builder = new responseBuilder(res);
  removeInvoiceItem(req.params.id, req.body)
    .then((message) => {
      builder.setStatus(200);
      builder.buildResponse({ message });
    })
    .catch(next);
});

/**
 * @swagger
 * /api/v1/invoice/{id}/complete:
 *   patch:
 *     summary: Complete an invoice and dynamically adjust inventory stock balances automatically.
 *     tags: [Invoice]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The invoice ID
 *     responses:
 *       200:
 *         description: Successfully completed the invoice.
 *       400:
 *         description: Invalid request or the invoice is already completed.
 *       404:
 *         description: Invoice not found.
 *       500:
 *         description: Internal server error or rollback triggered.
 */
router.patch("/:id/complete", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
  const builder = new responseBuilder(res);
  completeInvoice(req.params.id, req.user)
    .then((message) => {
      builder.setStatus(200);
      builder.buildResponse({ message });
    })
    .catch(next);
});

/**
 * @swagger
 * /api/v1/invoice/jobcard/{jobCardId}:
 *   get:
 *     summary: Retrieve attached Invoice for a specific JobCard
 *     tags: [Invoice]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobCardId
 *         required: true
 *         schema:
 *           type: string
 *         description: JobCard Object ID mapping
 *     responses:
 *       200:
 *         description: Responds uniquely with requested Job Card Invoice Object
 *       404:
 *         description: Invoice Not Found (Not automatically generated)
 */
router.get("/jobcard/:jobCardId", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
  const rs = new responseBuilder(res);
  getInvoiceByJobCard(req.params.jobCardId)
    .then((data) => {
      rs.setStatus(200);
      rs.buildResponse({ data });
    })
    .catch((error) => next(error));
});

module.exports = router;
