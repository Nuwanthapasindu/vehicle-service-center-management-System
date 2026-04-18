import * as Yup from "yup";

export const createJobCardSchema = Yup.object().shape({
  booking: Yup.string()
    .length(24, "Booking ID must be a valid ObjectId")
    .matches(/^[0-9a-fA-F]{24}$/, "Booking ID must be a valid ObjectId")
    .required("Booking ID is required"),

  selectedPackage: Yup.string()
    .length(24, "Package ID must be a valid ObjectId")
    .matches(/^[0-9a-fA-F]{24}$/, "Package ID must be a valid ObjectId")
    .required("Package is required"),

  milageCount: Yup.number()
    .typeError("Mileage must be a number")
    .integer("Mileage must be an integer")
    .min(0, "Mileage cannot be negative")
    .required("Mileage is required"),

  selectedTier: Yup.object()
    .nullable()
    .required("A pricing tier must be selected"),

  assignedTeam: Yup.string()
    .length(24, "Team ID must be a valid ObjectId")
    .required("A service team is required to be assigned")
});
