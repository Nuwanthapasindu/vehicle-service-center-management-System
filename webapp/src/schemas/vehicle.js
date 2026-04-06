import * as Yup from "yup";

const vehicleValidationSchema = Yup.object().shape({
    licensePlate: Yup.string().required("License plate is required"),
    type: Yup.string().required("Vehicle type is required"),
    make: Yup.string().required("Make is required"),
    model: Yup.string().required("Model is required"),
    year: Yup.number()
        .required("Manufacture year is required")
        .min(1900, "Invalid year")
        .max(new Date().getFullYear() + 1, "Invalid year")
        .typeError("Manufacture year must be a number"),
});

export { vehicleValidationSchema };
