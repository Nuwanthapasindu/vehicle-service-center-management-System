const joi = require("joi");
const validator = require("./core");
const { VEHICLE_TYPES } = require("../util/constants");

// Validation schema for creating a new package
const createPackageValidationSchema = joi.object({
  name: joi.string().required().trim().min(2).max(100).messages({
    "any.required": "Package name is required",
    "string.empty": "Package name cannot be empty",
    "string.min": "Package name must be at least 2 characters long",
    "string.max": "Package name must be at most 100 characters long",
    "string.trim": "Package name must not contain leading or trailing spaces",
  }),
  applicableVehicalModels: joi
    .array()
    .items(
      joi
        .string()
        .trim()
        .min(1)
        .max(100)
        .messages({
          "string.empty": "Applicable vehicle model cannot be empty",
          "string.trim":
            "Applicable vehicle model must not contain leading or trailing spaces",
          "string.min": "Applicable vehicle model must be at least 1 character long",
          "string.max": "Applicable vehicle model must be at most 100 characters long",
        }))
    .unique()
    .min(1)
    .required()
    .messages({
      "any.required": "At least one applicable vehicle model is required",
      "array.min": "At least one applicable vehicle model is required",
      "array.unique": "Applicable vehicle models must be unique",
    }),
  description: joi.string().trim().max(1000).optional().messages({
    "string.max": "Description must be at most 1000 characters long",
    "string.trim": "Description must not contain leading or trailing spaces",
  }),
  pricingTiers: joi
    .array()
    .items(
      joi.object({
        name: joi.string().trim().required().messages({
          "any.required": "Pricing tier name is required",
          "string.empty": "Pricing tier name cannot be empty",
        }),
        price: joi.number().positive().precision(2).required().messages({
          "any.required": "Price is required for each pricing tier",
          "number.positive": "Price must be a positive number",
          "number.base": "Price must be a valid number",
        }),
      }),
    )
    .min(1)
    .required()
    .messages({
      "any.required": "At least one pricing tier entry is required",
      "array.min": "At least one pricing tier entry is required",
    }),
  servicesIncluded: joi
    .array()
    .items(
      joi.string().hex().length(24).messages({
        "string.hex":
          "Each included service ID must be a valid hexadecimal string",
        "string.length":
          "Each included service ID must be exactly 24 characters long",
      }),
    ).min(1).required().messages({
      "any.required": "At least one included service is required",
      "array.min": "At least one included service is required",
    }),
  image: joi.string().hex().length(24).optional().messages({
    "string.hex": "Image ID must be a valid hexadecimal string",
    "string.length": "Image ID must be exactly 24 characters long",
  }),
  isPublished: joi.boolean().optional().default(true).messages({
    "boolean.base": "isPublished must be a boolean value",
  }),
});

// Validation schema for updating a package
const updatePackageValidationSchema = joi.object({
  name: joi.string().trim().min(2).max(100).optional().messages({
    "string.empty": "Package name cannot be empty",
    "string.min": "Package name must be at least 2 characters long",
    "string.max": "Package name must be at most 100 characters long",
    "string.trim": "Package name must not contain leading or trailing spaces",
  }),
  applicableVehicalModels: joi
    .array()
    .items(
      joi
        .string()
        .trim()
        .min(1)
        .max(100)
        .messages({
          "string.empty": "Applicable vehicle model cannot be empty",
          "string.trim":
            "Applicable vehicle model must not contain leading or trailing spaces",
          "string.min": "Applicable vehicle model must be at least 1 character long",
          "string.max": "Applicable vehicle model must be at most 100 characters long",
        })
    )
    .min(1)
    .optional()
    .messages({
      "array.min":
        "At least one applicable vehicle model is required if providing this field",
    }),
  description: joi.string().trim().max(1000).optional().messages({
    "string.max": "Description must be at most 1000 characters long",
    "string.trim": "Description must not contain leading or trailing spaces",
  }),
  pricingTiers: joi
    .array()
    .items(
      joi.object({
        name: joi.string().trim().required().messages({
          "any.required": "Pricing tier name is required",
          "string.empty": "Pricing tier name cannot be empty",
        }),
        price: joi.number().positive().precision(2).required().messages({
          "any.required": "Price is required for each pricing tier",
          "number.positive": "Price must be a positive number",
          "number.base": "Price must be a valid number",
        }),
      }),
    )
    .min(1)
    .optional()
    .messages({
      "array.min":
        "At least one pricing tier entry is required if providing this field",
    }),
  servicesIncluded: joi
    .array()
    .items(
      joi.string().hex().length(24).messages({
        "string.hex":
          "Each included service ID must be a valid hexadecimal string",
        "string.length":
          "Each included service ID must be exactly 24 characters long",
      }),
    )
    .optional(),
  image: joi.string().hex().length(24).optional().messages({
    "string.hex": "Image ID must be a valid hexadecimal string",
    "string.length": "Image ID must be exactly 24 characters long",
  }),
  isPublished: joi.boolean().optional().messages({
    "boolean.base": "isPublished must be a boolean value",
  }),
});

// Validation schema for querying packages with filters
const queryPackageValidationSchema = joi
  .object({
    name: joi.string().trim().min(1).max(100).optional().messages({
      "string.min": "Search name must be at least 1 character long",
      "string.max": "Search name must be at most 100 characters long",
      "string.trim": "Search name must not contain leading or trailing spaces",
    }),
    model: joi.string().optional(),
    minPrice: joi.number().positive().precision(2).optional().messages({
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
            "Maximum price must be greater than minimum price",
          );
        }
        return value;
      }),
    page: joi.number().integer().positive().optional().default(1).messages({
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
    isPublished: joi.boolean().optional().messages({
      "boolean.base": "isPublished must be a boolean value",
    }),
  })
  .custom((value, helpers) => {
    // Validate that minPrice is not greater than maxPrice overall
    if (value.minPrice && value.maxPrice && value.minPrice >= value.maxPrice) {
      return helpers.message("Minimum price must be less than maximum price");
    }
    return value;
  });

// Export all validation functions wrapped via validator core
module.exports.validatedCreatePackage = validator(
  createPackageValidationSchema,
);
module.exports.validatedUpdatePackage = validator(
  updatePackageValidationSchema,
);
module.exports.validatedQueryPackages = validator(queryPackageValidationSchema);
