const cron = require('node-cron');
const Booking = require('../model/Booking');

/**
 * Initializes the automated reminder system using node-cron.
 * @param {boolean} isTestMode - If true, runs every minute for testing. Otherwise, runs daily at 8:00 AM.
 */
const initAutomatedReminders = (isTestMode = false) => {
    // Schedule: 8:00 AM every day ('0 8 * * *') or every minute ('* * * * *') for testing
    const scheduleExpression = isTestMode ? '* * * * *' : '0 8 * * *';

    console.log(`[ Automated Reminders ] Initialized. Schedule: ${scheduleExpression}`);

    cron.schedule(scheduleExpression, async () => {
        try {
            console.log('[ Automated Reminders ] Running scheduled job...');

            // Calculate the exact date 90 days ago relative to right now
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() - 90);

            // Normalize to UTC 00:00:00.000 to match the "floating date" storage strategy implemented previously
            targetDate.setUTCHours(0, 0, 0, 0);

            // Execute query finding bookings EXACTLY matching the 90-days-ago UTC date
            const bookings = await Booking.find({
                date: targetDate,
                isDeleted: false
            })
                .populate('customer', 'name')
                .populate('vehicle', 'make model');

            if (bookings.length === 0) {
                console.log('[ Automated Reminders ] No reminders to send today.');
                return;
            }

            console.log(`[ Automated Reminders ] Found ${bookings.length} bookings from 90 days ago. Dispatching messages...`);

            bookings.forEach(booking => {
                const customerName = booking.customer?.name || 'Customer';
                const vehicleName = booking.vehicle ? `${booking.vehicle.make} ${booking.vehicle.model}` : 'Your Vehicle';

                // MOCK SEND MESSAGE
                let msg = ""
                const message = `${customerName}\n${vehicleName}\n\n${msg}`;

                console.log('----------------------------------------------------');
                console.log('MESSAGE DISPATCHED:');
                console.log(message);
                console.log('----------------------------------------------------');
            });

        } catch (error) {
            console.error('[ Automated Reminders ] Error executing reminder cron job:', error.message);
        }
    });
};

module.exports = initAutomatedReminders;
