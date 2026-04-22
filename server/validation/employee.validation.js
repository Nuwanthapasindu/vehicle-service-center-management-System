const joi = require("joi");
const validator = require("./core");
const { USER_ROLES, GENDERS } = require("../util/constants");

const createEmployeeValidationSchema = joi.object({
  // User Model Fields
  name: joi.string().required().min(5).max(50).trim().messages({
    "any.required": "Name is required",
    "string.min": "Name must be at least 5 characters long",
    "string.max": "Name must be at most 50 characters long",
    "string.empty": "Name cannot be empty",
  }),
  mobile: joi
    .string()
    .required()
    .trim()
    .pattern(/^(?:\+94|94|0)?7[0-8]\d{7}$/)
    .messages({
      "string.pattern.base": "Please provide a valid mobile number",
      "any.required": "Mobile number is required",
      "string.empty": "Mobile number cannot be empty",
    }),
  address: joi.string().required().min(5).max(70).trim().messages({
    "any.required": "Address is required",
    "string.empty": "Address cannot be empty",
    "string.min": "Address must be at least 5 characters long",
    "string.max": "Address must be at most 70 characters long",
  }),
  role: joi.string().valid(USER_ROLES.MECHANIC).required().messages({
    "any.required": "Role is required",
    "string.empty": "Role cannot be empty",
    "string.valid": "Role must be a MECHANIC",
  }), //  MECHANIC

  // Auth Model Fields
  userName: joi.string().required().trim().alphanum().min(3).max(20).messages({
    "string.alphanum": "Username must only contain letters and numbers",
    "any.required": "Username is required",
    "string.empty": "Username cannot be empty",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username must be at most 20 characters long",
  }),
  password: joi
    .string()
    .min(8)
    .max(30)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/)
    .required().messages({
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty",
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password must be at most 30 characters long",
      "string.pattern.base": "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character",
    }),

  // Employee Model Fields
  dob: joi.date().required().messages({
    "any.required": "Date of birth is required",
    "string.empty": "Date of birth cannot be empty",
    "date.base": "Date of birth must be a valid date",
  }),
  nic: joi.string()
    .required()
    .trim()
    .pattern(/^(\d{9}[vVxX]|\d{12})$/)
    .messages({
      "any.required": "NIC is required",
      "string.empty": "NIC cannot be empty",
      "string.pattern.base": "NIC must be valid (e.g., 912345678V or 200012345678)",
    }),
  skills: joi.array().items(joi.string()).min(1).required().messages({
    "any.required": "Skills is required",
    "string.empty": "Skills cannot be empty",
    "array.min": "Skills must contain at least one skill",
  }),
  gender: joi.string().required().valid(...Object.values(GENDERS)).messages({
    "any.required": "Gender is required",
    "string.empty": "Gender cannot be empty",
    "string.valid": "Gender must be a valid gender",
  }),
});

const updateEmployeeValidationSchema = joi.object({
  // User Model Fields
  name: joi.string().min(5).max(50).trim().messages({
    "string.min": "Name must be at least 5 characters long",
    "string.max": "Name must be at most 50 characters long",
    "string.empty": "Name cannot be empty",
  }).optional(),

  mobile: joi.string().trim().pattern(/^(?:\+94|94|0)?7[0-8]\d{7}$/).messages({
    "string.pattern.base": "Please provide a valid mobile number",
    "string.empty": "Mobile number cannot be empty",
  }).optional(),

  address: joi.string().min(5).max(70).trim().messages({
    "string.min": "Address must be at least 5 characters long",
    "string.max": "Address must be at most 70 characters long",
    "string.empty": "Address cannot be empty",
  }).optional(),

  role: joi.string().valid(USER_ROLES.MECHANIC).messages({
    "string.empty": "Role cannot be empty",
    "string.valid": "Role must be a MECHANIC",
  }).optional(),

  // Auth Model Fields
  userName: joi.string().trim().alphanum().min(3).max(20).messages({
    "string.alphanum": "Username must only contain letters and numbers",
    "string.empty": "Username cannot be empty",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username must be at most 20 characters long",
  }).optional().empty(""),

  password: joi
    .string()
    .min(8)
    .max(30)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/)
    .optional().messages({
      "string.empty": "Password cannot be empty",
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password must be at most 30 characters long",
      "string.pattern.base": "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character",
    }),

  // Employee Model Fields
  dob: joi.date().messages({
    "string.empty": "Date of birth cannot be empty",
    "date.base": "Date of birth must be a valid date",
  }).optional(),

  nic: joi.string()
    .trim()
    .pattern(/^(\d{9}[vVxX]|\d{12})$/)
    .messages({
      "string.empty": "NIC cannot be empty",
      "string.pattern.base": "NIC must be valid (e.g., 912345678V or 200012345678)",
    })
    .optional(),

  skills: joi.array().items(joi.string()).min(1).optional().messages({
    "string.empty": "Skills cannot be empty",
    "array.min": "Skills must contain at least one skill",
  }),

  gender: joi.string().valid(...Object.values(GENDERS)).optional().messages({
    "string.empty": "Gender cannot be empty",
    "string.valid": "Gender must be a valid gender",
  }),

  isAvailable: joi.boolean().optional(),
});
module.exports.validatedCreateEmployee = validator(createEmployeeValidationSchema);
module.exports.validatedUpdateEmployee = validator(updateEmployeeValidationSchema);