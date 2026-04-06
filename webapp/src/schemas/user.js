import * as Yup from "yup";

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const profileValidationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full name is required"),
    phoneNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
        .required("Phone number is required"),
    address: Yup.string().required("Address is required"),
    newPassword: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(passwordRules, "Password must include uppercase, number and symbol")
        .notRequired(),
    confirmPassword: Yup.string()
        .when("newPassword", {
            is: (val) => val && val.length > 0,
            then: (schema) => schema
                .required("Please confirm your new password")
                .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
            otherwise: (schema) => schema.notRequired(),
        }),
    currentPassword: Yup.string()
        .when("newPassword", {
            is: (val) => val && val.length > 0,
            then: (schema) => schema.required("Current password is required to change to a new one"),
            otherwise: (schema) => schema.notRequired(),
        }),
});

export { profileValidationSchema };
