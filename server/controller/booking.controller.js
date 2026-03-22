const Booking = require("../model/Booking");
const Timeslot = require("../model/Timeslot");
const User = require("../model/User");
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
