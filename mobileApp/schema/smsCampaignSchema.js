import * as Yup from "yup";

/**
 * Validation schema for SMS Campaign creation.
 */
const smsCampaignSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .required("Campaign title is required"),
  message: Yup.string()
    .trim()
    .required("SMS message content is required"),
  campaignType: Yup.string()
    .required()
    .oneOf(["PROMOTIONAL", "TRANSACTIONAL"]),
});

export default smsCampaignSchema;
