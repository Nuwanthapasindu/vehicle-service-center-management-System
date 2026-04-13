import * as Yup from 'yup';

export const CreateInvoiceSchema = Yup.object().shape({
  customer: Yup.object().shape({
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits')
      .required('A valid customer mobile number is required')
  }).nullable().required('Please select a customer')
});
