const joi = require("joi");
const validator = require("./core");

// Helper for MongoDB ObjectId validation
const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-H]{24}$/)) {
    return helpers.message("Invalid Employee ID format");
  }
  return value;
};

const createTeamValidationSchema = joi.object({
  name: joi.string().required().trim().min(3).max(20).messages({
    "any.required": "Team name is required",
    "string.empty": "Team name cannot be empty",
    "string.min": "Team name must be at least 3 characters long",
    "string.max": "Team name must be at most 20 characters long",
  }),
  employees: joi.array().items(joi.string().custom(objectId)).min(1).unique().required().messages({
    "array.min": "A team must have at least one employee",
    "any.required": "Employees is required",
    "string.empty": "Employees cannot be empty",
    "array.unique": "Employee ID already exists",
  }),
});

const updateTeamValidationSchema = joi.object({
  name: joi.string().trim().min(3).max(20).optional().messages({
    "string.min": "Team name must be at least 3 characters long",
    "string.max": "Team name must be at most 20 characters long",
    "string.empty": "Team name cannot be empty",
  }),
  employees: joi.array().items(joi.string().custom(objectId)).min(1).unique().optional().messages({
    "array.min": "A team must have at least one employee",
    "string.empty": "Employees cannot be empty",
    "array.unique": "Employee ID already exists",
  }),
});

module.exports.validatedCreateTeam = validator(createTeamValidationSchema);
module.exports.validatedUpdateTeam = validator(updateTeamValidationSchema);