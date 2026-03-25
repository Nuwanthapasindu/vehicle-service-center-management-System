import * as Yup from "yup";

const StockSchema = Yup.object().shape({
  adjustment: Yup.number()
    .typeError("Adjustment must be a number")
    .required("Adjustment is required")
    .test(
      "not-zero",
      "Please increase or decrease the quantity",
      function(value) {
        return value !== 0;
      }
    ),
});

export default StockSchema;