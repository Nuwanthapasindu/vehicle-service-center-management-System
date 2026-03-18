import * as Yup from "yup";

const PackageSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, "Package name must be at least 2 characters")
        .max(100, "Package name cannot exceed 100 characters")
        .required("Package name is required"),
    description: Yup.string()
        .max(1000, "Description cannot exceed 1000 characters")
        .optional(),
    applicableVehicalModels: Yup.array()
        .of(Yup.string().min(1).max(100))
        .min(1, "At least one applicable vehicle model must be selected")
        .required("Applicable vehicle models are required"),
    pricingTiers: Yup.array()
        .of(
            Yup.object().shape({
                name: Yup.string()
                    .required("Pricing tier name is required")
                    .min(2, "Pricing tier name must be at least 2 characters"),
                price: Yup.number()
                    .min(0, "Price must be a positive number")
                    .required("Pricing tier price is required"),
            }),
        )
        .min(1, "At least one pricing tier must be defined")
        .required("Pricing tiers are required"),
    servicesIncluded: Yup.array()
        .of(
            Yup.string()
                .matches(/^[0-9a-fA-F]{24}$/, "Invalid service ID")
                .required("Service ID cannot be empty"),
        )
        .min(1, "At least one service must be selected")
        .required("Services are required"),
});

export default PackageSchema;
