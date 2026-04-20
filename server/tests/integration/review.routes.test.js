const request = require('supertest');
const express = require('express');

const reviewRoutes = require('../../routes/review.route');
const Review = require('../../model/Review');

jest.mock('../../middleware/auth', () => ({
  authTokenMiddleware: (req, res, next) => {
    req.user = { mobile: '0771234567', role: 'ADMIN' };
    next();
  },
  accessControl: () => (req, res, next) => next()
}));

jest.mock('../../model/Review', () => {
  const m = jest.fn();
  m.findOne = jest.fn();
  m.find = jest.fn();
  m.findById = jest.fn();
  m.aggregate = jest.fn();
  m.prototype.save = jest.fn();
  return m;
});
jest.mock('../../model/JobCard', () => ({
  findOne: jest.fn(),
}));
jest.mock('../../model/User', () => ({
  findOne: jest.fn(),
}));
jest.mock('../../model/Booking', () => ({
  findOne: jest.fn(),
}));

jest.mock('../../validation/review.validation', () => ({
  validatedReviewAdd: () => ({ error: null, value: {} }),
  validatedReviewUpdate: () => ({ error: null, value: {} }),
  validatedAdminReply: () => ({ error: null, value: {} }),
  validatedReviewApproval: () => ({ error: null, value: {} })
}));

const app = express();
app.use(express.json());
app.use('/reviews', reviewRoutes);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({ message: err.message });
});

describe('Review Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /reviews/', () => {
    it('should return public reviews', async () => {
      Review.aggregate.mockResolvedValue([{ totalReviews: 1, averageRating: 5 }]);
      const reviewQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([{ _id: 'r1', rating: 5 }])
      };
      Review.find.mockReturnValue(reviewQuery);
      
      const jobCardQuery = {
        populate: jest.fn().mockResolvedValue(null)
      };
      require('../../model/JobCard').findOne.mockReturnValue(jobCardQuery);

      const res = await request(app).get('/reviews/');
      expect(res.statusCode).toBe(200);
      expect(res.body.payload.reviews).toBeDefined();
    });
  });

  describe('POST /reviews/', () => {
    it('should create a review', async () => {
      require('../../model/User').findOne.mockResolvedValue({ _id: 'u1' });
      require('../../model/Booking').findOne.mockResolvedValue({ _id: 'b1' });
      Review.findOne.mockResolvedValue(null);
      
      require('../../model/Review').prototype.save.mockResolvedValue(true);

      const res = await request(app)
        .post('/reviews/')
        .send({ bookingId: 'b1', rating: 5, comment: 'Great!' });

      expect(res.statusCode).toBe(201);
      expect(res.body.payload.message || res.body.payload).toContain('Review submitted');
      
      require('../../model/Review').prototype.save.mockRestore();
    });
  });
});
