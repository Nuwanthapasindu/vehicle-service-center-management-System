const joi = require("joi");
const validator = require("./core");
const { MESSAGE_TYPES } = require("../util/constants");

const createSmsCampaignValidationSchema = joi.object({
  title: joi.string().trim().required().messages({
    "any.required": "Campaign title is required",
    "string.empty": "Campaign title cannot be empty",
  }),
  message: joi.string().trim().required().messages({
    "any.required": "SMS message content is required",
    "string.empty": "SMS message content cannot be empty",
  }),
  campaignType: joi.string()
    .valid(MESSAGE_TYPES.PROMOTIONAL, MESSAGE_TYPES.TRANSACTIONAL)
    .default(MESSAGE_TYPES.PROMOTIONAL)
    .messages({
      "any.only": "Campaign type must be either PROMOTIONAL or TRANSACTIONAL",
    }),
});

module.exports.validatedCreateSmsCampaign = validator(createSmsCampaignValidationSchema);
