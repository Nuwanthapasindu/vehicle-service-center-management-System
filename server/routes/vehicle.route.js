const router = require("express").Router();
const vehicleController = require("../controller/vehicle.controller");
const { authTokenMiddleware } = require("../middleware/auth");

router.post("/", authTokenMiddleware, vehicleController.createVehicle);
router.get("/", authTokenMiddleware, vehicleController.getMyVehicles);
router.delete("/:id", authTokenMiddleware, vehicleController.deleteVehicle);

module.exports = router;
