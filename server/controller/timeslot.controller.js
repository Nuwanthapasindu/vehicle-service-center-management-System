const mongoose = require("mongoose");
const Booking = require("../model/Booking");
const Timeslot = require("../model/Timeslot");
const AppError = require("../error/AppError");
const { validateTimeslot } = require("../validation/timeslot.validation");

module.exports.getTimeslotById = async (id) => {
    if (!mongoose.isValidObjectId(id)) throw new AppError("Invalid Timeslot ID", 400);

    try {
        const slot = await Timeslot.findById(id);
        if (!slot || slot.isDeleted) throw new AppError("Timeslot not found", 404);
        return slot;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(error.message, 500);
    }
};

module.exports.getAvailableTimeslots = async (dateStr) => {
    if (!dateStr) throw new AppError("Date is required", 400);

    try {
        const checkDate = new Date(dateStr);
        checkDate.setHours(0, 0, 0, 0);

        const nextDay = new Date(checkDate);
        nextDay.setDate(nextDay.getDate() + 1);

        const timeslots = await Timeslot.find({ isActive: true, isDeleted: false }).sort({ startTime: 1 });
        const bookings = await Booking.find({
            date: { $gte: checkDate, $lt: nextDay },
            isDeleted: false
        });

        const slotAvailability = timeslots.map(slot => {
            const bookingsForSlot = bookings.filter(b => b.slot.toString() === slot._id.toString());
            return {
                id: slot._id,
                startTime: slot.startTime,
                endTime: slot.endTime,
                time: `${slot.startTime} - ${slot.endTime}`,
                maxCapacity: slot.maxCapacity,
                booked: bookingsForSlot.length,
                isFull: bookingsForSlot.length >= slot.maxCapacity
            };
        });

        return slotAvailability;
    } catch (error) {
        throw new AppError(error.message, error.statusCode || 500);
    }
};

module.exports.getAllTimeslots = async () => {
    try {
        return await Timeslot.find({ isDeleted: false }).sort({ startTime: 1 });
    } catch (error) {
        throw new AppError(error.message, 500);
    }
};

module.exports.createTimeslot = async (payload) => {
    const { error, value } = validateTimeslot(payload);
    if (error) {
        throw new AppError(error.details[0].message, 400);
    }

    try {
        const existingSlot = await Timeslot.findOne({
            startTime: value.startTime,
            endTime: value.endTime,
            isDeleted: false
        });
        if (existingSlot) throw new AppError("A timeslot with the same start and end time already exists", 400);

        const newSlot = new Timeslot(value);
        return await newSlot.save();
    } catch (error) {
        throw new AppError(error.message, 500);
    }
};

module.exports.updateTimeslot = async (id, payload) => {
    if (!mongoose.isValidObjectId(id)) throw new AppError("Invalid Timeslot ID", 400);

    try {
        const slot = await Timeslot.findById(id);
        if (!slot || slot.isDeleted) throw new AppError("Timeslot not found", 404);

        const { error, value } = validateTimeslot(payload);
        if (error) throw new AppError(error.details[0].message, 400);

        const existingSlot = await Timeslot.findOne({
            _id: { $ne: id },
            startTime: value.startTime,
            endTime: value.endTime,
            isDeleted: false
        });
        if (existingSlot) throw new AppError("A timeslot with the same start and end time already exists", 400);

        Object.assign(slot, value);

        return await slot.save();
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(error.message, 500);
    }
};

module.exports.updateTimeslotState = async (id, isActive) => {
    if (!mongoose.isValidObjectId(id)) throw new AppError("Invalid Timeslot ID", 400);

    try {
        const slot = await Timeslot.findById(id);
        if (!slot || slot.isDeleted) throw new AppError("Timeslot not found", 404);

        if (typeof isActive !== "boolean") {
            throw new AppError("isActive must be a boolean", 400);
        }

        slot.isActive = isActive;

        return await slot.save();
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(error.message, 500);
    }
};

module.exports.deleteTimeslot = async (id) => {
    if (!mongoose.isValidObjectId(id)) throw new AppError("Invalid Timeslot ID", 400);

    try {
        const slot = await Timeslot.findById(id);
        if (!slot) throw new AppError("Timeslot not found", 404);

        slot.isDeleted = true;
        slot.deletedAt = new Date();
        return await slot.save();
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(error.message, 500);
    }
};
