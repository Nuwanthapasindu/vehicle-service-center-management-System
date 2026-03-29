const Booking = require("../model/Booking");
const Timeslot = require("../model/Timeslot");
const AppError = require("../error/AppError");

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
