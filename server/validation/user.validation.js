const joi = require("joi");
const validator = require("./core");

const updateProfileSchema = joi.object({
  fullName: joi.string().required().trim().messages({
    "any.required": "Name is required",
    "string.empty": "Name is required",
  }),
  phoneNumber: joi
    .string()
    .required()
    .trim()
    .pattern(/^(?:\+94|94|0)?7[0-8]\d{7}$/)
    .messages({
      "any.required": "Mobile number is required",
      "string.empty": "Mobile number cannot be empty",
      "string.pattern.base": "Please provide a valid mobile number",
    }),
  address: joi.string().required().trim().messages({
    "any.required": "Address is required",
    "string.empty": "Address is required",
  }),
  currentPassword: joi.string().trim().when("newPassword", {
    is: joi.string().min(1).required(),
    then: joi.required().messages({
      "any.required": "Current password is required to change password",
      "string.empty": "Current password is required to change password",
    }),
    otherwise: joi.optional().allow(""),
  }),
  newPassword: joi
    .string()
    .allow("")
    .optional()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/
    )
    .trim()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
});

module.exports.validatedUpdateProfile = validator(updateProfileSchema);
