/*const joi = require("joi");
const validator = require("./core");

const createJobCardSchema = joi.object({
    booking: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    selectedPackage: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    milageCount: joi.number().min(0).default(0).required()
});

const assignTeamSchema = joi.object({
    jobCardId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    teamId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
});

module.exports.validatedCreateJobCard = validator(createJobCardSchema);
module.exports.validatedAssignTeam = validator(assignTeamSchema);*/

const validator = require("./core");
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

