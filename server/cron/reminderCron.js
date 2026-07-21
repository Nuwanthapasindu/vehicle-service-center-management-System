const cron = require('node-cron');
const JobCard = require('../model/JobCard');
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

            // Calculate the exact date 7 days from right now
            const now = new Date();
            now.setDate(now.getDate() + 7);

            const startOfDay = new Date(now);
            startOfDay.setUTCHours(0, 0, 0, 0);

            const endOfDay = new Date(now);
            endOfDay.setUTCHours(23, 59, 59, 999);

            // Execute query finding JobCards where nextServiceDate falls on the target day in UTC
            const jobCards = await JobCard.find({
                nextServiceDate: { $gte: startOfDay, $lte: endOfDay },
                isDeleted: false
            }).populate({
                path: 'booking',
                populate: [
                    { path: 'customer', select: 'name mobile' },
                    { path: 'vehicle', select: 'make model licensePlate' }
                ]
            });


            if (jobCards.length === 0) {
                console.log('[ Automated Reminders ] No reminders to send today.');
                return;
            }

            console.log(`[ Automated Reminders ] Found ${jobCards.length} vehicles due for service in 7 days. Dispatching messages...`);

            for (const jobCard of jobCards) {
                const booking = jobCard.booking;
                if (!booking) continue; // Safety check

                const customerName = booking.customer?.name || 'Customer';
                const vehicleName = booking.vehicle ? `${booking.vehicle.make} ${booking.vehicle.model}` : 'Your Vehicle';
                const licensePlate = booking.vehicle?.licensePlate || 'XXX-0000';
                const mobile = booking.customer?.mobile;
                const formattedDate = new Date(jobCard.nextServiceDate).toLocaleDateString("en-US", { timeZone: "UTC" });

                if (!mobile) continue;

                const message = `Dear ${customerName},\n\nJust a friendly reminder from Shine Depot that your ${vehicleName} (${licensePlate}) is due for its next service on ${formattedDate}.\n\nPlease log in to your account to book your next appointment!\n\n📞 +94 76 315 3797\nShine Depot`;

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
