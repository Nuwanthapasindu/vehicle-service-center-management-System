import * as Yup from "yup";

const InventoryLogFilterSchema = Yup.object().shape({
  inventoryId: Yup.string()
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid Inventory ID format")
    .nullable(),
  
  actionType: Yup.string()
    .nullable(),

  period: Yup.string()
    .oneOf(['today', 'weekly', 'monthly', 'yearly', 'custom'], "Invalid period filter")
    .nullable(),

  startDate: Yup.date()
    .typeError("Start date must be a valid date")
    .nullable(),

  endDate: Yup.date()
    .typeError("End date must be a valid date")
    .min(Yup.ref('startDate'), "End date cannot be before start date")
    .nullable(),

  page: Yup.number()
    .positive("Page must be a positive number")
    .integer()
    .default(1),

  limit: Yup.number()
    .positive("Limit must be a positive number")
    .integer()
    .max(100)
    .default(20),
});

export default InventoryLogFilterSchema;
