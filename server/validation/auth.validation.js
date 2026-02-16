const joi = require("joi");
const validator = require("./core");

const registerValidationSchema = joi.object({
  email: joi.string().email().required().trim().messages({
    "any.required": "Email is required",
    "string.email": "Email is not valid",
    "string.empty": "Email is required",
    "string.trim": "Email must not contain leading or trailing spaces",
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
const loginValidationSchema = joi.object({
  email: joi.string().email().required().trim().messages({
    "any.required": "Email is required",
    "string.email": "Email is not valid",
    "string.empty": "Email is required",
    "string.trim": "Email must not contain leading or trailing spaces",
  }),
  password: joi.string().min(8).max(30).trim().required().messages({
    "any.required": "Password is required",
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
    "string.max": "Password must be at most 30 characters",
    "string.trim": "Password must not contain leading or trailing spaces",
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
  email: joi.string().email().required().trim().messages({
    "any.required": "Email is required",
    "string.email": "Email is not valid",
    "string.empty": "Email is required",
    "string.trim": "Email must not contain leading or trailing spaces",
  }),
});

const resetPasswordValidationSchema = joi.object({
  passwordRestToken: joi.string().required().min(20).trim().messages({
    "any.required": "Password reset token is required",
    "string.empty": "Password reset token is required",
    "string.min": "Password reset token must be at least 20 characters",
    "string.trim":
      "Password reset token must not contain leading or trailing spaces",
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
  accountVerificationValidationSchema
);
module.exports.validatedRegister = validator(registerValidationSchema);
module.exports.validatedLogin = validator(loginValidationSchema);
module.exports.validatedResetPassword = validator(
  resetPasswordValidationSchema
);
module.exports.validatedResendAccountVerification = validator(
  resendAccountVerificationValidationSchema
);
