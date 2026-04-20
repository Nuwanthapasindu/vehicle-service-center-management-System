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
            const now = new Date();
            now.setDate(now.getDate() - 90);

            const startOfDay = new Date(now);
            startOfDay.setUTCHours(0, 0, 0, 0);

            const endOfDay = new Date(now);
            endOfDay.setUTCHours(23, 59, 59, 999);

            // Execute query finding bookings covering the full target day in UTC
            const bookings = await Booking.find({
                date: { $gte: startOfDay, $lte: endOfDay },
                isDeleted: false
            })
                .populate('customer', 'name mobile')
                .populate('vehicle', 'make model licensePlate');


            if (bookings.length === 0) {
                console.log('[ Automated Reminders ] No reminders to send today.');
                return;
            }

            console.log(`[ Automated Reminders ] Found ${bookings.length} bookings from 90 days ago. Dispatching messages...`);

            for (const booking of bookings) {
                const customerName = booking.customer?.name || 'Customer';
                const vehicleName = booking.vehicle ? `${booking.vehicle.make} ${booking.vehicle.model}` : 'Your Vehicle';
                const licensePlate = booking.vehicle?.licensePlate || 'XXX-0000';
                const mobile = booking.customer?.mobile;

                if (!mobile) continue;

                const message = `Dear${customerName},\n\n
                This is a courtesy reminder from Shine Depot that your ${vehicleName} (${licensePlate}) is due for its routine service.\n\n
                Regular servicing helps maintain your vehicle's performance and longevity. We'd be happy to schedule an appointment at your earliest convenience.\n\n

                📞${mobile}\n
                Shine Depot`;

                try {
                    await sendSms(mobile, message);
                    console.log(`[Automated Reminders ] Sent to ${customerName} (${mobile})`);
                } catch (smsError) {
                    console.error(`[Automated Reminders ] Failed to send to ${mobile}: `, smsError.message);
                }
            }


        } catch (error) {
            console.error('[ Automated Reminders ] Error executing reminder cron job:', error.message);
        }
    });
};

module.exports = initAutomatedReminders;
