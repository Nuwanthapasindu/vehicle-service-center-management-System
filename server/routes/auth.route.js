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
const {
  register,
  login,
  accountVerification,
  authenticatedUser,
  refreshToken,
  resendAccountVerification,
  forgotPassword,
  resetPassword,
} = require("../controller/auth.controller");
const { authTokenMiddleware } = require("../middleware/auth");
const responseBuild = require("../util/responseBuilder");

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - mobile
 *               - address
 *               - userName
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               mobile:
 *                 type: string
 *               address:
 *                 type: string
 *               userName:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User registration successful
 *       400:
 *         description: Bad request
 */
router.post("/register", (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const payload = req.body;

  register(payload)
    .then((message) => {
      responseBuilder.setStatus(201);
      responseBuilder.buildResponse({ message });
    })
    .catch((error) => next(error));
});

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Invalid username or password
 *       401:
 *         description: Account not verified
 */
router.post("/login", (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const payload = req.body;

  login(payload)
    .then((tokens) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse(tokens);
    })
    .catch((error) => next(error));
});

/**
 * @swagger
 * /api/v1/auth/verification:
 *   post:
 *     summary: Verify user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account verified
 *       400:
 *         description: Invalid OTP
 */
router.post("/verification", (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const payload = req.body;
  accountVerification(payload)
    .then((message) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({ message });
    })
    .catch((error) => next(error));
});

/**
 * @swagger
 * /api/v1/auth/verification/resend:
 *   post:
 *     summary: Resend account verification OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobile
 *             properties:
 *               mobile:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP resent
 *       400:
 *         description: User not found or account already verified
 */
router.post("/verification/resend", (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const payload = req.body;
  responseBuilder.setStatus(200);
  resendAccountVerification(payload)
    .then((message) => responseBuilder.buildResponse({ message }))
    .catch((e) => next(e));
});
/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get authenticated user information
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user information
 *       401:
 *         description: Unauthorized
 */
router.get("/me", authTokenMiddleware, (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const authUser = req?.user || null;
  authenticatedUser(authUser)
    .then((user) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({ authenticatedUser: user });
    })
    .catch((e) => next(e));
});

/**
 * @swagger
 * /api/v1/auth/token-refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       400:
 *         description: Invalid refresh token
 */
router.post("/token-refresh", (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const payload = req.body;
  const refreshTokenData = payload.refreshToken || null;
  responseBuilder.setStatus(200);
  refreshToken(refreshTokenData)
    .then((accessToken) => responseBuilder.buildResponse({ accessToken }))
    .catch((e) => next(e));
});

/**
 * @swagger
 * /api/v1/auth/forgotPassword:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobile
 *             properties:
 *               mobile:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset link sent
 *       400:
 *         description: User not found
 */
router.post("/forgotPassword", (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const payload = req.body;
  responseBuilder.setStatus(200);
  forgotPassword(payload)
    .then((message) =>
      responseBuilder.buildResponse({
        message,
      }),
    )
    .catch((e) => next(e));
});

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   put:
 *     summary: Reset user password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *               - password
 *             properties:
 *               otp:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid token
 */
router.put("/reset-password", (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const payload = req.body;
  responseBuilder.setStatus(200);
  resetPassword(payload)
    .then((message) => responseBuilder.buildResponse({ message }))
    .catch((e) => next(e));
});

module.exports = router;
