const joi = require("joi");
const validator = require("./core");
const { VEHICLE_TYPES } = require("../util/constants");

// Validation schema for creating a new service
const createServiceValidationSchema = joi.object({
  name: joi.string().required().trim().min(2).max(100).messages({
    "any.required": "Service name is required",
    "string.empty": "Service name cannot be empty",
    "string.min": "Service name must be at least 2 characters long",
    "string.max": "Service name must be at most 100 characters long",
    "string.trim": "Service name must not contain leading or trailing spaces",
  }),
  description: joi.string().trim().max(500).optional().messages({
    "string.max": "Description must be at most 500 characters long",
    "string.trim": "Description must not contain leading or trailing spaces",
  }),
  prices: joi
    .array()
    .items(
      joi.object({
        model: joi
          .string()
          .valid(...Object.values(VEHICLE_TYPES))
          .required()
          .messages({
            "any.required": "Vehicle model is required for each price entry",
            "any.only": `Vehicle model must be one of: ${Object.values(
              VEHICLE_TYPES
            ).join(", ")}`,
          }),
        price: joi
          .number()
          .positive()
          .precision(2)
          .required()
          .messages({
            "any.required": "Price is required for each price entry",
            "number.positive": "Price must be a positive number",
            "number.base": "Price must be a valid number",
          }),
      })
    )
    .min(1)
    .required()
    .messages({
      "any.required": "At least one price entry is required",
      "array.min": "At least one price entry is required",
    }),
  image: joi
    .string()
    .hex()
    .length(24)
    .optional()
    .messages({
      "string.hex": "Image ID must be a valid hexadecimal string",
      "string.length": "Image ID must be exactly 24 characters long",
    }),
});

// Validation schema for updating a service
const updateServiceValidationSchema = joi.object({
  name: joi.string().trim().min(2).max(100).optional().messages({
    "string.empty": "Service name cannot be empty",
    "string.min": "Service name must be at least 2 characters long",
    "string.max": "Service name must be at most 100 characters long",
    "string.trim": "Service name must not contain leading or trailing spaces",
  }),
  description: joi.string().trim().max(500).optional().messages({
    "string.max": "Description must be at most 500 characters long",
    "string.trim": "Description must not contain leading or trailing spaces",
  }),
  prices: joi
    .array()
    .items(
      joi.object({
        model: joi
          .string()
          .valid(...Object.values(VEHICLE_TYPES))
          .required()
          .messages({
            "any.required": "Vehicle model is required for each price entry",
            "any.only": `Vehicle model must be one of: ${Object.values(
              VEHICLE_TYPES
            ).join(", ")}`,
          }),
        price: joi
          .number()
          .positive()
          .precision(2)
          .required()
          .messages({
            "any.required": "Price is required for each price entry",
            "number.positive": "Price must be a positive number",
            "number.base": "Price must be a valid number",
          }),
      })
    )
    .min(1)
    .optional()
    .messages({
      "array.min": "At least one price entry is required",
    }),
  image: joi
    .string()
    .hex()
    .length(24)
    .optional()
    .messages({
      "string.hex": "Image ID must be a valid hexadecimal string",
      "string.length": "Image ID must be exactly 24 characters long",
    }),
});

// Validation schema for querying services with filters
const queryServiceValidationSchema = joi.object({
  name: joi.string().trim().min(1).max(100).optional().messages({
    "string.min": "Search name must be at least 1 character long",
    "string.max": "Search name must be at most 100 characters long",
    "string.trim": "Search name must not contain leading or trailing spaces",
  }),
  model: joi
    .string()
    .valid(...Object.values(VEHICLE_TYPES))
    .optional()
    .messages({
      "any.only": `Vehicle model must be one of: ${Object.values(
        VEHICLE_TYPES
      ).join(", ")}`,
    }),
  minPrice: joi
    .number()
    .positive()
    .precision(2)
    .optional()
    .messages({
      "number.positive": "Minimum price must be a positive number",
      "number.base": "Minimum price must be a valid number",
    }),
  maxPrice: joi
    .number()
    .positive()
    .precision(2)
    .optional()
    .messages({
      "number.positive": "Maximum price must be a positive number",
      "number.base": "Maximum price must be a valid number",
    })
    .custom((value, helpers) => {
      const minPrice = helpers.prefs.context?.minPrice;
      if (minPrice && value <= minPrice) {
        return helpers.message(
          "Maximum price must be greater than minimum price"
        );
      }
      return value;
    }),
  page: joi
    .number()
    .integer()
    .positive()
    .optional()
    .default(1)
    .messages({
      "number.integer": "Page must be a whole number",
      "number.positive": "Page must be a positive number",
      "number.base": "Page must be a valid number",
    }),
  limit: joi
    .number()
    .integer()
    .positive()
    .max(100)
    .optional()
    .default(10)
    .messages({
      "number.integer": "Limit must be a whole number",
      "number.positive": "Limit must be a positive number",
      "number.base": "Limit must be a valid number",
      "number.max": "Limit cannot exceed 100 items per page",
    }),
  sortBy: joi
    .string()
    .valid("name", "createdAt", "updatedAt")
    .optional()
    .default("createdAt")
    .messages({
      "any.only": "Sort by must be one of: name, createdAt, updatedAt",
    }),
  sortOrder: joi
    .string()
    .valid("asc", "desc")
    .optional()
    .default("desc")
    .messages({
      "any.only": "Sort order must be either 'asc' or 'desc'",
    }),
}).custom((value, helpers) => {
  // Validate that minPrice is not greater than maxPrice
  if (value.minPrice && value.maxPrice && value.minPrice >= value.maxPrice) {
    return helpers.message("Minimum price must be less than maximum price");
  }
  return value;
});

// Validation schema for bulk price updates
const bulkPriceUpdateValidationSchema = joi.object({
  serviceIds: joi
    .array()
    .items(
      joi
        .string()
        .hex()
        .length(24)
        .messages({
          "string.hex": "Each service ID must be a valid hexadecimal string",
          "string.length": "Each service ID must be exactly 24 characters long",
        })
    )
    .min(1)
    .required()
    .messages({
      "any.required": "Service IDs array is required",
      "array.min": "At least one service ID is required",
    }),
  priceUpdates: joi
    .array()
    .items(
      joi.object({
        model: joi
          .string()
          .valid(...Object.values(VEHICLE_TYPES))
          .required()
          .messages({
            "any.required": "Vehicle model is required for each price update",
            "any.only": `Vehicle model must be one of: ${Object.values(
              VEHICLE_TYPES
            ).join(", ")}`,
          }),
        newPrice: joi
          .number()
          .positive()
          .precision(2)
          .required()
          .messages({
            "any.required": "New price is required for each price update",
            "number.positive": "New price must be a positive number",
            "number.base": "New price must be a valid number",
          }),
      })
    )
    .min(1)
    .required()
    .messages({
      "any.required": "Price updates array is required",
      "array.min": "At least one price update is required",
    }),
});

// Export all validation functions
module.exports.validatedCreateService = validator(createServiceValidationSchema);
module.exports.validatedUpdateService = validator(updateServiceValidationSchema);
module.exports.validatedQueryServices = validator(queryServiceValidationSchema);
module.exports.validatedBulkPriceUpdate = validator(
  bulkPriceUpdateValidationSchema
);