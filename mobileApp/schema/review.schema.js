import * as Yup from "yup";

/**
 * Validates the admin reply for a review
 */
export const adminReplySchema = Yup.object().shape({
  reply: Yup.string()
    .required("Reply message is required")
    .min(5, "Reply must be at least 5 characters")
    .max(500, "Reply cannot exceed 500 characters"),
});
