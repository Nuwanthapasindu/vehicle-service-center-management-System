const Vehicle = require("../model/Vehicle");
const User = require("../model/User");
const File = require("../model/File");
const AppError = require("../error/AppError");
const { validatedVehicleAdd } = require("../validation/vehicle.validation");

module.exports.addVehicle = async (payload, mobile) => {
  try {
    const { error } = validatedVehicleAdd(payload);
    if (error) throw new AppError(error.details[0].message, 400);

    const owner = await User.findOne({ mobile, isDeleted: false });
    if (!owner) throw new AppError("Owner not found", 404);

    // Check if license plate exists
    const existingVehicle = await Vehicle.findOne({ licensePlate: payload.licensePlate, isDeleted: false });
    if (existingVehicle) throw new AppError("License plate already registered", 400);

    // Verify image if provided
    if (payload.image) {
      const fileExists = await File.findById(payload.image);
      if (!fileExists) throw new AppError("Image file not found", 404);
    }

    const newVehicle = new Vehicle({
      ownerId: owner._id,
      licensePlate: payload.licensePlate,
      type: payload.type,
      make: payload.make,
      model: payload.model,
      year: payload.year,
      ...(payload.image && { image: payload.image })
    });

    await newVehicle.save();
    return "Vehicle added successfully";
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Failed to add vehicle", error.statusCode || 500);
  }
};

module.exports.getMyVehicles = async (mobile) => {
  try {
    const owner = await User.findOne({ mobile, isDeleted: false });
    if (!owner) throw new AppError("Owner not found", 404);

    const vehicles = await Vehicle.find({ ownerId: owner._id, isDeleted: false })
      .populate("image")
      .sort({ createdAt: -1 });

    return vehicles;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Failed to fetch vehicles", error.statusCode || 500);
  }
};

module.exports.deleteVehicle = async (vehicleId, mobile) => {
  try {
    const owner = await User.findOne({ mobile, isDeleted: false });
    if (!owner) throw new AppError("Owner not found", 404);

    const vehicle = await Vehicle.findOne({ _id: vehicleId, ownerId: owner._id, isDeleted: false });
    if (!vehicle) throw new AppError("Vehicle not found", 404);

    vehicle.isDeleted = true;
    vehicle.deletedAt = new Date();

    await vehicle.save();
    return "Vehicle deleted successfully";
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Failed to delete vehicle", error.statusCode || 500);
  }
};

module.exports.getVehicleById = async (vehicleId, mobile) => {
  try {
    const owner = await User.findOne({ mobile, isDeleted: false });
    if (!owner) throw new AppError("Owner not found", 404);

    const vehicle = await Vehicle.findOne({ _id: vehicleId, ownerId: owner._id, isDeleted: false }).populate("image");
    if (!vehicle) throw new AppError("Vehicle not found", 404);

    return vehicle;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Failed to fetch vehicle details", error.statusCode || 500);
  }
};

module.exports.updateVehicle = async (vehicleId, mobile, payload) => {
  try {
    const { validatedVehicleUpdate } = require("../validation/vehicle.validation");
    const { error } = validatedVehicleUpdate(payload);
    if (error) throw new AppError(error.details[0].message, 400);

    const owner = await User.findOne({ mobile, isDeleted: false });
    if (!owner) throw new AppError("Owner not found", 404);

    const vehicle = await Vehicle.findOne({ _id: vehicleId, ownerId: owner._id, isDeleted: false });
    if (!vehicle) throw new AppError("Vehicle not found", 404);

    if (payload.licensePlate && payload.licensePlate !== vehicle.licensePlate) {
      const existingVehicle = await Vehicle.findOne({ licensePlate: payload.licensePlate, isDeleted: false });
      if (existingVehicle) {
        throw new AppError("A vehicle with this license plate already exists", 400);
      }
    }

    // Verify image if provided
    if (payload.image) {
      const fileExists = await File.findById(payload.image);
      if (!fileExists) throw new AppError("Image file not found", 404);
    }

    await Vehicle.findByIdAndUpdate(vehicleId, payload, { new: true });
    return "Vehicle updated successfully";
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Failed to update vehicle", error.statusCode || 500);
  }
};
