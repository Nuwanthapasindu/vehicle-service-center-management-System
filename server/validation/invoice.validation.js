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
    .optional()
    .messages({
      "any.required": "Selected package is required",
    }),

  additionalItems: Joi.array()
    .items(
      Joi.object({
        item: Joi.string().length(24).hex().required(),
        qty: Joi.number().integer().min(1).required(),
        sellingPrice: Joi.number().min(0).required(),
      }),
    )
    .optional(),

  additionalServices: Joi.array()
    .items(
      Joi.object({
        service: Joi.string().length(24).hex().required(),
        charge: Joi.number().min(0).required(),
      }),
    )
    .optional(),
})
  .xor("jobCard", "customer")
  .messages({
    "object.xor": "Cannot provide both JobCard and Customer. Choose one.",
    "object.missing": "Must provide either JobCard or Customer.",
  });

const addInvoiceItemSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(constants.INVOICE_UPDATE_TYPES))
    .required()
    .messages({
      "any.only": "Type must be either ITEM or SERVICE",
      "any.required": "Type is required",
    }),
  data: Joi.object()
    .when("type", {
      is: constants.INVOICE_UPDATE_TYPES.ITEM,
      then: Joi.object({
        item: Joi.string().length(24).hex().required().messages({
          "string.base": "Item ID must be a string",
          "string.length": "Item ID must be a valid 24-character ObjectId",
          "string.hex": "Item ID must be a valid hex string",
          "string.empty": "Item ID cannot be empty",
          "any.required": "Item ID is required",
        }),
        qty: Joi.number().min(0.1).required().messages({
          "number.base": "Quantity must be a number",
          "number.min": "Quantity must be at least 0.1",
          "any.required": "Quantity is required",
        }),
        sellingPrice: Joi.number().min(0).required().messages({
          "number.base": "Selling price must be a number",
          "number.min": "Selling price cannot be negative",
          "any.required": "Selling price is required",
        }),
        itemType: Joi.string()
          .valid(...Object.values(constants.INVOICE_ITEM_TYPES))
          .default(constants.INVOICE_ITEM_TYPES.OTHER)
          .optional()
          .messages({
            "any.only": "Invalid item type",
          }),
      })
        .required()
        .messages({
          "any.required": "Item data details are required for type ITEM",
        }),
    })
    .when("type", {
      is: constants.INVOICE_UPDATE_TYPES.SERVICE,
      then: Joi.object({
        service: Joi.string().length(24).hex().required().messages({
          "string.base": "Service ID must be a string",
          "string.length": "Service ID must be a valid 24-character ObjectId",
          "string.hex": "Service ID must be a valid hex string",
          "string.empty": "Service ID cannot be empty",
          "any.required": "Service ID is required",
        }),
        charge: Joi.number().min(0).required().messages({
          "number.base": "Service charge must be a number",
          "number.min": "Service charge cannot be negative",
          "any.required": "Service charge is required",
        }),
      })
        .required()
        .messages({
          "any.required": "Service data details are required for type SERVICE",
        }),
    }),
});

const removeInvoiceItemSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(constants.INVOICE_UPDATE_TYPES))
    .required()
    .messages({
      "any.only": "Type must be either ITEM or SERVICE",
      "any.required": "Type is required",
    }),
  targetId: Joi.string().length(24).hex().required().messages({
    "string.base": "Target ID must be a string",
    "string.length": "Target ID must be a valid 24-character ObjectId",
    "string.hex": "Target ID must be a valid hex string",
    "string.empty": "Target ID cannot be empty",
    "any.required": "Target ID to remove is required",
  }),
});

module.exports.validatedAddInvoiceItem = validator(addInvoiceItemSchema);
module.exports.validatedRemoveInvoiceItem = validator(removeInvoiceItemSchema);
module.exports.validatedCreateInvoice = validator(createInvoiceSchema);
