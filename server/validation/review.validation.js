const Joi = require("joi");

const validateReviewAdd = (data) => {
  const schema = Joi.object({
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

  return schema.validate(data);
};

const validateReviewUpdate = (data) => {
  const schema = Joi.object({
    rating: Joi.number().min(1).max(5).optional().messages({
      "number.min": "Rating must be at least 1",
      "number.max": "Rating must be at most 5",
    }),
    comment: Joi.string().allow("").optional(),
  });

  return schema.validate(data);
};

module.exports = {
  validateReviewAdd,
  validateReviewUpdate
};
