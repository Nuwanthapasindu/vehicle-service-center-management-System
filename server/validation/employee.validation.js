const joi = require("joi");
const validator = require("./core");

const createEmployeeValidationSchema = joi.object({
  // User Model Fields
  name: joi.string().required().trim().messages({
    "any.required": "Name is required",
  }),
  mobile: joi
    .string()
    .required()
    .trim()
    .pattern(/^(?:\+94|94|0)?7[0-8]\d{7}$/)
    .messages({
      "string.pattern.base": "Please provide a valid mobile number",
    }),
  address: joi.string().required().trim(),
  role: joi.string().required(), // e.g., MECHANIC, ADMIN

  // Auth Model Fields
  userName: joi.string().required().trim().alphanum().messages({
    "string.alphanum": "Username must only contain letters and numbers",
  }),
  password: joi
    .string()
    .min(8)
    .max(30)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/)
    .required(),

  // Employee Model Fields
  dob: joi.date().required().messages({
    "any.required": "Date of birth is required",
  }),
  nic: joi.string().required().trim().messages({
    "any.required": "NIC is required",
  }),
  skills: joi.array().items(joi.string()).min(1).required(),
  gender: joi.string().required(),
});

const updateEmployeeValidationSchema = joi.object({
  name: joi.string().trim(),
  mobile: joi.string().trim().pattern(/^(?:\+94|94|0)?7[0-8]\d{7}$/),
  address: joi.string().trim(),
  dob: joi.date(),
  nic: joi.string().trim(),
  skills: joi.array().items(joi.string()),
  gender: joi.string(),

  // NEW FIELDS
  userName: joi.string().trim().alphanum().messages({
    "string.alphanum": "Username must only contain letters and numbers",
  }),

  password: joi
    .string()
    .min(8)
    .max(10)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).*$/)
});

module.exports.validatedCreateEmployee = validator(createEmployeeValidationSchema);
module.exports.validatedUpdateEmployee = validator(updateEmployeeValidationSchema);