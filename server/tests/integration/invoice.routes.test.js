const request = require('supertest');
const express = require('express');

const invoiceRoutes = require('../../routes/invoice.route');
const Invoice = require('../../model/Invoice');

jest.mock('../../middleware/auth', () => ({
  authTokenMiddleware: (req, res, next) => {
    req.user = { mobile: '0771234567', role: 'ADMIN' };
    next();
  },
  accessControl: () => (req, res, next) => next()
}));

jest.mock('../../model/Invoice');
jest.mock('../../model/JobCard');
jest.mock('../../model/User');
jest.mock('../../model/Package');
jest.mock('../../model/Inventory');

const app = express();
app.use(express.json());
app.use('/invoices', invoiceRoutes);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({ message: err.message });
});

describe('Invoice Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /invoices/reports/income', () => {
    it('should return income report', async () => {
      Invoice.aggregate.mockResolvedValue([{ _id: "2023-10-01", income: 100, count: 1 }]);

      const res = await request(app).get('/invoices/reports/income?range=TODAY');
      expect(res.statusCode).toBe(200);
      expect(res.body.payload.report.totalIncome).toBe(100);
      expect(res.body.payload.report.data.length).toBe(1);
    });
  });

  describe('GET /invoices', () => {
    it('should return all invoices', async () => {
      Invoice.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([{ _id: 'inv1' }])
      });

      const res = await request(app).get('/invoices');
      expect(res.statusCode).toBe(200);
      expect(res.body.payload.invoices.length).toBe(1);
    });
  });
});
