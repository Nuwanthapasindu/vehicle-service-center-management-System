const request = require('supertest');
const express = require('express');

const timeslotRoutes = require('../../routes/timeslot.route');
const Timeslot = require('../../model/Timeslot');
const Booking = require('../../model/Booking');

jest.mock('../../middleware/auth', () => ({
  authTokenMiddleware: (req, res, next) => {
    req.user = { mobile: '0771234567', role: 'ADMIN' };
    next();
  },
  accessControl: () => (req, res, next) => next()
}));

jest.mock('../../model/Timeslot');
jest.mock('../../model/Booking');
jest.mock('../../model/JobCard');

const app = express();
app.use(express.json());
app.use('/timeslots', timeslotRoutes);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({ message: err.message });
});

describe('Timeslot Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /timeslots/all', () => {
    it('should return all timeslots', async () => {
      Timeslot.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue([{ _id: 'slot1', startTime: '09:00' }])
      });

      const res = await request(app).get('/timeslots/all');
      expect(res.statusCode).toBe(200);
      expect(res.body.payload.slots).toBeDefined();
    });
  });

  describe('POST /timeslots', () => {
    it('should create a new timeslot', async () => {
      Timeslot.findOne.mockResolvedValue(null);
      // Hack to mock new Timeslot().save()
      jest.spyOn(require('../../model/Timeslot').prototype, 'save')
        .mockResolvedValue({ _id: 'slot1', startTime: '09:00' });
      
      // Also need validation mock
      jest.mock('../../validation/timeslot.validation', () => ({
        validateTimeslot: () => ({ error: null, value: { startTime: '09:00', endTime: '10:00' } })
      }));

      // Because we mock dynamically here, controller uses its required validation map.
      // Easiest is to bypass validation by providing good inputs
      const res = await request(app)
        .post('/timeslots')
        .send({ startTime: '09:00', endTime: '10:00', maxCapacity: 2 });

      expect(res.statusCode).toBe(201);
    });
  });

  describe('DELETE /timeslots/:id', () => {
    it('should delete a timeslot', async () => {
      const mockId = '601c2d9d1b0a40d58852e1f0';
      Timeslot.findById.mockResolvedValue({ _id: mockId, save: jest.fn().mockResolvedValue({ isDeleted: true }) });
      Booking.find.mockResolvedValue([]);
      
      const res = await request(app).delete(`/timeslots/${mockId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.payload.message).toContain('deleted successfully');
    });
  });
});
