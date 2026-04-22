const inventoryController = require('../../controller/inventory.controller');
const Inventory = require('../../model/Inventory');
const InventoryLog = require('../../model/InventoryLog');
const User = require('../../model/User');
const AppError = require('../../error/AppError');
const { INVENTORY_UNIT_TYPES } = require('../../util/constants');

jest.mock('../../model/Inventory');
jest.mock('../../model/InventoryLog');
jest.mock('../../model/User');

jest.mock('../../validation/inventory.validation', () => ({
  inventorySchema: { validate: jest.fn() },
  stockAdjustmentSchema: { validate: jest.fn() }
}));

describe('Inventory Controller Unit Tests', () => {
  let mockReq;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      params: {},
      body: {},
      user: { mobile: '0771234567' }
    };
  });

  describe('getInventory', () => {
    it('should fetch inventory', async () => {
      const mockItems = [{ _id: '1', name: 'Oil' }];

      Inventory.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(mockItems)
        })
      });

      const result = await inventoryController.getInventory();

      expect(result).toEqual(mockItems);
    });

    it('should handle error', async () => {
      const err = new Error('DB error');

      Inventory.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockRejectedValue(err)
        })
      });

      await expect(inventoryController.getInventory()).rejects.toThrow('DB error');
    });
  });

  describe('addItem', () => {
    it('should add item', async () => {
      const { inventorySchema } = require('../../validation/inventory.validation');

      inventorySchema.validate.mockReturnValue({ error: null });

      User.findOne.mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue({ _id: 'u1' })
        })
      });

      Inventory.create.mockResolvedValue({ _id: '1', qty: 10 });

      const result = await inventoryController.addItem(
        {
          name: 'Oil',
          qty: 10,
          category: 'cat1',
          unitType: INVENTORY_UNIT_TYPES.LITERS
        },
        mockReq.user
      );

      expect(Inventory.create).toHaveBeenCalled();
      expect(typeof result).toBe('string');
      expect(result).toContain('added successfully');
    });

    it('should fail validation', async () => {
      const { inventorySchema } = require('../../validation/inventory.validation');

      inventorySchema.validate.mockReturnValue({
        error: { details: [{ message: 'Invalid' }] }
      });

      await expect(
        inventoryController.addItem({}, mockReq.user)
      ).rejects.toThrow(AppError);
    });
  });

  describe('updateItem', () => {
    it('should update item', async () => {
      Inventory.findOneAndUpdate.mockResolvedValue({ _id: '1' });

      const result = await inventoryController.updateItem('1', { qty: 15 });

      expect(typeof result).toBe('string');
      expect(result).toContain('updated successfully');
    });

    it('should not find item', async () => {
      Inventory.findOneAndUpdate.mockResolvedValue(null);

      await expect(
        inventoryController.updateItem('1', { qty: 15 })
      ).rejects.toThrow(AppError);
    });
  });

  describe('deleteItem', () => {
    it('should soft delete', async () => {
      Inventory.findOneAndUpdate.mockResolvedValue({ isDeleted: true });

      const result = await inventoryController.deleteItem('1');

      expect(typeof result).toBe('string');
      expect(result).toContain('deleted successfully');
    });

    it('should fail when not found', async () => {
      Inventory.findOneAndUpdate.mockResolvedValue(null);

      await expect(
        inventoryController.deleteItem('1')
      ).rejects.toThrow(AppError);
    });
  });

  describe('manualAdjustment', () => {
    it('should adjust stock', async () => {
      const { stockAdjustmentSchema } = require('../../validation/inventory.validation');

      stockAdjustmentSchema.validate.mockReturnValue({ error: null });

      Inventory.findOne.mockResolvedValue({
        qty: 10,
        name: 'TestItem',
        save: jest.fn().mockResolvedValue({})
      });

      InventoryLog.create.mockResolvedValue({});

      const result = await inventoryController.manualAdjustment(
        '1',
        { quantityChange: 5 },
        mockReq.user
      );

      expect(result).toBeDefined();
    });

    it('should validation fail', async () => {
      const { stockAdjustmentSchema } = require('../../validation/inventory.validation');

      stockAdjustmentSchema.validate.mockReturnValue({
        error: { details: [{ message: 'Invalid' }] }
      });

      await expect(
        inventoryController.manualAdjustment('1', {}, mockReq.user)
      ).rejects.toThrow(AppError);
    });
  });

  describe('reduceStockByInvoice', () => {
    it('should reduce stock', async () => {
      Inventory.findOne.mockResolvedValue({
        qty: 10,
        name: 'TestItem',
        save: jest.fn().mockResolvedValue({})
      });

      InventoryLog.create.mockResolvedValue({});

      const result = await inventoryController.reduceStockByInvoice(
        { items: [{ inventoryId: '1', quantity: 2 }] },
        mockReq.user
      );

      expect(typeof result).toBe('string');
      expect(result).toContain('reduced successfully');
    });

    it('should fail when no items', async () => {
      await expect(
        inventoryController.reduceStockByInvoice({ items: [] }, mockReq.user)
      ).rejects.toThrow(AppError);
    });
  });

  describe('increaseStockByPO', () => {
    it('should increase stock', async () => {
      Inventory.findOne.mockResolvedValue({
        qty: 5,
        name: 'TestItem',
        save: jest.fn().mockResolvedValue({})
      });

      InventoryLog.create.mockResolvedValue({});

      const result = await inventoryController.increaseStockByPO(
        { items: [{ inventoryId: '1', quantityReceived: 5 }] },
        mockReq.user
      );

      expect(typeof result).toBe('string');
      expect(result).toContain('increased successfully');
    });

    it('should fail when no items', async () => {
      await expect(
        inventoryController.increaseStockByPO({ items: [] }, mockReq.user)
      ).rejects.toThrow(AppError);
    });
  });
});