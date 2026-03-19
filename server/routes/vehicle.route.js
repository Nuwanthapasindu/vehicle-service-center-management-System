const router = require("express").Router();
const { addVehicle, getMyVehicles, deleteVehicle, getVehicleById, updateVehicle } = require("../controller/vehicle.controller");
const { authTokenMiddleware } = require("../middleware/auth");
const { validatedVehicleAdd, validatedVehicleUpdate } = require("../validation/vehicle.validation");
const responseBuild = require("../util/responseBuilder");

router.post("/add", authTokenMiddleware, validatedVehicleAdd, (req, res, next) => {
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

router.put("/:id", authTokenMiddleware, validatedVehicleUpdate, (req, res, next) => {
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
