const timeslotController = require('../../controller/timeslot.controller');
const Timeslot = require('../../model/Timeslot');
const Booking = require('../../model/Booking');

jest.mock('../../model/Timeslot', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
}));
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

describe('Timeslot Controller Unit Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTimeslots', () => {
    it('should return all timeslots', async () => {
      const mockData = [{ startTime: '09:00' }];
      Timeslot.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockData)
      });

      const result = await timeslotController.getAllTimeslots();
      expect(result).toEqual(mockData);
    });
  });

  describe('deleteTimeslot', () => {
    it('should delete timeslot', async () => {
      const mockId = '64ff3f3b9000a00b00c0000a';
      Timeslot.findById.mockResolvedValue({ _id: mockId, save: jest.fn().mockResolvedValue({ isDeleted: true }) });
      Booking.find.mockResolvedValue([]);
      
      const result = await timeslotController.deleteTimeslot(mockId);
      expect(result.isDeleted).toBe(true);
    });
  });
});
