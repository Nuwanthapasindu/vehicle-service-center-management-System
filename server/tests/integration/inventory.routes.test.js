const request = require('supertest');
const express = require('express');

const inventoryRoutes = require('../../routes/inventory.route');
const Inventory = require('../../model/Inventory');
const User = require('../../model/User');
const { INVENTORY_UNIT_TYPES } = require('../../util/constants');

jest.mock('../../middleware/auth', () => ({
  authTokenMiddleware: (req, res, next) => {
    req.user = { mobile: '0771234567', role: 'ADMIN' };
    next();
  },
  accessControl: () => (req, res, next) => next()
}));

jest.mock('../../model/Inventory');
jest.mock('../../model/InventoryLog');
jest.mock('../../model/User');

const app = express();
app.use(express.json());
app.use('/inventory', inventoryRoutes);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({ message: err.message });
});

describe('Inventory Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /inventory', () => {
    it('should return all inventory items', async () => {
      Inventory.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([{ _id: '1', name: 'Item 1', qty: 10 }])
      });
      const res = await request(app).get('/inventory');
      expect(res.statusCode).toBe(200);
      expect(res.body.payload.data.length).toBe(1);
    });
  });

  describe('POST /inventory', () => {
    it('should create a new inventory item', async () => {
      User.findOne.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue({ _id: 'user123' })
      });
      Inventory.create.mockResolvedValue({ _id: 'item123', name: 'New Item', qty: 5 });
      const res = await request(app)
        .post('/inventory')
        .send({
          name: 'New Item',
          category: 'cat123',
          qty: 5,
          unitType: Object.values(INVENTORY_UNIT_TYPES)[0],
          reorderLevel: 2,
          sellingPrice: 100,
          buyingPrice: 70
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.payload.message).toContain('added successfully');
    });
  });

  describe('PATCH /inventory/adjust/:id', () => {
    it('should adjust stock manually', async () => {
      User.findOne.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue({ _id: 'user123' })
      });
      const mockItem = { _id: 'item123', qty: 10, name: 'TestItem', save: jest.fn().mockResolvedValue({}) };
      Inventory.findOne.mockResolvedValue(mockItem);
      const res = await request(app).patch('/inventory/adjust/item123').send({ quantityChange: 5 });
      expect(res.statusCode).toBe(200);
      expect(res.body.payload.message).toBeDefined();
    });
  });

  describe('PATCH /inventory/reduce-stock', () => {
    it('should reduce stock for invoice items', async () => {
      User.findOne.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue({ _id: 'user123' })
      });
      const mockItem = { _id: 'item123', qty: 10, name: 'TestItem', save: jest.fn().mockResolvedValue({}) };
      Inventory.findOne.mockResolvedValue(mockItem);
      const res = await request(app).patch('/inventory/reduce-stock').send({ items: [{ inventoryId: 'item123', quantity: 2 }] });
      expect(res.statusCode).toBe(200);
      expect(res.body.payload.message).toContain('reduced successfully');
    });
  });

  describe('PATCH /inventory/increase-stock', () => {
    it('should increase stock from PO', async () => {
      User.findOne.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue({ _id: 'user123' })
      });
      const mockItem = { _id: 'item123', qty: 10, name: 'TestItem', save: jest.fn().mockResolvedValue({}) };
      Inventory.findOne.mockResolvedValue(mockItem);
      const res = await request(app).patch('/inventory/increase-stock').send({ items: [{ inventoryId: 'item123', quantityReceived: 3 }] });
      expect(res.statusCode).toBe(200);
      expect(res.body.payload.message).toContain('increased successfully');
    });
  });

  describe('PATCH /inventory/:id', () => {
    it('should update an inventory item', async () => {
      Inventory.findOneAndUpdate.mockResolvedValue({ _id: 'item123', name: 'Updated Item' });
      const res = await request(app).patch('/inventory/item123').send({ name: 'Updated Item' });
      expect(res.statusCode).toBe(200);
      expect(res.body.payload.message).toContain('updated successfully');
    });
  });

  describe('DELETE /inventory/:id', () => {
    it('should soft delete an item', async () => {
      Inventory.findOneAndUpdate.mockResolvedValue({ _id: 'item123', isDeleted: true });
      const res = await request(app).delete('/inventory/item123');
      expect(res.statusCode).toBe(200);
      expect(res.body.payload.message).toContain('deleted successfully');
    });
  });
});