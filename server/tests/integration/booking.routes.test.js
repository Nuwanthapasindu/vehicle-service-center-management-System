const request = require('supertest');
const express = require('express');

const bookingRoutes = require('../../routes/booking.route');
const Booking = require('../../model/Booking');

jest.mock('../../middleware/auth', () => ({
  authTokenMiddleware: (req, res, next) => {
    req.user = { mobile: '0771234567', role: 'ADMIN' };
    next();
  },
  accessControl: () => (req, res, next) => next()
}));

jest.mock('../../model/Booking', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
}));
jest.mock('../../model/Vehicle', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
}));
jest.mock('../../model/User', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
}));
jest.mock('../../model/JobCard', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
}));
jest.mock('../../model/Review', () => ({
  findOne: jest.fn(),
}));
jest.mock('../../model/Invoice', () => ({
  findOneAndUpdate: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/bookings', bookingRoutes);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({ message: err.message });
});

describe('Booking Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /bookings/my-history', () => {
    it('should return user booking history', async () => {
      // the controller maps inside History
      // Just test route returns 200 properly mock
      const mockUser = { _id: 'u1' };
      require('../../model/User').findOne.mockResolvedValue(mockUser);
      Booking.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([{ _id: 'b1' }])
      });
      require('../../model/JobCard').findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });
      require('../../model/Review').findOne.mockResolvedValue(null);

      const res = await request(app).get('/bookings/my-history');
      expect(res.statusCode).toBe(200);
      expect(res.body.payload).toBeDefined();
    });
  });

  describe('DELETE /bookings/admin/:id', () => {
    it('should delete a booking', async () => {
      const mockId = '601c2d9d1b0a40d58852e1f0';
      Booking.findOne.mockResolvedValue({ _id: mockId, save: jest.fn().mockResolvedValue({ isDeleted: true }) });
      const JobCard = require('../../model/JobCard');
      JobCard.findOne.mockResolvedValue(null);

      const res = await request(app).delete(`/bookings/admin/${mockId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.payload.message).toContain('cancelled successfully');
    });
  });
});
