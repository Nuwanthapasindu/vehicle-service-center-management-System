const joi = require("joi");
const validator = require("./core");

// Validation schema for creating a new booking
const createBookingValidationSchema = joi.object({
  vehicle: joi.string().hex().length(24).required().messages({
    "any.required": "Vehicle ID is required",
    "string.empty": "Vehicle ID cannot be empty",
    "string.hex": "Vehicle ID must be a valid hexadecimal string",
    "string.length": "Vehicle ID must be exactly 24 characters long",
  }),
  slot: joi.string().hex().length(24).required().messages({
    "any.required": "Timeslot ID is required",
    "string.empty": "Timeslot ID cannot be empty",
    "string.hex": "Timeslot ID must be a valid hexadecimal string",
    "string.length": "Timeslot ID must be exactly 24 characters long",
  }),
  date: joi.string().required().messages({
    "any.required": "Booking date is required",
    "string.base": "Booking date must be a valid date string",
  }),

  specialNote: joi.string().allow("").max(500).optional().messages({
    "string.max": "Special note must be at most 500 characters long",
  }),
});

// Export all validation functions
module.exports.validatedCreateBooking = validator(createBookingValidationSchema);
