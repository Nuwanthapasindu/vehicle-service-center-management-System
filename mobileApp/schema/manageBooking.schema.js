import * as Yup from "yup";

export const manageBookingSchema = Yup.object().shape({
  selectedDate: Yup.date().required("Please select a date").nullable(),
  selectedSlotId: Yup.string().required("Please select a time slot").nullable(),
});
