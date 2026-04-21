const bookingController = require('../../controller/booking.controller');
const Booking = require('../../model/Booking');

jest.mock('../../model/Booking', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
}));
jest.mock('../../model/JobCard', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
}));
jest.mock('../../model/User', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
}));
jest.mock('../../model/Vehicle', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
}));
jest.mock('../../model/Timeslot', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
}));
jest.mock('../../model/File', () => ({
  findById: jest.fn(),
}));
jest.mock('../../model/Team', () => ({
  find: jest.fn(),
}));

describe('Booking Controller Unit Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAdminBookingDetails', () => {
    it('should get admin booking details', async () => {
      const mockId = '64ff3f3b9000a00b00c0000a';
      const bookingQuery = {
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
      };
      bookingQuery.then = jest.fn(resolve => resolve({ _id: mockId, date: new Date() }));
      Booking.findById.mockReturnValue(bookingQuery);

      const jobCardQuery = {
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
      };
      jobCardQuery.then = jest.fn(resolve => resolve(null));
      require('../../model/JobCard').findOne.mockReturnValue(jobCardQuery);

      const teamQuery = {
        select: jest.fn().mockReturnThis(),
      };
      teamQuery.then = jest.fn(resolve => resolve([]));
      require('../../model/Team').find.mockReturnValue(teamQuery);

      const result = await bookingController.getAdminBookingDetails(mockId);
      expect(result.status).toBe('PENDING');
    });
  });

  describe('cancelBookingByAdmin', () => {
    it('should cancel booking by admin', async () => {
      const mockId = '64ff3f3b9000a00b00c0000a';
      Booking.findOne.mockResolvedValue({ _id: mockId, save: jest.fn().mockResolvedValue({ isDeleted: true }) });

      const result = await bookingController.cancelBookingByAdmin(mockId);
      expect(result.message).toContain('cancelled');
    });
  });
});
