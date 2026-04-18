import * as Yup from "yup";

export const purchaseOrderSchema = Yup.object().shape({
  supplier: Yup.object().nullable().required("Please select a supplier"),
  items: Yup.array()
    .of(
      Yup.object().shape({
        itemId: Yup.string().required("Item selection is required"),
        qty: Yup.number()
          .typeError("Quantity must be a number")
          .required("Quantity is required")
          .positive("Quantity must be greater than 0"),
        price: Yup.number()
          .typeError("Price must be a number")
          .required("Price is required")
          .min(0, "Price cannot be negative"),
      })
    )
    .min(1, "Please add at least one item"),
});
