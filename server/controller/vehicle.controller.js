const Vehicle = require("../model/Vehicle");
const User = require("../model/User");
const AppError = require("../error/AppError");
const { validatedVehicleAdd } = require("../validation/vehicle.validation");

module.exports.addVehicle = async (payload, mobile) => {
  const { error } = validatedVehicleAdd(payload);
  if (error) throw new AppError(error.details[0].message, 400);

  const owner = await User.findOne({ mobile });
  if (!owner) throw new AppError("Owner not found", 404);

  // Check if license plate exists
  const existingVehicle = await Vehicle.findOne({ licensePlate: payload.licensePlate, isDeleted: false });
  if (existingVehicle) throw new AppError("License plate already registered", 400);

  const newVehicle = new Vehicle({
    ownerId: owner._id,
    licensePlate: payload.licensePlate,
    type: payload.type,
    make: payload.make,
    model: payload.model,
    ...(payload.image && { image: payload.image })
  });

  const savedVehicle = await newVehicle.save();
  return savedVehicle;
};

module.exports.getMyVehicles = async (mobile) => {
  const owner = await User.findOne({ mobile });
  if (!owner) throw new AppError("Owner not found", 404);

  const vehicles = await Vehicle.find({ ownerId: owner._id, isDeleted: false })
    .populate("image")
    .sort({ createdAt: -1 });

  return vehicles;
};

module.exports.deleteVehicle = async (vehicleId, mobile) => {
  const owner = await User.findOne({ mobile });
  if (!owner) throw new AppError("Owner not found", 404);

  const vehicle = await Vehicle.findOne({ _id: vehicleId, ownerId: owner._id, isDeleted: false });
  if (!vehicle) throw new AppError("Vehicle not found", 404);

  vehicle.isDeleted = true;
  vehicle.deletedAt = new Date();

  await vehicle.save();
  return "Vehicle deleted successfully";
};

module.exports.getVehicleById = async (vehicleId, mobile) => {
  const owner = await User.findOne({ mobile });
  if (!owner) throw new AppError("Owner not found", 404);

  const vehicle = await Vehicle.findOne({ _id: vehicleId, ownerId: owner._id, isDeleted: false }).populate("image");
  if (!vehicle) throw new AppError("Vehicle not found", 404);

  return vehicle;
};

module.exports.updateVehicle = async (vehicleId, mobile, payload) => {
  const { validatedVehicleUpdate } = require("../validation/vehicle.validation");
  const { error } = validatedVehicleUpdate(payload);
  if (error) throw new AppError(error.details[0].message, 400);

  const owner = await User.findOne({ mobile });
  if (!owner) throw new AppError("Owner not found", 404);

  const vehicle = await Vehicle.findOne({ _id: vehicleId, ownerId: owner._id, isDeleted: false });
  if (!vehicle) throw new AppError("Vehicle not found", 404);

  if (payload.licensePlate && payload.licensePlate !== vehicle.licensePlate) {
    const existingVehicle = await Vehicle.findOne({ licensePlate: payload.licensePlate, isDeleted: false });
    if (existingVehicle) {
      throw new AppError("A vehicle with this license plate already exists", 400);
    }
  }

  const updatedVehicle = await Vehicle.findByIdAndUpdate(vehicleId, payload, { new: true }).populate("image");
  return updatedVehicle;
};
