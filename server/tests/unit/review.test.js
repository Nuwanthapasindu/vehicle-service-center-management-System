const reviewController = require('../../controller/review.controller');
const Review = require('../../model/Review');
const Booking = require('../../model/Booking');
const JobCard = require('../../model/JobCard');
const User = require('../../model/User');
const mongoose = require('mongoose');

jest.mock('../../model/Review', () => {
  const m = jest.fn();
  m.findOne = jest.fn();
  m.find = jest.fn();
  m.aggregate = jest.fn();
  m.prototype.save = jest.fn();
  return m;
});
jest.mock('../../model/Booking', () => ({
  findOne: jest.fn(),
}));
jest.mock('../../model/JobCard', () => ({
  findOne: jest.fn(),
}));
jest.mock('../../model/User', () => ({
  findOne: jest.fn(),
}));

jest.mock('../../validation/review.validation', () => ({
  validatedReviewAdd: jest.fn().mockReturnValue({ error: null, value: {} }),
  validatedReviewUpdate: jest.fn().mockReturnValue({ error: null, value: {} }),
  validatedAdminReply: jest.fn().mockReturnValue({ error: null, value: {} }),
  validatedReviewApproval: jest.fn().mockReturnValue({ error: null, value: {} })
}));

describe('Review Controller Unit Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addReview', () => {
    it('should add a review', async () => {
      User.findOne.mockResolvedValue({ _id: 'u1' });
      Booking.findOne.mockResolvedValue({ _id: 'b1' });
      Review.findOne.mockResolvedValue(null);

      const saveMock = jest.fn().mockResolvedValue(true);
      require('../../model/Review').prototype.save.mockImplementation(saveMock);

      const payload = { bookingId: 'b1', rating: 5 };
      const result = await reviewController.addReview(payload, '0712345678');
      
      expect(result).toBe('Review submitted successfully');
      expect(saveMock).toHaveBeenCalled();
      
      require('../../model/Review').prototype.save.mockRestore();
    });
  });

  describe('getAllPublicReviews', () => {
    it('should get public reviews', async () => {
      Review.aggregate.mockResolvedValue([{ totalReviews: 1, averageRating: 5 }]);
      
      const reviewQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([{ _id: 'r1', rating: 5, customer: { name: 'Test' } }])
      };
      Review.find.mockReturnValue(reviewQuery);
      
      const jobCardQuery = {
        populate: jest.fn().mockResolvedValue({ selectedPackage: { servicesIncluded: [] } })
      };
      require('../../model/JobCard').findOne.mockReturnValue(jobCardQuery);

      const result = await reviewController.getAllPublicReviews({});
      expect(result.reviews.length).toBe(1);
      expect(result.reviews[0].rating).toBe(5);
    });
  });
});
