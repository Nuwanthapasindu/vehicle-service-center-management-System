import * as Yup from 'yup';

export const supplierValidationSchema = Yup.object().shape({
  companyName: Yup.string()
    .required('Company Name is required'),
  agentName: Yup.string(),
  companyMobile: Yup.array()
    .of(
      Yup.string()
        .matches(/^[0-9]{10}$/, 'Mobile numbers must be exactly 10 digits')
        .required('Mobile number is required')
    )
    .min(1, 'At least one mobile number is required'),
  items: Yup.array()
    .of(
      Yup.string()
        .required('Item cannot be empty')
    )
    .min(1, 'At least one item is required'),
});
