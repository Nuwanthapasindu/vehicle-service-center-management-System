const { getAccountStatus, sendBulkSms } = require('../util/smsSender');
const User = require('../model/User');
const SmsCampaign = require('../model/SmsCampaign');
const AppError = require('../error/AppError');
const { USER_ROLES } = require('../util/constants');
const { validatedCreateSmsCampaign } = require('../validation/smsCampaign.validation');

module.exports.fetchSmsAccountStatus = async () => {
    try {
        const status = await getAccountStatus();
        return status;
    } catch (error) {
        throw new AppError(error.response?.data?.error || "Failed to fetch SMS account status", 500);
    }
};

module.exports.createSmsCampaign = async (payload, senderMobile) => {
    const { value, error } = validatedCreateSmsCampaign(payload);
    if (error) {
        throw new AppError(error.details[0].message, 400);
    }

    const { title, message, campaignType } = value;

    try {
        const sender = await User.findOne({ mobile: senderMobile, isDeleted: false }).lean();
        if (!sender) {
            throw new AppError("Sender admin not found", 404);
        }

        // Fetch all active, non-deleted customers
        const customers = await User.find({
            role: USER_ROLES.CUSTOMER,
            isActive: true,
            isDeleted: false
        }).lean();

        const contacts = customers
            .map(c => c.mobile)
            .filter(mobile => mobile && mobile.trim().length > 0);

        if (contacts.length === 0) {
            throw new AppError("No active customers found with valid mobile numbers", 404);
        }

        // Call the gateway bulk sending utility
        const responseData = await sendBulkSms(contacts, message, campaignType);

        // Save the campaign
        const newCampaign = new SmsCampaign({
            title,
            message,
            campaignType,
            recipientsCount: contacts.length,
            sentBy: sender._id,
            gatewayResponse: responseData
        });

        await newCampaign.save();
        return newCampaign;
    } catch (error) {
        throw new AppError(error.message, error.statusCode || 500);
    }
};

module.exports.getSmsCampaigns = async () => {
    try {
        const campaigns = await SmsCampaign.find()
            .populate("sentBy", "name mobile")
            .sort({ createdAt: -1 })
            .lean();
        return campaigns;
    } catch (error) {
        throw new AppError(error.message, error.statusCode || 500);
    }
};
