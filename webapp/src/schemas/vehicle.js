import * as Yup from "yup";

const vehicleValidationSchema = Yup.object().shape({
    licensePlate: Yup.string().required("License plate is required"),
    type: Yup.string().required("Vehicle type is required"),
    make: Yup.string().required("Make is required"),
    model: Yup.string().required("Model is required"),
});

export { vehicleValidationSchema };
