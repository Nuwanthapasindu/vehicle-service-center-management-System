const cron = require('node-cron');
const Booking = require('../model/Booking');
const { sendSms } = require('../util/smsSender');


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
                .populate('customer', 'name mobile')
                .populate('vehicle', 'make model');


            if (bookings.length === 0) {
                console.log('[ Automated Reminders ] No reminders to send today.');
                return;
            }

            console.log(`[ Automated Reminders ] Found ${bookings.length} bookings from 90 days ago. Dispatching messages...`);

            for (const booking of bookings) {
                const customerName = booking.customer?.name || 'Customer';
                const vehicleName = booking.vehicle ? `${booking.vehicle.make} ${booking.vehicle.model}` : 'Your Vehicle';
                const mobile = booking.customer?.mobile;

                if (!mobile) continue;

                const message = `${customerName}\n${vehicleName}\n\nyou take a service, its time take a service again!`;

                try {
                    await sendSms(mobile, message);
                    console.log(`[ Automated Reminders ] Sent to ${customerName} (${mobile})`);
                } catch (smsError) {
                    console.error(`[ Automated Reminders ] Failed to send to ${mobile}:`, smsError.message);
                }
            }


        } catch (error) {
            console.error('[ Automated Reminders ] Error executing reminder cron job:', error.message);
        }
    });
};

module.exports = initAutomatedReminders;
