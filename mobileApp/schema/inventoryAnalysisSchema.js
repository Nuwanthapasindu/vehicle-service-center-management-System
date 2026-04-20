import * as Yup from "yup";

const InventoryAnalysisFilterSchema = Yup.object().shape({
  period: Yup.string()
    .oneOf(['today', 'weekly', 'monthly', 'yearly', 'custom', '30days'], "Invalid period filter")
    .nullable(),

  startDate: Yup.date()
    .typeError("Start date must be a valid date")
    .nullable(),

  endDate: Yup.date()
    .typeError("End date must be a valid date")
    .min(Yup.ref('startDate'), "End date cannot be before start date")
    .nullable(),
});

export default InventoryAnalysisFilterSchema;
