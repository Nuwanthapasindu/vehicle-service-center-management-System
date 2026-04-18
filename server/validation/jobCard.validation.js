const Joi = require("joi");
// ===============================
// CREATE JOB CARD SCHEMA
// ===============================
exports.createJobCardSchema = Joi.object({
  booking: Joi.string().length(24).hex().required().messages({
    "string.length": "Booking ID must be a valid ObjectId",
    "any.required": "Booking ID is required"
  }),

  selectedPackage: Joi.string().length(24).hex().required().messages({
    "string.length": "Package ID must be a valid ObjectId",
    "any.required": "Package is required"
  }),

  milageCount: Joi.number().integer().min(0).required().messages({
    "number.base": "Mileage must be a number",
    "number.min": "Mileage cannot be negative",
    "any.required": "Mileage is required"
  })
});


// ===============================
// ASSIGN TEAM SCHEMA
// ===============================
exports.assignTeamSchema = Joi.object({
  jobCardId: Joi.string().length(24).hex().required().messages({
    "string.length": "JobCard ID must be valid",
    "any.required": "JobCard ID is required"
  }),

  teamId: Joi.string().length(24).hex().required().messages({
    "string.length": "Team ID must be valid",
    "any.required": "Team ID is required"
  })
});

