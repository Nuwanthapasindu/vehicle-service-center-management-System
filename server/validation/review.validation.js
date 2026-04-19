const Joi = require("joi");
const validator = require("./core");

const reviewAddSchema = Joi.object({
  bookingId: Joi.string().required().messages({
    "any.required": "Booking ID is required",
  }),
  rating: Joi.number().min(1).max(5).required().messages({
    "number.min": "Rating must be at least 1",
    "number.max": "Rating must be at most 5",
    "any.required": "Rating is required",
  }),
  comment: Joi.string().allow("").optional(),
});

const reviewUpdateSchema = Joi.object({
  rating: Joi.number().min(1).max(5).optional().messages({
    "number.min": "Rating must be at least 1",
    "number.max": "Rating must be at most 5",
  }),
  comment: Joi.string().allow("").optional(),
});

const adminReplySchema = Joi.object({
  reply: Joi.string().trim().required().messages({
    "string.base": "Admin reply must be a string",
    "string.empty": "Admin reply cannot be empty",
    "any.required": "Admin reply is required",
  }),
});

const reviewApprovalSchema = Joi.object({
  isApproved: Joi.boolean().required().messages({
    "boolean.base": "Approval status must be a boolean",
    "any.required": "Approval status is required",
  }),
});

module.exports.validatedReviewAdd = validator(reviewAddSchema);
module.exports.validatedReviewUpdate = validator(reviewUpdateSchema);
module.exports.validatedAdminReply = validator(adminReplySchema);
module.exports.validatedReviewApproval = validator(reviewApprovalSchema);
