const router = require("express").Router();
const { addVehicle, getMyVehicles, deleteVehicle, getVehicleById, updateVehicle } = require("../controller/vehicle.controller");
const { authTokenMiddleware } = require("../middleware/auth");
const responseBuild = require("../util/responseBuilder");

/**
 * @swagger
 * /api/v1/vehicle/add:
 *   post:
 *     summary: Add a vehicle
 *     tags: [Vehicle]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               make:
 *                 type: string
 *               model:
 *                 type: string
 *               year:
 *                 type: number
 *               licensePlate:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vehicle added successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/add", authTokenMiddleware, (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const payload = req.body;
  const mobile = req.user.mobile;

  addVehicle(payload, mobile)
    .then((vehicle) => {
      responseBuilder.setStatus(201);
      responseBuilder.buildResponse({ message: "Vehicle added successfully", vehicle });
    })
    .catch((error) => next(error));
});

/**
 * @swagger
 * /api/v1/vehicle/my-vehicles:
 *   get:
 *     summary: Get user's vehicles
 *     tags: [Vehicle]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vehicles retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/my-vehicles", authTokenMiddleware, (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const mobile = req.user.mobile;

  getMyVehicles(mobile)
    .then((vehicles) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({ vehicles });
    })
    .catch((error) => next(error));
});

/**
 * @swagger
 * /api/v1/vehicle/{id}:
 *   get:
 *     summary: Get a vehicle by ID
 *     tags: [Vehicle]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", authTokenMiddleware, (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const mobile = req.user.mobile;
  const vehicleId = req.params.id;

  getVehicleById(vehicleId, mobile)
    .then((vehicle) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({ vehicle });
    })
    .catch((error) => next(error));
});

/**
 * @swagger
 * /api/v1/vehicle/{id}:
 *   delete:
 *     summary: Delete a vehicle
 *     tags: [Vehicle]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", authTokenMiddleware, (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const mobile = req.user.mobile;
  const vehicleId = req.params.id;

  deleteVehicle(vehicleId, mobile)
    .then((message) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({ message });
    })
    .catch((error) => next(error));
});

/**
 * @swagger
 * /api/v1/vehicle/{id}:
 *   put:
 *     summary: Update a vehicle
 *     tags: [Vehicle]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               make:
 *                 type: string
 *               model:
 *                 type: string
 *               year:
 *                 type: number
 *               licensePlate:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", authTokenMiddleware, (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const mobile = req.user.mobile;
  const vehicleId = req.params.id;
  const payload = req.body;

  updateVehicle(vehicleId, mobile, payload)
    .then((result) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({ message: "Vehicle updated successfully", vehicle: result });
    })
    .catch((error) => next(error));
});

module.exports = router;
