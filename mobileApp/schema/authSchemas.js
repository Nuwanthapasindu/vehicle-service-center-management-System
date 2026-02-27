import * as Yup from "yup";

export const loginValidationSchema = Yup.object().shape({
  userName: Yup.string().required("User name is required"),
  password: Yup.string()
    .strict(true)
    .trim("Password must not contain leading or trailing spaces")
    .min(8, "Password must be at least 8 characters")
    .max(30, "Password must be at most 30 characters")
    .required("Password is required"),
});

export const forgotPasswordValidationSchema = Yup.object().shape({
  mobileNumber: Yup.string()
    .strict(true)
    .trim("Mobile number cannot contain leading or trailing spaces")
    .matches(
      /^(?:\+94|94|0)?7[0-8]\d{7}$/,
      "Please provide a valid mobile number",
    )
    .required("Mobile number is required"),
});

export const passwordResetValidationSchema = Yup.object().shape({
  newPassword: Yup.string()
    .strict(true)
    .trim("Password must not contain leading or trailing spaces")
    .min(8, "Password must be at least 8 characters")
    .max(30, "Password must be at most 30 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});
