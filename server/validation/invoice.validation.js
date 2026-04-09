const Joi = require("joi");
const validator = require("./core");
const constants = require("../util/constants");

const createInvoiceSchema = Joi.object({
  jobCard: Joi.string().length(24).hex().optional().messages({
    "string.length": "JobCard must be a valid ObjectId",
    "string.hex": "JobCard must be a valid hex string",
    "string.empty": "JobCard cannot be empty",
    
  }),

  customer: Joi.string().length(24).hex().optional().messages({
    "string.length": "Customer must be a valid ObjectId",
    "string.hex": "Customer must be a valid hex string",
    "string.empty": "Customer cannot be empty",
  }),

  selectedPackage: Joi.object({
    package: Joi.string().length(24).hex().optional().messages({
      "string.length": "Package ID must be a valid ObjectId",
      "string.empty": "Package cannot be empty",
    }),
    selectedPackageTier: Joi.object({
      name: Joi.string().trim().min(3).max(100).required().messages({
        "string.base": "Tier name must be a string",
        "string.empty": "Tier name cannot be empty",
        "string.min": "Tier name must be at least 3 characters long",
        "string.max": "Tier name cannot exceed 100 characters",
        "any.required": "Tier name is required",
      }),
      price: Joi.number().min(0).required().messages({
        "number.base": "Tier price must be a number",
        "number.min": "Tier price cannot be negative",
        "any.required": "Tier price is required",
      }),
    })
      .required()
      .messages({
        "any.required": "Selected package tier details are required",
      }),
  })
    .required()
    .messages({
      "any.required": "Selected package is required",
    }),
})
  .xor("jobCard", "customer")
  .messages({
    "object.xor": "Cannot provide both JobCard and Customer. Choose one.",
    "object.missing": "Must provide either JobCard or Customer.",
  });

module.exports.validatedCreateInvoice = validator(createInvoiceSchema);
