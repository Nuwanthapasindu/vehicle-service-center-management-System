const joi = require("joi");
const validator = require("./core");
const { VEHICLE_TYPES } = require("../util/constants");

const createVehicleSchema = joi.object({
  licensePlate: joi.string().required().trim().messages({
    "any.required": "License plate is required",
    "string.empty": "License plate is required",
  }),
  type: joi
    .string()
    .valid(...Object.values(VEHICLE_TYPES))
    .required()
    .messages({
      "any.required": "Vehicle type is required",
      "any.only": "Invalid vehicle type",
    }),
  make: joi.string().required().trim().messages({
    "any.required": "Make is required",
    "string.empty": "Make is required",
  }),
  model: joi.string().required().trim().messages({
    "any.required": "Model is required",
    "string.empty": "Model is required",
  }),
  image: joi.string().optional().allow(null, ""),
});

module.exports.validateCreateVehicle = validator(createVehicleSchema);
