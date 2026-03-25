import * as Yup from "yup";

const InventorySchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Item name is required")
    .min(2, "Item name must be at least 2 characters"),
  
  category: Yup.string()
    .required("Category is required"),
  
  unitType: Yup.string()
    .required("Unit type is required"),
  
  reorderLevel: Yup.number()
    .typeError("Reorder level must be a number")
    .min(0, "Reorder level cannot be negative")
    .default(10),
  
  buyingPrice: Yup.number()
    .typeError("Buying price must be a number")
    .required("Buying price is required")
    .positive("Buying price must be greater than 0"),
  
  sellingPrice: Yup.number()
    .typeError("Selling price must be a number")
    .required("Selling price is required")
    .positive("Selling price must be greater than 0")
    .test(
      "is-greater-than-buying",
      "Selling price cannot be less than buying price",
      function(value) {
        const { buyingPrice } = this.parent;
        if (!value || !buyingPrice) return true;
        return parseFloat(value) >= parseFloat(buyingPrice);
      }
    ),
});

export default InventorySchema;