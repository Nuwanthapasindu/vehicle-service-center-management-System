const categoryController = require('../../controller/category.controller');
const Category = require('../../model/Category');
const AppError = require('../../error/AppError');

jest.mock('../../model/Category');
jest.mock('../../model/Inventory');
jest.mock('../../validation/category.validation', () => ({
  categorySchema: { validate: jest.fn() },
  deleteCategoryValidation: jest.fn()
}));

describe('Category Controller Unit Tests (Updated)', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCategory', () => {
    it('should create category', async () => {
      const payload = { name: 'Electronics' };

      const { categorySchema } = require('../../validation/category.validation');
      categorySchema.validate.mockReturnValue({ error: null });

      Category.create.mockResolvedValue({ _id: '1', name: 'Electronics' });

      const result = await categoryController.createCategory(payload);

      expect(Category.create).toHaveBeenCalledWith(payload);
      expect(typeof result).toBe('string');
      expect(result).toContain('added successfully');
    });

    it('should throw validation error', async () => {
      const payload = {};

      const { categorySchema } = require('../../validation/category.validation');
      categorySchema.validate.mockReturnValue({
        error: { details: [{ message: 'Category name is required' }] }
      });

      await expect(categoryController.createCategory(payload))
        .rejects.toThrow(AppError);
    });
  });

  describe('getAllCategories', () => {
    it('should return categories', async () => {
      const mockData = [{ name: 'A' }];

      Category.find.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockData)
      });

      const result = await categoryController.getAllCategories();

      expect(result).toEqual(mockData);
    });
  });

  describe('updateCategory', () => {
    it('should update category', async () => {
      const payload = { name: 'Updated' };

      const { categorySchema } = require('../../validation/category.validation');
      categorySchema.validate.mockReturnValue({ error: null });

      Category.findOneAndUpdate.mockResolvedValue({ _id: '1', name: 'Updated' });

      const result = await categoryController.updateCategory('1', payload);

      expect(typeof result).toBe('string');
      expect(result).toContain('updated successfully');
    });

    it('should throw not found error', async () => {
      const { categorySchema } = require('../../validation/category.validation');
      categorySchema.validate.mockReturnValue({ error: null });

      Category.findOneAndUpdate.mockResolvedValue(null);

      await expect(
        categoryController.updateCategory('1', { name: 'X' })
      ).rejects.toThrow('Category not found');
    });
  });

  describe('deleteCategory', () => {
    it('should soft delete category', async () => {
      const { deleteCategoryValidation } = require('../../validation/category.validation');
      deleteCategoryValidation.mockReturnValue({ error: null });

      const Inventory = require('../../model/Inventory');
      Inventory.countDocuments.mockResolvedValue(0);

      Category.findOneAndUpdate.mockResolvedValue({ _id: '1', name: 'Electronics' });

      const result = await categoryController.deleteCategory('1');

      expect(typeof result).toBe('string');
      expect(result).toContain('deleted successfully');
    });

    it('should throw error if not found', async () => {
      const { deleteCategoryValidation } = require('../../validation/category.validation');
      deleteCategoryValidation.mockReturnValue({ error: null });

      const Inventory = require('../../model/Inventory');
      Inventory.countDocuments.mockResolvedValue(0);

      Category.findOneAndUpdate.mockResolvedValue(null);

      await expect(
        categoryController.deleteCategory('1')
      ).rejects.toThrow('Category not found');
    });
  });
});