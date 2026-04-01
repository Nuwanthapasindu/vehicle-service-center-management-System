const Category = require('../model/Category');
const AppError = require('../error/AppError');
const { categorySchema, deleteCategoryValidation } = require('../validation/category.validation');

// CREATE
module.exports.createCategory = async (payload) => {
  const { error } = categorySchema.validate(payload);
  if (error) throw new AppError(error.details[0].message, 400);

  const category = await Category.create(payload);

  return category;
};

// GET ALL
module.exports.getAllCategories = async () => {
  const categories = await Category.find({ isDeleted: false }).lean();

  return categories;
};

// UPDATE
module.exports.updateCategory = async (id, payload) => {
  const { error } = categorySchema.validate(payload);
  if (error) throw new AppError(error.details[0].message, 400);

  const category = await Category.findOneAndUpdate(
    { _id: id, isDeleted: false },
    payload,
    { new: true }
  );

  if (!category) throw new AppError("Category not found", 404);

  return category;
};

// DELETE (SOFT DELETE)
module.exports.deleteCategory = async (id) => {
  try {
    await deleteCategoryValidation(id);
  } catch (error) {
    if (error.isBusinessRule || error.isJoi) {
      throw new AppError(error.message || error.details[0].message, 400);
    }
    throw error;
  }

  const category = await Category.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );

  if (!category) throw new AppError("Category not found", 404);

  return true;
};