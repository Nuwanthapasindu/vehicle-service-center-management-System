const router = require('express').Router();
const responseBuild = require('../util/responseBuilder');
const { authTokenMiddleware, accessControl } = require('../middleware/auth');
const { fetchSmsAccountStatus, createSmsCampaign, getSmsCampaigns } = require('../controller/smsNotification.controller');
const { USER_ROLES } = require('../util/constants');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the message
 *           example: "605c4354f102c30015d9b234"
 *         branch:
 *           type: string
 *           description: Branch ID
 *           example: "605c4354f102c30015d9b235"
 *         to:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of customer IDs
 *           example: ["605c4354f102c30015d9b236", "605c4354f102c30015d9b237"]
 *         group:
 *           type: string
 *           description: Group ID
 *           example: "605c4354f102c30015d9b238"
 *         message:
 *           type: string
 *           description: SMS message content
 *           example: "Hello, this is a test message"
 *         characterCount:
 *           type: number
 *           description: Character count of the message
 *           example: 25
 *         type:
 *           type: string
 *           description: Message type (INSTANT or SCHEDULE)
 *           example: "INSTANT"
 *         scheduleTime:
 *           type: string
 *           format: date-time
 *           description: Scheduled time for sending the message
 *           example: "2023-03-25T10:30:00.000Z"
 *         sendBy:
 *           type: string
 *           description: User ID who sent the message
 *           example: "605c4354f102c30015d9b240"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *           example: "2023-03-25T10:30:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *           example: "2023-03-25T10:30:00.000Z"
 *     MessageListResponse:
 *       type: object
 *       properties:
 *         totalMessages:
 *           type: integer
 *           example: 50
 *         searchResultCount:
 *           type: integer
 *           example: 10
 *         totalPages:
 *           type: integer
 *           example: 5
 *         currentPage:
 *           type: integer
 *           example: 1
 *         messages:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Message'
 *     MessageResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "605c4354f102c30015d9b234"
 *         branch:
 *           type: string
 *           example: "605c4354f102c30015d9b235"
 *         to:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               name:
 *                 type: string
 *               mobileNumber:
 *                 type: string
 *         group:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *         message:
 *           type: string
 *           example: "Hello, this is a test message"
 *         characterCount:
 *           type: number
 *           example: 25
 *         type:
 *           type: string
 *           example: "INSTANT"
 *         scheduleTime:
 *           type: string
 *           format: date-time
 *           example: "2023-03-25T10:30:00.000Z"
 *         sendBy:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-03-25T10:30:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2023-03-25T10:30:00.000Z"
 *     AccountStatusResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Account status retrieved successfully"
 *         data:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: "active"
 *             sms_credit_balance:
 *               type: string
 *               example: "1,002.92"
 *             active_plan:
 *               type: string
 *               example: "Pay As You Go On Demand Pack"
 *             total_contacts:
 *               type: string
 *               example: "3"
 *             total_sender_ids:
 *               type: string
 *               example: "2"
 */

/**
 * @swagger
 * /api/v1/sms/account:
 *   get:
 *     summary: Fetch SMS account status
 *     tags: [SMS]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: SMS account status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 payload:
 *                   $ref: '#/components/schemas/AccountStatusResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/account', authTokenMiddleware,accessControl([USER_ROLES.ADMIN]) ,(req, res, next) => {
    const responseBuilder = new responseBuild(res);
    fetchSmsAccountStatus().then(data => {
        responseBuilder.setStatus(200);
        responseBuilder.buildResponse(data);
    }).catch(error => {
        next(error);
    })
});

/**
 * @swagger
 * /api/v1/sms/campaigns:
 *   post:
 *     summary: Create and send a new SMS campaign to all customers
 *     tags: [SMS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - message
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Center Closed Today"
 *               message:
 *                 type: string
 *                 example: "Dear customer, we are closed today due to weather conditions."
 *               campaignType:
 *                 type: string
 *                 enum: [PROMOTIONAL, TRANSACTIONAL]
 *                 example: "TRANSACTIONAL"
 *     responses:
 *       200:
 *         description: Campaign sent successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No active customers found
 *       500:
 *         description: Internal Server Error
 * 
 *   get:
 *     summary: Fetch history of all SMS campaigns
 *     tags: [SMS]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: History of campaigns retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post('/campaigns', authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    createSmsCampaign(req.body, req.user.mobile).then(data => {
        responseBuilder.setStatus(200);
        responseBuilder.buildResponse(data);
    }).catch(error => {
        next(error);
    });
});

router.get('/campaigns', authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    const { page, limit } = req.query;
    getSmsCampaigns(page, limit).then(data => {
        responseBuilder.setStatus(200);
        responseBuilder.buildResponse(data);
    }).catch(error => {
        next(error);
    });
});

module.exports = router;