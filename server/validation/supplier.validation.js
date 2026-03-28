const joi = require("joi");
const validator = require("./core");

// Validation schema for creating a new supplier
const createSupplierValidationSchema = joi.object({
  companyName: joi.string().required().trim().min(2).max(100).messages({
    "any.required": "Company name is required",
    "string.empty": "Company name cannot be empty",
  }),
  companyMobile: joi.array().items(
    joi.string().length(10).pattern(/^[0-9]+$/).messages({
      "string.length": "Mobile number must be exactly 10 digits",
      "string.pattern.base": "Mobile number can only contain digits",
    })
  ).optional(),
  agentName: joi.string().trim().max(100).optional().allow(""),
  agentMobile: joi.array().items(
    joi.string().length(10).pattern(/^[0-9]+$/).messages({
      "string.length": "Mobile number must be exactly 10 digits",
      "string.pattern.base": "Mobile number can only contain digits",
    })
  ).optional(),
  items: joi.array().items(joi.string().trim()).optional(),
});

// Validation schema for updating a supplier
const updateSupplierValidationSchema = joi.object({
  companyName: joi.string().trim().min(2).max(100).optional().messages({
    "string.empty": "Company name cannot be empty",
  }),
  companyMobile: joi.array().items(
    joi.string().length(10).pattern(/^[0-9]+$/).messages({
      "string.length": "Mobile number must be exactly 10 digits",
      "string.pattern.base": "Mobile number can only contain digits",
    })
  ).optional(),
  agentName: joi.string().trim().max(100).optional().allow(""),
  agentMobile: joi.array().items(
    joi.string().length(10).pattern(/^[0-9]+$/).messages({
      "string.length": "Mobile number must be exactly 10 digits",
      "string.pattern.base": "Mobile number can only contain digits",
    })
  ).optional(),
  items: joi.array().items(joi.string().trim()).optional(),
});

module.exports.validatedCreateSupplier = validator(createSupplierValidationSchema);
module.exports.validatedUpdateSupplier = validator(updateSupplierValidationSchema);