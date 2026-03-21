import * as Yup from "yup";

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const profileValidationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full name is required"),
    phoneNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
        .required("Phone number is required"),
    address: Yup.string().required("Address is required"),
    currentPassword: Yup.string(),
    newPassword: Yup.string()
        .when('currentPassword', {
            is: (val) => val && val.length > 0,
            then: (schema) => schema
                .required("New password is required to change password")
                .min(8, "Password must be at least 8 characters")
                .matches(passwordRules, "Password must include uppercase, number and symbol"),
            otherwise: (schema) => schema.notRequired()
        })
});

export { profileValidationSchema };
