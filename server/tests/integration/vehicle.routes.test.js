const request = require('supertest');
const express = require('express');

const vehicleRoutes = require('../../routes/vehicle.route');
const Vehicle = require('../../model/Vehicle');

jest.mock('../../middleware/auth', () => ({
  authTokenMiddleware: (req, res, next) => {
    req.user = { mobile: '0771234567', role: 'CUSTOMER' };
    next();
  }
}));

jest.mock('../../model/Vehicle', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findByIdAndUpdate: jest.fn()
}));
jest.mock('../../model/User', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
}));
jest.mock('../../model/Booking', () => ({
  find: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));
jest.mock('../../model/JobCard', () => ({
  findOne: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/vehicles', vehicleRoutes);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({ message: err.message });
});

describe('Vehicle Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /vehicles/my-vehicles', () => {
    it('should return vehicles for current user', async () => {
      require('../../model/User').findOne.mockResolvedValue({ _id: 'u1' });
      Vehicle.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([{ _id: 'v1', licensePlate: 'ABC-1234' }])
      });

      const res = await request(app).get('/vehicles/my-vehicles');
      expect(res.statusCode).toBe(200);
      expect(res.body.payload).toBeDefined();
    });
  });

  describe('DELETE /vehicles/:id', () => {
    it('should soft delete vehicle', async () => {
      const mockId = '601c2d9d1b0a40d58852e1f0';
      require('../../model/User').findOne.mockResolvedValue({ _id: 'u1' });
      Vehicle.findOne.mockResolvedValue({ _id: mockId, licensePlate: 'WP-CAB-1234' });
      Vehicle.findByIdAndUpdate.mockResolvedValue({ _id: mockId });
      require('../../model/Booking').find.mockResolvedValue([]);

      const res = await request(app).delete(`/vehicles/${mockId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.payload.message).toContain('deleted successfully');
    });
  });
});
