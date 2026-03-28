const joi = require("joi");
const validator = require("./core");
const { VEHICLE_TYPES } = require("../util/constants");

const vehicleAddSchema = joi.object({
  licensePlate: joi.string().required().trim().messages({
    "any.required": "License plate is required",
    "string.empty": "License plate cannot be empty",
  }),
  type: joi.string().valid(...Object.values(VEHICLE_TYPES)).required().messages({
    "any.required": "Vehicle type is required",
    "any.only": "Invalid vehicle type",
  }),
  make: joi.string().required().trim().messages({
    "any.required": "Vehicle make is required",
    "string.empty": "Vehicle make cannot be empty",
  }),
  model: joi.string().required().trim().messages({
    "any.required": "Vehicle model is required",
    "string.empty": "Vehicle model cannot be empty",
  }),
  image: joi.any().optional(),
});

module.exports.validatedVehicleAdd = validator(vehicleAddSchema);

const vehicleUpdateSchema = joi.object({
  licensePlate: joi.string().trim().messages({
    "string.empty": "License plate cannot be empty",
  }),
  type: joi.string().valid(...Object.values(VEHICLE_TYPES)).messages({
    "any.only": "Invalid vehicle type",
  }),
  make: joi.string().trim().messages({
    "string.empty": "Vehicle make cannot be empty",
  }),
  model: joi.string().trim().messages({
    "string.empty": "Vehicle model cannot be empty",
  }),
  image: joi.any().optional(),
});

module.exports.validatedVehicleUpdate = validator(vehicleUpdateSchema);
