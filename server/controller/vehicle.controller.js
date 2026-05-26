const Vehicle = require("../model/Vehicle");
const User = require("../model/User");
const File = require("../model/File");
const Booking = require("../model/Booking");
const JobCard = require("../model/JobCard");
const Invoice = require("../model/Invoice");
const AppError = require("../error/AppError");
const { validatedVehicleAdd } = require("../validation/vehicle.validation");
const { deleteFileById } = require("./file.controller");
const { JOBCARD_STATUS } = require("../util/constants");

module.exports.addVehicle = async (payload, mobile) => {
  try {
    const { error } = validatedVehicleAdd(payload);
    if (error) throw new AppError(error.details[0].message, 400);

    const owner = await User.findOne({ mobile, isDeleted: false });
    if (!owner) throw new AppError("Owner not found", 404);

    // Check if license plate exists
    const existingVehicle = await Vehicle.findOne({
      licensePlate: payload.licensePlate,
      isDeleted: false,
    });
    if (existingVehicle)
      throw new AppError("License plate already registered", 400);

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
      ...(payload.image && { image: payload.image }),
    });

    await newVehicle.save();
    return "Vehicle added successfully";
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      error.message || "Failed to add vehicle",
      error.statusCode || 500,
    );
  }
};

module.exports.getMyVehicles = async (mobile) => {
  try {
    const owner = await User.findOne({ mobile, isDeleted: false });
    if (!owner) throw new AppError("Owner not found", 404);

    const vehicles = await Vehicle.find({
      ownerId: owner._id,
      isDeleted: false,
    })
      .populate("image")
      .sort({ createdAt: -1 });

    return vehicles;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      error.message || "Failed to fetch vehicles",
      error.statusCode || 500,
    );
  }
};

module.exports.deleteVehicle = async (vehicleId, mobile) => {
  try {
    const owner = await User.findOne({ mobile, isDeleted: false });
    if (!owner) throw new AppError("Owner not found", 404);

    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      ownerId: owner._id,
      isDeleted: false,
    });
    if (!vehicle) throw new AppError("Vehicle not found", 404);

    if (vehicle.image) {
      await deleteFileById(vehicle.image).catch((err) => {
        throw new AppError("Failed to delete vehicle image", 500);
      });
    }

    // Delete all pending/incomplete bookings associated with this vehicle
    const bookings = await Booking.find({
      vehicle: vehicleId,
      isDeleted: false,
    });
    for (const booking of bookings) {
      const jobCard = await JobCard.findOne({
        booking: booking._id,
        isDeleted: false,
      });
      // If no job card exists or job card is not finished, delete the booking
      if (!jobCard || jobCard.status !== JOBCARD_STATUS.FINISH) {
        await Booking.findByIdAndUpdate(booking._id, {
          isDeleted: true,
          deletedAt: new Date(),
        });

        // If a job card exists but is not finished, delete it too
        if (jobCard) {
          await JobCard.findByIdAndUpdate(jobCard._id, {
            isDeleted: true,
            deletedAt: new Date(),
          });
        }
      }
    }

    await Vehicle.findByIdAndUpdate(vehicleId, {
      isDeleted: true,
      deletedAt: new Date(),
      licensePlate: `${vehicle.licensePlate}-deleted-${Date.now()}`,
      image: null,
    });
    return "Vehicle deleted successfully";
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      error.message || "Failed to delete vehicle",
      error.statusCode || 500,
    );
  }
};

module.exports.getVehicleById = async (vehicleId, mobile) => {
  try {
    const owner = await User.findOne({ mobile, isDeleted: false });
    if (!owner) throw new AppError("Owner not found", 404);

    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      ownerId: owner._id,
      isDeleted: false,
    }).populate("image");
    if (!vehicle) throw new AppError("Vehicle not found", 404);

    return vehicle;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      error.message || "Failed to fetch vehicle details",
      error.statusCode || 500,
    );
  }
};

module.exports.updateVehicle = async (vehicleId, mobile, payload) => {
  try {
    const {
      validatedVehicleUpdate,
    } = require("../validation/vehicle.validation");
    const { error } = validatedVehicleUpdate(payload);
    if (error) throw new AppError(error.details[0].message, 400);

    const owner = await User.findOne({ mobile, isDeleted: false });
    if (!owner) throw new AppError("Owner not found", 404);

    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      ownerId: owner._id,
      isDeleted: false,
    });
    if (!vehicle) throw new AppError("Vehicle not found", 404);

    if (payload.licensePlate && payload.licensePlate !== vehicle.licensePlate) {
      const existingVehicle = await Vehicle.findOne({
        licensePlate: payload.licensePlate,
        isDeleted: false,
      });
      if (existingVehicle) {
        throw new AppError(
          "A vehicle with this license plate already exists",
          400,
        );
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
    throw new AppError(
      error.message || "Failed to update vehicle",
      error.statusCode || 500,
    );
  }
};

module.exports.getAllVehicles = async (search = "", page = 1, limit = 100) => {
  try {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 100;
    const skip = (pageNum - 1) * limitNum;

    const query = {};
    if (search) {
      query.licensePlate = { $regex: search, $options: "i" };
    }

    const vehicles = await Vehicle.find(query)
      .populate("image")
      .populate("ownerId", "name mobile")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return vehicles;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Failed to fetch registered vehicles", error.statusCode || 500);
  }
};

module.exports.getVehicleDetailsAdmin = async (vehicleId) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: vehicleId })
      .populate("image")
      .populate("ownerId", "name mobile address");

    if (!vehicle) {
      throw new AppError("Vehicle not found", 404);
    }

    const bookings = await Booking.find({ vehicle: vehicleId, isDeleted: false })
      .populate("slot", "startTime endTime");

    const bookingIds = bookings.map(b => b._id);

    const jobCards = await JobCard.find({ booking: { $in: bookingIds }, isDeleted: false })
      .populate({
        path: "selectedPackage",
        populate: {
          path: "servicesIncluded",
          select: "name description"
        }
      });

    const jobCardIds = jobCards.map(jc => jc._id);
    const invoices = await Invoice.find({ jobCard: { $in: jobCardIds }, isDeleted: false });

    // Map invoices by jobCard ID for quick lookup
    const invoiceMap = {};
    invoices.forEach(inv => {
      invoiceMap[inv.jobCard.toString()] = inv;
    });

    // Map bookings by ID for quick lookup
    const bookingMap = {};
    bookings.forEach(b => {
      bookingMap[b._id.toString()] = b;
    });

    let totalExpenditure = 0;
    const serviceHistory = jobCards.map(jc => {
      const booking = bookingMap[jc.booking.toString()];
      const invoice = invoiceMap[jc._id.toString()];
      const cost = invoice ? invoice.totalPrice : 0;
      totalExpenditure += cost;

      return {
        jobCardId: jc._id,
        date: booking ? booking.date : jc.createdAt,
        status: jc.status,
        milageCount: jc.milageCount || 0,
        packageName: jc.selectedPackage ? jc.selectedPackage.name : "N/A",
        packageDescription: jc.selectedPackage ? jc.selectedPackage.description : "",
        services: jc.selectedPackage && jc.selectedPackage.servicesIncluded 
          ? jc.selectedPackage.servicesIncluded.map(s => ({ name: s.name, description: s.description }))
          : [],
        cost: cost,
        invoiceId: invoice ? invoice.invoiceId : null
      };
    });

    // Sort service history by date descending
    serviceHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
      vehicle,
      totalExpenditure,
      serviceHistory
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Failed to fetch vehicle details", error.statusCode || 500);
  }
};
