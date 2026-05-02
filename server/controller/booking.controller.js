const Booking = require("../model/Booking");
const JobCard = require("../model/JobCard");
const Timeslot = require("../model/Timeslot");
const User = require("../model/User");
const Vehicle = require("../model/Vehicle");
const Invoice = require("../model/Invoice");
const AppError = require("../error/AppError");
const File = require("../model/File");
const Team = require("../model/Team");
const Review = require("../model/Review");
const { JOBCARD_STATUS } = require("../util/constants");

const { validatedCreateBooking } = require("../validation/booking.validation");

module.exports.createBooking = async (payload, mobile) => {
  const { value, error } = validatedCreateBooking(payload);
  if (error) throw new AppError(error.details[0].message, 400);

  const { vehicle, slot, date, specialNote } = value;

  try {
    const owner = await User.findOne({ mobile, isDeleted: false });
    if (!owner) throw new AppError("Customer not found", 404);

    const checkDate = new Date(
      typeof date === "string" && !date.includes("T")
        ? `${date}T00:00:00Z`
        : date,
    );
    checkDate.setUTCHours(0, 0, 0, 0);

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    if (checkDate <= today) {
      throw new AppError(
        "Bookings must be made at least one day in advance.",
        400,
      );
    }

    const maxDate = new Date(today);
    maxDate.setUTCDate(today.getUTCDate() + 30);

    if (checkDate > maxDate) {
      throw new AppError("Booking date cannot exceed 30 days from today.", 400);
    }

    const nextDay = new Date(checkDate);
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);

    const slotDoc = await Timeslot.findOne({ _id: slot, isDeleted: false });
    if (!slotDoc) throw new AppError("Timeslot not found", 404);

    const existingBookings = await Booking.find({
      slot: slot,
      date: { $gte: checkDate, $lt: nextDay },
      isDeleted: false,
    });

    const isVehicleAlreadyBooked = existingBookings.some(
      (b) => b.vehicle.toString() === vehicle.toString(),
    );
    if (isVehicleAlreadyBooked) {
      throw new AppError(
        "This vehicle is already booked for this specific time slot on the selected date.",
        400,
      );
    }

    if (existingBookings.length >= slotDoc.maxCapacity) {
      throw new AppError(
        "This timeslot is fully booked for the selected date",
        400,
      );
    }

    const newBooking = new Booking({
      customer: owner._id,
      vehicle,
      slot,
      date: checkDate,
      specialNote,
    });

    const savedBooking = await newBooking.save();
    return savedBooking;
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError(
        "This vehicle is already booked for this specific time slot on the selected date.",
        409,
      );
    }
    throw new AppError(error.message, error.statusCode || 500);
  }
};

module.exports.getBookingHistory = async (mobile, filters = {}) => {
  try {
    const owner = await User.findOne({ mobile, isDeleted: false });
    if (!owner) throw new AppError("Customer not found", 404);

    const { search, status, vehicle: vehicleFilter, duration } = filters;

    // Build query object
    const query = { customer: owner._id, isDeleted: false };
    // Handle direct vehicle filtering if it's a valid ID (passed from VehicleDetails)
    const isVehicleId =
      vehicleFilter && vehicleFilter.match(/^[0-9a-fA-F]{24}$/);
    if (isVehicleId) {
      query.vehicle = vehicleFilter;
    }

    if (duration && duration !== "all") {
      const now = new Date();
      let startDate = new Date();
      if (duration === "6m") startDate.setMonth(now.getMonth() - 6);
      else if (duration === "1y") startDate.setFullYear(now.getFullYear() - 1);
      else if (duration === "2y") startDate.setFullYear(now.getFullYear() - 2);
      else if (duration === "5y") startDate.setFullYear(now.getFullYear() - 5);

      // Set to start of the day
      startDate.setHours(0, 0, 0, 0);
      query.date = { $gte: startDate };
    }

    const bookings = await Booking.find(query)
      .populate("vehicle", "make model licensePlate year")
      .sort({ date: -1 });

    // For each booking, fetch corresponding JobCard details
    let history = await Promise.all(
      bookings.map(async (booking) => {
        const jobCard = await JobCard.findOne({
          booking: booking._id,
          isDeleted: false,
        }).populate("selectedPackage", "name");

        let totalCost = 0;
        if (jobCard) {
          const invoice = await Invoice.findOne({
            jobCard: jobCard._id,
            isDeleted: false,
          });
          if (invoice) {
            totalCost = invoice.totalPrice;
          }
        }

        return {
          id: booking._id,
          date: booking.date,
          vehicle: booking.vehicle
            ? `${booking.vehicle.make} ${booking.vehicle.model}`
            : "Unknown Vehicle",
          licensePlate: booking.vehicle?.licensePlate || "N/A",
          service: jobCard?.selectedPackage?.name || "Pending Selection",
          status: jobCard?.status || "PENDING",
          milageCount: jobCard?.milageCount || 0,
          totalCost: totalCost,
          canViewDetails: !!jobCard,
          hasReview: !!(await Review.findOne({
            booking: booking._id,
            isDeleted: false,
          })),
        };
      }),
    );

    // Apply Server-Side Filtering (Search and Status)
    if (
      search ||
      (status && status !== "all") ||
      (!isVehicleId && vehicleFilter && vehicleFilter !== "all")
    ) {
      history = history.filter((item) => {
        const searchLower = search ? search.toLowerCase() : "";
        const matchesSearch =
          !search ||
          item.vehicle.toLowerCase().includes(searchLower) ||
          item.service.toLowerCase().includes(searchLower) ||
          item.licensePlate.toLowerCase().includes(searchLower);

        const matchesStatus =
          !status || status === "all" || item.status === status;

        // Only perform name-based vehicle filter if not already filtered by database (ID)
        const matchesVehicleName =
          isVehicleId ||
          !vehicleFilter ||
          vehicleFilter === "all" ||
          item.vehicle.toLowerCase().includes(vehicleFilter.toLowerCase());

        return matchesSearch && matchesStatus && matchesVehicleName;
      });
    }

    return history;
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};

module.exports.getDashboardData = async (mobile) => {
  try {
    const owner = await User.findOne({ mobile, isDeleted: false });
    if (!owner) throw new AppError("Customer not found", 404);

    // Stats
    const totalVehicles = await Vehicle.countDocuments({
      ownerId: owner._id,
      isDeleted: false,
    });
    const allBookings = await Booking.find({
      customer: owner._id,
      isDeleted: false,
    });
    const totalBookings = allBookings.length;

    // Active Bookings: Not finished job cards or future bookings without job cards
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeBookingsList = await Booking.find({
      customer: owner._id,
      isDeleted: false,
      date: { $gte: today },
    })
      .populate("vehicle", "make model year")
      .populate("slot", "startTime endTime")
      .sort({ date: 1 });

    // Calculate Total Spent from Invoices
    const invoices = await Invoice.find({
      customer: owner._id,
      isDeleted: false,
    });
    let totalSpent = 0;
    invoices.forEach((inv) => {
      if (inv.selectedPackage?.selectedPackageTier?.price) {
        totalSpent += inv.selectedPackage.selectedPackageTier.price;
      }
      if (inv.additionalItems) {
        inv.additionalItems.forEach(
          (item) => (totalSpent += (item.sellingPrice || 0) * (item.qty || 0)),
        );
      }
      if (inv.additionalServices) {
        inv.additionalServices.forEach(
          (ser) => (totalSpent += ser.charge || 0),
        );
      }
    });

    // Upcoming Booking (earliest future one)
    const upcomingBooking = activeBookingsList[0] || null;

    // Recent Vehicles (max 4)
    const recentVehicles = await Vehicle.find({
      ownerId: owner._id,
      isDeleted: false,
    })
      .populate("image", "filePath")
      .sort({ createdAt: -1 })
      .limit(4);

    // Recent History (max 5)
    const historyRes = await this.getBookingHistory(mobile);
    const recentHistory = historyRes.slice(0, 5);

    return {
      stats: {
        activeBookings: activeBookingsList.length,
        totalVehicles,
        totalBookings,
        totalSpent: totalSpent.toLocaleString("en-US", {
          style: "currency",
          currency: "LKR",
        }),
      },
      upcomingBooking: upcomingBooking
        ? {
            id: upcomingBooking._id,
            service: "Service Scheduled", // We don't have package assigned on booking yet
            vehicle: upcomingBooking.vehicle
              ? `${upcomingBooking.vehicle.make} ${upcomingBooking.vehicle.model}`
              : "Unknown",
            date: upcomingBooking.date,
            time: upcomingBooking.slot
              ? `${upcomingBooking.slot.startTime} - ${upcomingBooking.slot.endTime}`
              : "TBD",
            status: "CONFIRMED",
          }
        : null,
      recentVehicles,
      recentHistory,
    };
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};

module.exports.getAdminBookingDetails = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId)
      .select("date vehicle slot customer isDeleted")
      .populate("customer", "name mobile")
      .populate("vehicle", "make model licensePlate image")
      .populate("slot", "startTime endTime");

    if (!booking || booking.isDeleted)
      throw new AppError("Booking not found", 404);
    let vehicleImagePath = null;
    if (booking.vehicle?.image) {
      const fileData = await File.findById(booking.vehicle.image).select(
        "filePath",
      );
      if (fileData) vehicleImagePath = fileData.filePath.replace(/\\/g, "/");
    }

    // Fetch related JobCard (if exists)
    const jobCard = await JobCard.findOne({
      booking: bookingId,
      isDeleted: false,
    })
      .select("selectedPackage team status milageCount")
      .populate("selectedPackage", "name")
      .populate("team", "name");

    // Fetch all active teams
    const teams = await Team.find({ isDeleted: false }).select("name");

    // Build Team list
    const formattedTeams = teams.map((team) => {
      return {
        id: team._id,
        name: team.name,
      };
    });

    // Determine JobCard values
    let servicePkg = null;
    let tier = null;
    let statusZ = JOBCARD_STATUS.PENDING;
    let assignedT = null;

    if (jobCard) {
      servicePkg = jobCard.selectedPackage
        ? jobCard.selectedPackage.name
        : null;
      statusZ = jobCard.status;
      if (jobCard.team) {
        assignedT = jobCard.team._id;
      }
    }

    return {
      date: booking.date.toISOString().split("T")[0],
      time: booking.slot ? booking.slot.startTime : null,

      status: statusZ,
      customer: {
        _id: booking.customer ? booking.customer._id : null,
        name: booking.customer ? booking.customer.name : null,
        phone: booking.customer ? booking.customer.mobile : null,
      },
      vehicle: {
        name: booking.vehicle
          ? `${booking.vehicle.make} ${booking.vehicle.model}`
          : null,
        plate: booking.vehicle ? booking.vehicle.licensePlate : null,
        image: vehicleImagePath,
      },
      service: {
        package: servicePkg,
        pricingTier: tier,
        statusZone: statusZ,
        jobCardId: jobCard ? jobCard._id : null,
        milageCount: jobCard ? jobCard.milageCount : null,
      },
      assignedTeam: assignedT,
      teams: formattedTeams,
    };
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};

module.exports.updateBookingByAdmin = async (bookingId, payload) => {
  if (!bookingId || !/^[0-9a-fA-F]{24}$/.test(bookingId)) {
    throw new AppError("Valid Booking ID is required", 400);
  }

  if (
    !payload ||
    typeof payload !== "object" ||
    Object.keys(payload).length === 0
  ) {
    throw new AppError("Payload is required and cannot be empty", 400);
  }

  const { date, slot } = payload;

  if (slot !== undefined && !/^[0-9a-fA-F]{24}$/.test(slot)) {
    throw new AppError("Valid Timeslot ID is required", 400);
  }

  if (date !== undefined && isNaN(new Date(date).getTime())) {
    throw new AppError("Valid Booking date is required", 400);
  }

  try {
    const booking = await Booking.findOne({ _id: bookingId, isDeleted: false });
    if (!booking) throw new AppError("Booking not found", 404);

    // Restrict rescheduling if service has started or completed
    const jobCardCheck = await JobCard.findOne({
      booking: bookingId,
      isDeleted: false,
    });
    if (jobCardCheck && jobCardCheck.status !== JOBCARD_STATUS.PENDING) {
      throw new AppError(
        `Cannot reschedule a booking that is currently ${jobCardCheck.status.toLowerCase()}.`,
        400,
      );
    }

    if (date) {
      const checkDate = new Date(
        typeof date === "string" && !date.includes("T")
          ? `${date}T00:00:00Z`
          : date,
      );
      checkDate.setUTCHours(0, 0, 0, 0);
      booking.date = checkDate;
    }

    if (slot) {
      const slotDoc = await Timeslot.findOne({ _id: slot, isDeleted: false });
      if (!slotDoc) throw new AppError("Timeslot not found", 404);
      booking.slot = slot;
    }

    // Check for concurrency/capacity if date or slot changed
    if (date || slot) {
      const checkDate = new Date(booking.date);
      checkDate.setUTCHours(0, 0, 0, 0);
      const nextDay = new Date(checkDate);
      nextDay.setUTCDate(nextDay.getUTCDate() + 1);

      const existingBookings = await Booking.find({
        _id: { $ne: bookingId },
        slot: booking.slot,
        date: { $gte: checkDate, $lt: nextDay },
        isDeleted: false,
      });

      const slotDoc = await Timeslot.findById(booking.slot);

      if (existingBookings.length >= slotDoc.maxCapacity) {
        throw new AppError(
          "This timeslot is fully booked for the selected date",
          400,
        );
      }
    }

    await booking.save();
    return "Booking updated successfully";
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError(
        "This vehicle is already booked for this specific time slot on the selected date.",
        409,
      );
    }
    throw new AppError(error.message, error.statusCode || 500);
  }
};

module.exports.cancelBookingByAdmin = async (bookingId) => {
  try {
    const booking = await Booking.findOne({ _id: bookingId, isDeleted: false });
    if (!booking) throw new AppError("Booking not found", 404);

    // Find associated Job Card
    const jobCard = await JobCard.findOne({
      booking: bookingId,
      isDeleted: false,
    });

    if (jobCard && jobCard.status === JOBCARD_STATUS.FINISH) {
      throw new AppError(
        "Cannot cancel a booking that has already been finished.",
        400,
      );
    }

    if (jobCard) {
      // Delete associated Invoices if Job Card exists
      await Invoice.findOneAndUpdate(
        { jobCard: jobCard._id, isDeleted: false },
        {
          isDeleted: true,
          deletedAt: new Date(),
        },
      );

      // Delete Job Card
      jobCard.isDeleted = true;
      jobCard.deletedAt = new Date();
      await jobCard.save();
    }

    booking.isDeleted = true;
    booking.deletedAt = new Date();
    await booking.save();

    return { message: "Booking cancelled successfully" };
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};
