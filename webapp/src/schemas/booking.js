import * as Yup from 'yup';

export const bookingSchema = Yup.object().shape({
    vehicleId: Yup.string()
        .required('Please select a vehicle to proceed.'),
    slotId: Yup.string()
        .required('Please select an available time slot.'),
    date: Yup.date()
        .required('Please select a booking date.')
        .min(new Date(new Date().setHours(0, 0, 0, 0)), 'Booking date cannot be in the past.')
});
