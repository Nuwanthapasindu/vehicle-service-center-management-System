const inventoryController = require('../../controller/inventory.controller');
const Inventory = require('../../model/Inventory');
const InventoryLog = require('../../model/InventoryLog');
const User = require('../../model/User');
const AppError = require('../../error/appError');
const ResponseBuilder = require('../../util/responseBuilder');
const { INVENTORY_UNIT_TYPES } = require('../../util/constants');

jest.mock('../../model/Inventory');
jest.mock('../../model/InventoryLog');
jest.mock('../../model/User');
jest.mock('../../validation/inventory.validation');
jest.mock('../../util/responseBuilder');

describe('Inventory Controller Unit Tests', () => {
  let mockReq;
  let mockRes;
  let mockNext;
  let mockResponseBuilder;

  beforeEach(() => {
    mockReq = { params: {}, body: {}, user: { mobile: '0771234567' } };
    mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    mockNext = jest.fn();

    mockResponseBuilder = { setStatus: jest.fn().mockReturnThis(), buildResponse: jest.fn() };
    ResponseBuilder.mockImplementation(() => mockResponseBuilder);

    jest.clearAllMocks();
  });

  describe('getInventory', () => {
    it('should fetch all inventory items successfully', async () => {
      const mockItems = [{ _id: 'item1', name: 'Oil', qty: 10 }];
      Inventory.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(mockItems) })
      });

      await inventoryController.getInventory(mockReq, mockRes, mockNext);

      expect(Inventory.find).toHaveBeenCalledWith({ isDeleted: false });
      expect(mockResponseBuilder.setStatus).toHaveBeenCalledWith(200);
      expect(mockResponseBuilder.buildResponse).toHaveBeenCalledWith({
        message: "Inventory fetched successfully",
        data: mockItems
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      const dbError = new Error('DB failed');
      Inventory.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({ lean: jest.fn().mockRejectedValue(dbError) })
      });

      await inventoryController.getInventory(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(dbError);
    });
  });

  describe('addItem', () => {
    it('should add a new inventory item', async () => {
      const mockItem = { _id: 'item1', name: 'Oil', qty: 10 };
      const { inventorySchema } = require('../../validation/inventory.validation');
      inventorySchema.validate.mockReturnValue({ error: null });
      User.findOne.mockImplementation((query) => {
        if (
          query.mobileNumber === '0771234567' &&
          query.isActive === true &&
          query.isDeleted === false
        ) {
          return {
            select: jest.fn().mockReturnValue({
              lean: jest.fn().mockResolvedValue({ _id: 'user1' })
            })
          };
        }

        return {
          select: jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue(null)
          })
        };
      });
      Inventory.create.mockResolvedValue(mockItem);

      mockReq.body = {
        name: 'Oil',
        qty: 10,
        category: 'cat1',
        unitType: INVENTORY_UNIT_TYPES.LITERS,
        sellingPrice: 200,
        buyingPrice: 150
      };

      await inventoryController.addItem(mockReq, mockRes, mockNext);

      expect(Inventory.create).toHaveBeenCalledWith(mockReq.body);
      expect(mockResponseBuilder.setStatus).toHaveBeenCalledWith(201);
      expect(mockResponseBuilder.buildResponse).toHaveBeenCalledWith({
        message: "Item added to inventory",
        data: mockItem
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle validation error', async () => {
      const { inventorySchema } = require('../../validation/inventory.validation');
      inventorySchema.validate.mockReturnValue({ error: { details: [{ message: 'Invalid data' }] } });

      await inventoryController.addItem(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].message).toBe('Invalid data');
      expect(Inventory.create).not.toHaveBeenCalled();
    });
  });

  describe('updateItem', () => {
    it('should update an inventory item successfully', async () => {
      const mockItem = { _id: 'item1', name: 'Oil', qty: 15 };
      Inventory.findOneAndUpdate.mockResolvedValue(mockItem);

      mockReq.params = { id: 'item1' };
      mockReq.body = { qty: 15 };

      await inventoryController.updateItem(mockReq, mockRes, mockNext);

      expect(Inventory.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'item1', isDeleted: false },
        { qty: 15 },
        { new: true }
      );
      expect(mockResponseBuilder.setStatus).toHaveBeenCalledWith(200);
      expect(mockResponseBuilder.buildResponse).toHaveBeenCalledWith({
        message: "Item details updated",
        data: mockItem
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return error when item not found', async () => {
      Inventory.findOneAndUpdate.mockResolvedValue(null);

      mockReq.params = { id: 'item1' };
      mockReq.body = { qty: 15 };

      await inventoryController.updateItem(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].message).toBe('Item not found');
      expect(mockNext.mock.calls[0][0].statusCode).toBe(404);
    });
  });

  describe('deleteItem', () => {
    it('should soft delete inventory item', async () => {
      const mockItem = { _id: 'item1', isDeleted: true };
      Inventory.findOneAndUpdate.mockResolvedValue(mockItem);

      mockReq.params = { id: 'item1' };

      await inventoryController.deleteItem(mockReq, mockRes, mockNext);

      expect(Inventory.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'item1', isDeleted: false },
        { isDeleted: true, deletedAt: expect.any(Date) },
        { new: true }
      );
      expect(mockResponseBuilder.setStatus).toHaveBeenCalledWith(200);
      expect(mockResponseBuilder.buildResponse).toHaveBeenCalledWith({
        message: "Item removed from inventory"
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return error when item not found', async () => {
      Inventory.findOneAndUpdate.mockResolvedValue(null);
      mockReq.params = { id: 'nonexistent' };

      await inventoryController.deleteItem(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].message).toBe('Item not found');
      expect(mockNext.mock.calls[0][0].statusCode).toBe(404);
    });
  });

  describe('manualAdjustment', () => {
    it('should adjust stock manually successfully', async () => {
      const { stockAdjustmentSchema } = require('../../validation/inventory.validation');
      stockAdjustmentSchema.validate.mockReturnValue({ error: null });

      const mockInventory = { _id: 'item1', qty: 10, save: jest.fn().mockResolvedValue() };
      const mockUpdatedItem = { ...mockInventory, qty: 15 };
      User.findOne.mockImplementation((query) => {
        if (
          query.mobileNumber === '0771234567' &&
          query.isActive === true &&
          query.isDeleted === false
        ) {
          return {
            select: jest.fn().mockReturnValue({
              lean: jest.fn().mockResolvedValue({ _id: 'user1' })
            })
          };
        }

        return {
          select: jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue(null)
          })
        };
      });User.findOne.mockImplementation((query) => {
        if (
          query.mobileNumber === '0771234567' &&
          query.isActive === true &&
          query.isDeleted === false
        ) {
          return {
            select: jest.fn().mockReturnValue({
              lean: jest.fn().mockResolvedValue({ _id: 'user1' })
            })
          };
        }

        return {
          select: jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue(null)
          })
        };
      });
      Inventory.findOne.mockReturnValue({
      session: jest.fn().mockResolvedValue(mockInventory)
      });
      InventoryLog.create.mockResolvedValue({});

      mockReq.params = { id: 'item1' };
      mockReq.body = { quantityChange: 5 };

      await inventoryController.manualAdjustment(mockReq, mockRes, mockNext);

      expect(mockResponseBuilder.setStatus).toHaveBeenCalledWith(200);
      expect(mockResponseBuilder.buildResponse).toHaveBeenCalledWith({
        message: "Manual stock adjustment successful",
        data: mockUpdatedItem
      });
    });

    it('should handle validation error', async () => {
      const { stockAdjustmentSchema } = require('../../validation/inventory.validation');
      stockAdjustmentSchema.validate.mockReturnValue({ error: { details: [{ message: 'Invalid quantity' }] } });

      await inventoryController.manualAdjustment(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });
  });

  describe('reduceStockByInvoice', () => {
    it('should reduce stock successfully for multiple items', async () => {
    User.findOne.mockImplementation((query) => {
      if (
        query.mobileNumber === '0771234567' &&
        query.isActive === true &&
        query.isDeleted === false
      ) {
        return {
          select: jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue({ _id: 'user1' })
          })
        };
      }

      return {
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(null)
        })
      };
    });
      Inventory.findOne.mockReturnValue({
        session: jest.fn().mockResolvedValue({
          _id: 'item1',
          qty: 10,
          save: jest.fn().mockResolvedValue()
        })
      });
      InventoryLog.create.mockResolvedValue({});

      mockReq.body = { items: [{ inventoryId: 'item1', quantity: 2 }, { inventoryId: 'item2', quantity: 3 }] };

      await inventoryController.reduceStockByInvoice(mockReq, mockRes, mockNext);

      expect(mockResponseBuilder.setStatus).toHaveBeenCalledWith(200);
      expect(mockResponseBuilder.buildResponse).toHaveBeenCalledWith({
        message: "Stock reduced for invoice items"
      });
    });

    it('should handle empty items array', async () => {
      mockReq.body = { items: [] };

      await inventoryController.reduceStockByInvoice(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });
  });

  describe('increaseStockByPO', () => {
    it('should increase stock successfully for purchase order items', async () => {
    User.findOne.mockImplementation((query) => {
      if (
        query.mobileNumber === '0771234567' &&
        query.isActive === true &&
        query.isDeleted === false
      ) {
        return {
          select: jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue({ _id: 'user1' })
          })
        };
      }

      return {
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(null)
        })
      };
    });
      Inventory.findOne.mockReturnValue({
        session: jest.fn().mockResolvedValue({
          _id: 'item1',
          qty: 5,
          save: jest.fn().mockResolvedValue()
        })
      });
      InventoryLog.create.mockResolvedValue({});

      mockReq.body = { items: [{ inventoryId: 'item1', quantityReceived: 5 }, { inventoryId: 'item2', quantityReceived: 10 }] };

      await inventoryController.increaseStockByPO(mockReq, mockRes, mockNext);

      expect(mockResponseBuilder.setStatus).toHaveBeenCalledWith(200);
      expect(mockResponseBuilder.buildResponse).toHaveBeenCalledWith({
        message: "Stock increased for received Order items"
      });
    });

    it('should handle missing quantityReceived', async () => {
      mockReq.body = { items: [{ inventoryId: 'item1' }] };

      await inventoryController.increaseStockByPO(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });

    it('should handle empty items array', async () => {
      mockReq.body = { items: [] };

      await inventoryController.increaseStockByPO(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });
  });
});