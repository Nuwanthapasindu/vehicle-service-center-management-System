import * as Yup from "yup";

/**
 * Validation schema for Time Slot configuration.
 * Used for both creating and updating a time slot.
 */
const timeslotSchema = Yup.object().shape({
  startTime: Yup.date()
    .required("Start time is required"),
  endTime: Yup.date()
    .required("End time is required")
    .test("is-after-start", "End time must be after start time", function (value) {
      const { startTime } = this.parent;
      if (!startTime || !value) return true;
      return value > startTime;
    }),
  maxCapacity: Yup.number()
    .required("Maximum capacity is required")
    .typeError("Must be a number")
    .min(1, "Capacity must be at least 1")
    .max(100, "Capacity cannot exceed 100")
    .integer("Must be an integer"),
  isActive: Yup.boolean().default(true),
});

export default timeslotSchema;
