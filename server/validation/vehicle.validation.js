const joi = require("joi");
const validator = require("./core");

const vehicleAddSchema = joi.object({
  licensePlate: joi.string().required().trim().messages({
    "any.required": "License plate is required",
    "string.empty": "License plate cannot be empty",
  }),
  type: joi.string().valid("CAR", "VAN", "SUV", "JEEP").required().messages({
    "any.required": "Vehicle type is required",
    "any.only": "Invalid vehicle type",
  }),
  make: joi.string().required().trim(),
  model: joi.string().required().trim(),
  image: joi.string().allow("").optional()
});

module.exports.validatedVehicleAdd = validator(vehicleAddSchema);

const vehicleUpdateSchema = joi.object({
  licensePlate: joi.string().trim().messages({
    "string.empty": "License plate cannot be empty",
  }),
  type: joi.string().valid("CAR", "VAN", "SUV", "JEEP").messages({
    "any.only": "Invalid vehicle type",
  }),
  make: joi.string().trim(),
  model: joi.string().trim(),
  image: joi.string().allow("").optional()
});

module.exports.validatedVehicleUpdate = validator(vehicleUpdateSchema);
