const Booking = require("../model/Booking");
const Timeslot = require("../model/Timeslot");
const User = require("../model/User");
const AppError = require("../error/AppError");

module.exports.createBooking = async (payload, mobile) => {
    const { vehicle, slot, date, specialNote } = payload;
    
    if (!vehicle || !slot || !date) {
        throw new AppError("Vehicle, slot, and date are required", 400);
    }

    const owner = await User.findOne({ mobile });
    if (!owner) throw new AppError("Customer not found", 404);

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(checkDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const slotDoc = await Timeslot.findById(slot);
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
};
