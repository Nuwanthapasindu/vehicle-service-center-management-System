import * as Yup from "yup";

const CategorySchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Category name is required")
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name cannot exceed 50 characters")
    .matches(
      /^[a-zA-Z0-9\s\-&]+$/,
      "Category name can only contain letters, numbers, spaces, hyphens, and ampersands"
    ),
  count: Yup.number()
    .max(0, "Cannot delete category with associated inventory items. Please remove or reassign items first.")
});

export default CategorySchema;