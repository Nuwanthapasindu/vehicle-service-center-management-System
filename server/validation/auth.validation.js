const joi = require("joi");
const validator = require("./core");

const registerValidationSchema = joi.object({
  name: joi.string().required().trim().messages({
    "any.required": "Name is required",
    "string.empty": "Name is required",
  }),
  mobile: joi
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
  userName: joi.string().required().trim().alphanum().messages({
    "any.required": "Username is required",
    "string.empty": "Username is required",
    "string.alphanum": "Username must only contain letters and numbers",
  }),
  password: joi
    .string()
    .min(8)
    .max(30)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/,
    )
    .trim()
    .required()
    .messages({
      "any.required": "Password is required",
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password must be at most 30 characters",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      "string.trim": "Password must not contain leading or trailing spaces",
    }),
});
const loginValidationSchema = joi.object({
 userName: joi.string().required().trim().alphanum().messages({
    "any.required": "Username is required",
    "string.empty": "Username is required",
    "string.alphanum": "Username must only contain letters and numbers",
  }),
  password: joi.string().required().trim().messages({
    "any.required": "Password is required",
    "string.empty": "Password is required",
  }),
});
const accountVerificationValidationSchema = joi.object({
  otp: joi.string().required().min(6).max(6).trim().messages({
    "any.required": "OTP is required",
    "string.empty": "OTP is required",
    "string.min": "OTP must be at least 6 characters",
    "string.max": "OTP must be at most 6 characters",
    "string.trim": "OTP must not contain leading or trailing spaces",
  }),
});

const resendAccountVerificationValidationSchema = joi.object({
 mobile: joi
    .string()
    .required()
    .trim()
    .pattern(/^(?:\+94|94|0)?7[0-8]\d{7}$/)
    .messages({
      "any.required": "Mobile number is required",
      "string.empty": "Mobile number cannot be empty",
      "string.pattern.base": "Please provide a valid mobile number",
    }),
});

const resetPasswordValidationSchema = joi.object({
  otp: joi.string().required().min(6).max(6).trim().messages({
    "any.required": "OTP is required",
    "string.empty": "OTP is required",
    "string.min": "OTP must be at least 6 characters",
    "string.max": "OTP must be at most 6 characters",
    "string.trim": "OTP must not contain leading or trailing spaces",
  }),
  password: joi
    .string()
    .min(8)
    .max(30)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/
    )
    .trim()
    .required()
    .messages({
      "any.required": "Password is required",
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password must be at most 30 characters",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      "string.trim": "Password must not contain leading or trailing spaces",
    }),
});

module.exports.validatedAccountVerification = validator(
  accountVerificationValidationSchema,
);
module.exports.validatedRegister = validator(registerValidationSchema);
module.exports.validatedLogin = validator(loginValidationSchema);
module.exports.validatedResetPassword = validator(
  resetPasswordValidationSchema,
);
module.exports.validatedResendAccountVerification = validator(
  resendAccountVerificationValidationSchema,
);
