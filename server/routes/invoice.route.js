const router = require("express").Router();
const { createInvoice } = require("../controller/invoice.controller");
const responseBuilder = require("../util/responseBuilder");
const { authTokenMiddleware } = require("../middleware/auth");

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
router.post("/", (req, res, next) => {
  const builder = new responseBuilder(res);
  createInvoice(req.body)
    .then((message) => {
      builder.setStatus(201);
      builder.buildResponse({ message });
    })
    .catch(next);
});

module.exports = router;
