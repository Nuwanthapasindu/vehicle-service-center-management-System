const Booking = require("../model/Booking");
const Timeslot = require("../model/Timeslot");
const User = require("../model/User");
const AppError = require("../error/AppError");

module.exports.getAvailableTimeslots = async (dateStr) => {
    if (!dateStr) throw new AppError("Date is required", 400);

    const checkDate = new Date(dateStr);
    checkDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(checkDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Initial seeding check
    const count = await Timeslot.countDocuments();
    if (count === 0) {
        await Timeslot.insertMany([
            { startTime: "09:00", endTime: "13:00", maxCapacity: 2 },
            { startTime: "10:30", endTime: "14:30", maxCapacity: 2 },
            { startTime: "13:00", endTime: "17:00", maxCapacity: 2 },
            { startTime: "14:30", endTime: "18:30", maxCapacity: 2 }
        ]);
    }

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
};

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
