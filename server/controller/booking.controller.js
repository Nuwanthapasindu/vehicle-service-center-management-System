const Booking = require("../model/Booking");
const JobCard = require("../model/JobCard");
const Timeslot = require("../model/Timeslot");
const User = require("../model/User");
const Vehicle = require("../model/Vehicle");
const Invoice = require("../model/Invoice");
const AppError = require("../error/AppError");

const { validatedCreateBooking } = require("../validation/booking.validation");

module.exports.createBooking = async (payload, mobile) => {
    const { value, error } = validatedCreateBooking(payload);
    if (error) throw new AppError(error.details[0].message, 400);

    const { vehicle, slot, date, specialNote } = value;

    try {
        const owner = await User.findOne({ mobile, isDeleted: false });
        if (!owner) throw new AppError("Customer not found", 404);

        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(checkDate);
        nextDay.setDate(nextDay.getDate() + 1);

        const slotDoc = await Timeslot.findOne({ _id: slot, isDeleted: false });
        if (!slotDoc) throw new AppError("Timeslot not found", 404);

        const existingBookings = await Booking.find({
            slot: slot,
            date: { $gte: checkDate, $lt: nextDay },
            isDeleted: false
        });

        if (existingBookings.length >= slotDoc.maxCapacity) {
            throw new AppError("This timeslot is fully booked for the selected date", 400);
        }

        const newBooking = new Booking({
            customer: owner._id,
            vehicle,
            slot,
            date: checkDate,
            specialNote
        });

        const savedBooking = await newBooking.save();
        return savedBooking;
    } catch (error) {
        throw new AppError(error.message, error.statusCode || 500);
    }
};

module.exports.getBookingHistory = async (mobile, filters = {}) => {
    try {
        const owner = await User.findOne({ mobile, isDeleted: false });
        if (!owner) throw new AppError("Customer not found", 404);

        const { search, status, vehicle: vehicleFilter } = filters;

        const bookings = await Booking.find({ customer: owner._id, isDeleted: false })
            .populate("vehicle", "make model licensePlate")
            .sort({ date: -1 });

        // For each booking, fetch corresponding JobCard details
        let history = await Promise.all(bookings.map(async (booking) => {
            const jobCard = await JobCard.findOne({ booking: booking._id, isDeleted: false })
                .populate("selectedPackage", "name");

            return {
                id: booking._id,
                date: booking.date,
                vehicle: booking.vehicle ? `${booking.vehicle.make} ${booking.vehicle.model}` : "Unknown Vehicle",
                licensePlate: booking.vehicle?.licensePlate || "N/A",
                service: jobCard?.selectedPackage?.name || "Pending Selection",
                status: jobCard?.status || "PENDING",
                canViewDetails: !!jobCard
            };
        }));

        // Apply Server-Side Filtering
        if (search || (status && status !== 'all') || (vehicleFilter && vehicleFilter !== 'all')) {
            history = history.filter(item => {
                const searchLower = search ? search.toLowerCase() : "";
                const matchesSearch = !search ||
                    item.vehicle.toLowerCase().includes(searchLower) ||
                    item.service.toLowerCase().includes(searchLower) ||
                    item.licensePlate.toLowerCase().includes(searchLower);

                const matchesStatus = !status || status === 'all' || item.status === status;

                const matchesVehicle = !vehicleFilter || vehicleFilter === 'all' ||
                    item.vehicle.toLowerCase().includes(vehicleFilter.toLowerCase());

                return matchesSearch && matchesStatus && matchesVehicle;
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
        const totalVehicles = await Vehicle.countDocuments({ ownerId: owner._id, isDeleted: false });
        const allBookings = await Booking.find({ customer: owner._id, isDeleted: false });
        const totalBookings = allBookings.length;

        // Active Bookings: Not finished job cards or future bookings without job cards
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const activeBookingsList = await Booking.find({
            customer: owner._id,
            isDeleted: false,
            date: { $gte: today }
        }).populate("vehicle", "make model")
            .populate("slot", "startTime endTime")
            .sort({ date: 1 });

        // Calculate Total Spent from Invoices
        const invoices = await Invoice.find({ customer: owner._id, isDeleted: false });
        let totalSpent = 0;
        invoices.forEach(inv => {
            if (inv.selectedPackage?.selectedPackageTier?.price) {
                totalSpent += inv.selectedPackage.selectedPackageTier.price;
            }
            if (inv.additionalItems) {
                inv.additionalItems.forEach(item => totalSpent += (item.sellingPrice || 0) * (item.qty || 0));
            }
            if (inv.additionalServices) {
                inv.additionalServices.forEach(ser => totalSpent += (ser.charge || 0));
            }
        });

        // Upcoming Booking (earliest future one)
        const upcomingBooking = activeBookingsList[0] || null;

        // Recent Vehicles (max 4)
        const recentVehicles = await Vehicle.find({ ownerId: owner._id, isDeleted: false })
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
                totalSpent: totalSpent.toLocaleString('en-US', { style: 'currency', currency: 'LKR' })
            },
            upcomingBooking: upcomingBooking ? {
                id: upcomingBooking._id,
                service: "Service Scheduled", // We don't have package assigned on booking yet
                vehicle: upcomingBooking.vehicle ? `${upcomingBooking.vehicle.make} ${upcomingBooking.vehicle.model}` : "Unknown",
                date: upcomingBooking.date,
                time: upcomingBooking.slot ? `${upcomingBooking.slot.startTime} - ${upcomingBooking.slot.endTime}` : "TBD",
                status: "CONFIRMED"
            } : null,
            recentVehicles,
            recentHistory
        };

    } catch (error) {
        throw new AppError(error.message, error.statusCode || 500);
    }
};
