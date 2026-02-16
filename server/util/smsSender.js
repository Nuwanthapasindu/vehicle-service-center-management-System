const { createSmsClient } = require('../config/axios.config');
const { MESSAGE_TYPES } = require('./constants');


async function sendSms(contact, message, type = MESSAGE_TYPES.TRANSACTIONAL) {
    const SMS_ID = type === MESSAGE_TYPES.TRANSACTIONAL ? process.env.SMS_SENDER_ID_TRANSACTIONAL : process.env.SMS_SENDER_ID_PROMOTIONAL;
    if (!SMS_ID) {
        throw new Error('SMS Sender ID is not configured for the specified message type');
    }
    try {

        const smsClient = createSmsClient();
        const response = await smsClient.post('/send-sms', {
            sender_id: SMS_ID,
            contact,
            message
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to send SMS: ' + error.message);
    }
}

async function sendBulkSms(contacts, message, type = MESSAGE_TYPES.TRANSACTIONAL) {
    const SMS_ID = type === MESSAGE_TYPES.TRANSACTIONAL ? process.env.SMS_SENDER_ID_TRANSACTIONAL : process.env.SMS_SENDER_ID_PROMOTIONAL;
    if (!SMS_ID) {
        throw new Error('SMS Sender ID is not configured for the specified message type');
    }
    try {
        const smsClient = createSmsClient();
        const response = await smsClient.post('/send-bulk-sms', {
            sender_id: SMS_ID,
            contacts,
            message
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to send bulk SMS: ' + error.message);
    }
}

async function getAccountStatus() {
    try {
        const smsClient = createSmsClient();
        const response = await smsClient.get('/account-status');
        return response.data;
    } catch (error) {
        throw error;
    }
}
module.exports = {
    getAccountStatus,
    sendSms,
    sendBulkSms
};