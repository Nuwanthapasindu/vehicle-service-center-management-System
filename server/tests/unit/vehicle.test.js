const vehicleController = require('../../controller/vehicle.controller');
const Vehicle = require('../../model/Vehicle');
const User = require('../../model/User');

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
jest.mock('../../validation/vehicle.validation', () => ({
  validateVehicle: () => ({ error: null, value: {} })
}));

describe('Vehicle Controller Unit Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMyVehicles', () => {
    it('should get my vehicles', async () => {
      User.findOne.mockResolvedValue({ _id: 'u1' });
      
      const vehicleQuery = {
        populate: jest.fn().mockReturnThis(),
      };
      vehicleQuery.sort = jest.fn(resolve => Promise.resolve([{ licensePlate: 'ABC-1234' }]));
      Vehicle.find.mockReturnValue(vehicleQuery);
      
      const result = await vehicleController.getMyVehicles('0771234567');
      expect(result.length).toBe(1);
      expect(result[0].licensePlate).toBe('ABC-1234');
    });
  });

  describe('deleteVehicle', () => {
    it('should soft delete vehicle', async () => {
      const mockId = '64ff3f3b9000a00b00c0000a';
      User.findOne.mockResolvedValue({ _id: 'u1' });
      Vehicle.findOne.mockResolvedValue({ _id: mockId });
      Vehicle.findByIdAndUpdate.mockResolvedValue({ _id: mockId });
      
      const result = await vehicleController.deleteVehicle(mockId, '0771234567');
      expect(result).toBeDefined();
    });
  });
});
