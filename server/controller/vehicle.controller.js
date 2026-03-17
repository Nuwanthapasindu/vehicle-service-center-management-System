const Vehicle = require("../model/Vehicle");
const AppError = require("../error/AppError");
const { validateCreateVehicle } = require("../validation/vehicle.validation");

module.exports.createVehicle = async (req, res, next) => {
  try {
    const payload = req.body;
    const { error } = validateCreateVehicle(payload);
    if (error) throw new AppError(error.details[0].message, 400);

    // Check if license plate already exists
    const existingVehicle = await Vehicle.findOne({
      licensePlate: payload.licensePlate,
    });
    if (existingVehicle) {
      throw new AppError("Vehicle with this license plate already exists", 400);
    }

    const newVehicle = new Vehicle({
      ownerId: req.user._id,
      licensePlate: payload.licensePlate,
      type: payload.type,
      make: payload.make,
      model: payload.model,
      image: payload.image || undefined,
    });

    const savedVehicle = await newVehicle.save();

    return res.status(201).json({
      status: 201,
      payload: { vehicle: savedVehicle },
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getMyVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ ownerId: req.user._id, isDeleted: false })
      .populate("image")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: 200,
      payload: { vehicles },
    });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findOne({ _id: id, ownerId: req.user._id, isDeleted: false });
    if (!vehicle) throw new AppError("Vehicle not found", 404);
    
    vehicle.isDeleted = true;
    vehicle.deletedAt = new Date();
    await vehicle.save();

    return res.status(200).json({
      status: 200,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
