import * as Yup from "yup";

const loginValidationSchema = Yup.object().shape({
  userName: Yup.string()
    .required("Username is required")
    .min(4, "Username must be at least 4 characters long"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long"),
});

const registerValidationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Full name is required"),

  mobile: Yup.string()
    .trim()
    .required("Mobile number is required")
    .matches(
      /^(?:\+94|94|0)?7[0-8]\d{7}$/,
      "Please provide a valid Sri Lankan mobile number (e.g. 0771234567)",
    ),

  address: Yup.string().trim().required("Address is required"),

  userName: Yup.string()
    .trim()
    .required("Username is required")
    .matches(
      /^[a-zA-Z0-9]+$/,
      "Username must only contain letters and numbers",
    ),

  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(30, "Password must be at most 30 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
    ),
});

const resetPasswordValidationSchema = Yup.object().shape({
  otp: Yup.string()
    .trim()
    .required("OTP is required")
    .length(6, "OTP must be exactly 6 digits")
    .matches(/^\d+$/, "OTP must contain only numbers"),

  password: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .max(30, "Password must be at most 30 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
    ),

  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const forgotPasswordValidationSchema = Yup.object().shape({
  mobile: Yup.string()
    .trim()
    .required("Mobile number is required")
    .matches(
      /^(?:\+94|94|0)?7[0-8]\d{7}$/,
      "Please provide a valid Sri Lankan mobile number (e.g. 0771234567)",
    ),
});

export {
  loginValidationSchema,
  registerValidationSchema,
  resetPasswordValidationSchema,
  forgotPasswordValidationSchema,
};

