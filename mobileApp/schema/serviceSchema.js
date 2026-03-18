import * as Yup from "yup";
import enums from "../constants/enums";

const VEHICLE_TYPES = Object.values(enums.VEHICLE_TYPES);

const ServiceSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, "Service name must be at least 2 characters long")
        .max(100, "Service name must be at most 100 characters long")
        .matches(/^\s*\S.*$/, "Service name cannot be empty")
        .required("Service name is required"),
    description: Yup.string()
        .max(500, "Description must be at most 500 characters long")
        .optional(),
    prices: Yup.array()
        .of(
            Yup.object().shape({
                model: Yup.string()
                    .oneOf(VEHICLE_TYPES, "Vehicle model is invalid")
                    .required("Vehicle model is required"),
                price: Yup.number()
                    .typeError("Price must be a valid number")
                    .positive("Price must be a positive number")
                    .required("Price is required"),
            }),
        )
        .min(1, "At least one price entry is required")
        .test(
            "unique-models",
            "Each vehicle model can only have one price entry",
            (prices) => {
                if (!prices) return true;
                const models = prices.map((p) => p.model);
                return new Set(models).size === models.length;
            },
        ),
});

export default ServiceSchema;
