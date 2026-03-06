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
  name: joi.string().required().trim().messages({
    "any.required": "Team name is required",
  }),
  employees: joi.array().items(joi.string().custom(objectId)).min(1).required().messages({
    "array.min": "A team must have at least one employee",
  }),
});

const updateTeamValidationSchema = joi.object({
  name: joi.string().trim(),
  employees: joi.array().items(joi.string().custom(objectId)),
});

module.exports.validatedCreateTeam = validator(createTeamValidationSchema);
module.exports.validatedUpdateTeam = validator(updateTeamValidationSchema);