const Category = require('../model/Category');
const Inventory = require('../model/Inventory');
const AppError = require('../error/AppError');
const { categorySchema, deleteCategoryValidation } = require('../validation/category.validation');

// CREATE
module.exports.createCategory = async (payload) => {
  try {
    const { error } = categorySchema.validate(payload);
    if (error) throw new AppError(error.details[0].message, 400);

    const existingCategory = await Category.findOne({ name: payload.name });
    if (existingCategory) {
      throw new AppError(`Category with name "${payload.name}" already exists`, 409);
    }

    const category = await Category.create(payload);

    return `${category.name} added successfully.`;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Server Error", 500);
  }
};

// GET ALL
module.exports.getAllCategories = async () => {
  try {
    const categories = await Category.find({ isDeleted: false }).lean();
    return categories;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Server Error", 500);
  }
};

// UPDATE
module.exports.updateCategory = async (id, payload) => {
  try {
    const { error } = categorySchema.validate(payload);
    if (error) throw new AppError(error.details[0].message, 400);

    const category = await Category.findOneAndUpdate(
      { _id: id, isDeleted: false },
      payload,
      { new: true }
    );

    if (!category) throw new AppError("Category not found", 404);

    return `${category.name} updated successfully.`;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Server Error", 500);
  }
};

// DELETE (SOFT DELETE)
module.exports.deleteCategory = async (id) => {
  try {
    const { error } = deleteCategoryValidation(id);
    if (error) throw new AppError(error.details[0].message, 400);

    const itemCount = await Inventory.countDocuments({
      category: id,
      isDeleted: false
    });

    if (itemCount > 0) {
      throw new AppError("Cannot delete category with associated inventory items", 400);
    }

    const category = await Category.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!category) throw new AppError("Category not found", 404);

    return `${category.name} deleted successfully.`;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Server Error", 500);
  }
};