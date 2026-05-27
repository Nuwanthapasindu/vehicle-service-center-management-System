const { getAccountStatus, sendSms, sendBulkSms } = require('../util/smsSender');


module.exports.fetchSmsAccountStatus = async () => {
    try {
        const status = await getAccountStatus();
        return status;
    } catch (error) {
        throw new AppError(error.response?.data?.error || "Failed to fetch SMS account status", 500);
    }
}
