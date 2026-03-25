const categoryController = require('../../controller/category.controller');
const Category = require('../../model/Category');
const AppError = require('../../error/appError');
const ResponseBuilder = require('../../util/responseBuilder');

jest.mock('../../model/Category');
jest.mock('../../validation/category.validation');
jest.mock('../../util/responseBuilder');

describe('Category Controller Unit Tests', () => {
  let mockReq;
  let mockRes;
  let mockNext;
  let mockResponseBuilder;

  beforeEach(() => {
    mockReq = {
      params: {},
      body: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
    
    mockResponseBuilder = {
      setStatus: jest.fn().mockReturnThis(),
      buildResponse: jest.fn()
    };
    ResponseBuilder.mockImplementation(() => mockResponseBuilder);
    
    jest.clearAllMocks();
  });

  describe('createCategory', () => {
    it('should create a new category successfully', async () => {
      const mockCategory = { 
        _id: 'cat123', 
        name: 'Electronics',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const { categorySchema } = require('../../validation/category.validation');
      categorySchema.validate.mockReturnValue({ error: null });
      
      Category.create.mockResolvedValue(mockCategory);
      
      mockReq.body = { name: 'Electronics' };
      
      await categoryController.createCategory(mockReq, mockRes, mockNext);
      
      expect(Category.create).toHaveBeenCalledWith({ name: 'Electronics' });
      expect(mockResponseBuilder.setStatus).toHaveBeenCalledWith(201);
      expect(mockResponseBuilder.buildResponse).toHaveBeenCalledWith({
        message: "Category created",
        data: mockCategory
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return validation error for invalid data', async () => {
      const { categorySchema } = require('../../validation/category.validation');
      categorySchema.validate.mockReturnValue({
        error: { details: [{ message: 'Category name is required' }] }
      });
      
      await categoryController.createCategory(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].message).toBe('Category name is required');
      expect(mockNext.mock.calls[0][0].statusCode).toBe(400);
      expect(Category.create).not.toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      const dbError = new Error('Database connection failed');
      
      const { categorySchema } = require('../../validation/category.validation');
      categorySchema.validate.mockReturnValue({ error: null });
      
      Category.create.mockRejectedValue(dbError);
      
      mockReq.body = { name: 'Electronics' };
      
      await categoryController.createCategory(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(dbError);
    });
  });

  describe('getAllCategories', () => {
    it('should fetch all non-deleted categories', async () => {
      const mockCategories = [
        { 
          _id: '1', 
          name: 'Electronics',
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        { 
          _id: '2', 
          name: 'Spare Parts',
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      Category.find.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockCategories)
      });
      
      await categoryController.getAllCategories(mockReq, mockRes, mockNext);
      
      expect(Category.find).toHaveBeenCalledWith({ isDeleted: false });
      expect(mockResponseBuilder.setStatus).toHaveBeenCalledWith(200);
      expect(mockResponseBuilder.buildResponse).toHaveBeenCalledWith({
        message: "Categories fetched",
        data: mockCategories
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return empty array when no categories exist', async () => {
      Category.find.mockReturnValue({
        lean: jest.fn().mockResolvedValue([])
      });
      
      await categoryController.getAllCategories(mockReq, mockRes, mockNext);
      
      expect(mockResponseBuilder.setStatus).toHaveBeenCalledWith(200);
      expect(mockResponseBuilder.buildResponse).toHaveBeenCalledWith({
        message: "Categories fetched",
        data: []
      });
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      Category.find.mockReturnValue({
        lean: jest.fn().mockRejectedValue(error)
      });
      
      await categoryController.getAllCategories(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateCategory', () => {
    it('should update category successfully', async () => {
      const mockCategory = { 
        _id: 'cat123', 
        name: 'Updated Category',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const { categorySchema } = require('../../validation/category.validation');
      categorySchema.validate.mockReturnValue({ error: null });
      
      Category.findOneAndUpdate.mockResolvedValue(mockCategory);
      
      mockReq.params = { id: 'cat123' };
      mockReq.body = { name: 'Updated Category' };
      
      await categoryController.updateCategory(mockReq, mockRes, mockNext);
      
      expect(Category.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'cat123', isDeleted: false },
        { name: 'Updated Category' },
        { new: true }
      );
      expect(mockResponseBuilder.setStatus).toHaveBeenCalledWith(200);
      expect(mockResponseBuilder.buildResponse).toHaveBeenCalledWith({
        message: "Category updated",
        data: mockCategory
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return validation error for invalid data', async () => {
      const { categorySchema } = require('../../validation/category.validation');
      categorySchema.validate.mockReturnValue({
        error: { details: [{ message: 'Category name is required' }] }
      });
      
      mockReq.params = { id: 'cat123' };
      mockReq.body = { name: '' };
      
      await categoryController.updateCategory(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].message).toBe('Category name is required');
      expect(Category.findOneAndUpdate).not.toHaveBeenCalled();
    });

    it('should return error when category not found', async () => {
      const { categorySchema } = require('../../validation/category.validation');
      categorySchema.validate.mockReturnValue({ error: null });
      
      Category.findOneAndUpdate.mockResolvedValue(null);
      
      mockReq.params = { id: 'nonexistent' };
      mockReq.body = { name: 'Updated Category' };
      
      await categoryController.updateCategory(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].message).toBe('Category not found');
      expect(mockNext.mock.calls[0][0].statusCode).toBe(404);
      expect(mockResponseBuilder.setStatus).not.toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      const dbError = new Error('Database error');
      
      const { categorySchema } = require('../../validation/category.validation');
      categorySchema.validate.mockReturnValue({ error: null });
      
      Category.findOneAndUpdate.mockRejectedValue(dbError);
      
      mockReq.params = { id: 'cat123' };
      mockReq.body = { name: 'Updated Category' };
      
      await categoryController.updateCategory(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(dbError);
    });
  });

  describe('deleteCategory', () => {
    it('should soft delete category successfully', async () => {
      const mockCategory = { 
        _id: 'cat123', 
        name: 'To Be Deleted',
        isDeleted: true,
        deletedAt: expect.any(Date),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      Category.findOneAndUpdate.mockResolvedValue(mockCategory);
      
      mockReq.params = { id: 'cat123' };
      
      await categoryController.deleteCategory(mockReq, mockRes, mockNext);
      
      expect(Category.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'cat123', isDeleted: false },
        { isDeleted: true, deletedAt: expect.any(Date) },
        { new: true }
      );
      expect(mockResponseBuilder.setStatus).toHaveBeenCalledWith(200);
      expect(mockResponseBuilder.buildResponse).toHaveBeenCalledWith({
        message: "Category deleted"
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return error when category not found', async () => {
      Category.findOneAndUpdate.mockResolvedValue(null);
      
      mockReq.params = { id: 'nonexistent' };
      
      await categoryController.deleteCategory(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].message).toBe('Category not found');
      expect(mockNext.mock.calls[0][0].statusCode).toBe(404);
      expect(mockResponseBuilder.setStatus).not.toHaveBeenCalled();
    });

    it('should not allow deleting already deleted category', async () => {
      Category.findOneAndUpdate.mockResolvedValue(null);
      
      mockReq.params = { id: 'already-deleted' };
      
      await categoryController.deleteCategory(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].message).toBe('Category not found');
      expect(Category.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'already-deleted', isDeleted: false },
        { isDeleted: true, deletedAt: expect.any(Date) },
        { new: true }
      );
    });

    it('should handle database errors', async () => {
      const dbError = new Error('Database error');
      Category.findOneAndUpdate.mockRejectedValue(dbError);
      
      mockReq.params = { id: 'cat123' };
      
      await categoryController.deleteCategory(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(dbError);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty request body in createCategory', async () => {
      const { categorySchema } = require('../../validation/category.validation');
      categorySchema.validate.mockReturnValue({
        error: { details: [{ message: 'Category name is required' }] }
      });
      
      mockReq.body = {};
      
      await categoryController.createCategory(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(400);
    });

    it('should handle empty request body in updateCategory', async () => {
      const { categorySchema } = require('../../validation/category.validation');
      categorySchema.validate.mockReturnValue({
        error: { details: [{ message: 'Category name is required' }] }
      });
      
      mockReq.params = { id: 'cat123' };
      mockReq.body = {};
      
      await categoryController.updateCategory(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].statusCode).toBe(400);
    });

    it('should handle category with very long name', async () => {
      const longName = 'A'.repeat(200);
      const mockCategory = { 
        _id: 'cat123', 
        name: longName,
        isDeleted: false
      };
      
      const { categorySchema } = require('../../validation/category.validation');
      categorySchema.validate.mockReturnValue({ error: null });
      
      Category.create.mockResolvedValue(mockCategory);
      
      mockReq.body = { name: longName };
      
      await categoryController.createCategory(mockReq, mockRes, mockNext);
      
      expect(mockResponseBuilder.setStatus).toHaveBeenCalledWith(201);
      expect(mockResponseBuilder.buildResponse).toHaveBeenCalledWith({
        message: "Category created",
        data: mockCategory
      });
    });

    it('should handle category with special characters', async () => {
      const specialName = 'Auto-Tools & Equipment (Premium)';
      const mockCategory = { 
        _id: 'cat123', 
        name: specialName,
        isDeleted: false
      };
      
      const { categorySchema } = require('../../validation/category.validation');
      categorySchema.validate.mockReturnValue({ error: null });
      
      Category.create.mockResolvedValue(mockCategory);
      
      mockReq.body = { name: specialName };
      
      await categoryController.createCategory(mockReq, mockRes, mockNext);
      
      expect(mockResponseBuilder.setStatus).toHaveBeenCalledWith(201);
      expect(mockResponseBuilder.buildResponse).toHaveBeenCalledWith({
        message: "Category created",
        data: mockCategory
      });
    });
  });
});