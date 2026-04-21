const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

// Clear existing models to prevent OverwriteModelError
Object.keys(mongoose.models).forEach((key) => {
  delete mongoose.models[key];
});

const Timeslot = require("../../model/Timeslot");
const Booking = require("../../model/Booking");
const JobCard = require("../../model/JobCard");
const { 
  getTimeslotById, 
  getAllTimeslots, 
  createTimeslot, 
  updateTimeslot, 
  deleteTimeslot,
  getAvailableTimeslots,
  getDailySchedule
} = require("../../controller/timeslot.controller");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Timeslot.deleteMany({});
  await Booking.deleteMany({});
  await JobCard.deleteMany({});
});

describe("Timeslot Controller Tests", () => {
  let mockSlot;

  beforeEach(async () => {
    mockSlot = await new Timeslot({
      startTime: "09:00",
      endTime: "10:00",
      maxCapacity: 2,
    }).save();
  });

  describe("createTimeslot", () => {
    test("should create a timeslot successfully", async () => {
      const payload = {
        startTime: "10:00",
        endTime: "11:00",
        maxCapacity: 3,
      };

      const result = await createTimeslot(payload);
      expect(result).toBeDefined();
      expect(result.startTime).toBe("10:00");
      
      const count = await Timeslot.countDocuments();
      expect(count).toBe(2);
    });

    test("should fail if end time is before start time", async () => {
      const payload = {
        startTime: "11:00",
        endTime: "10:00",
        maxCapacity: 3,
      };

      await expect(createTimeslot(payload)).rejects.toThrow();
    });
  });

  describe("getTimeslotById", () => {
    test("should return correct timeslot", async () => {
      const result = await getTimeslotById(mockSlot._id.toString());
      expect(result).toBeDefined();
      expect(result.startTime).toBe("09:00");
    });
  });
  
  describe("getAllTimeslots", () => {
    test("should return all timeslots", async () => {
      const result = await getAllTimeslots();
      expect(result.length).toBe(1);
    });
  });

  describe("getAvailableTimeslots", () => {
    test("should return available timeslots for a date", async () => {
      const date = new Date();
      const result = await getAvailableTimeslots(date.toISOString());
      expect(result.length).toBe(1);
      expect(result[0].booked).toBe(0);
      expect(result[0].isFull).toBe(false);
    });
  });

  describe("getDailySchedule", () => {
    test("should return daily schedule", async () => {
      const date = new Date();
      const result = await getDailySchedule(date.toISOString());
      expect(result.length).toBe(1);
      expect(result[0].status).toBe("0/2 BOOKED");
    });
  });

  describe("updateTimeslot", () => {
    test("should update a timeslot successfully", async () => {
      const payload = {
        startTime: "09:00",
        endTime: "10:30",
        maxCapacity: 5,
        isActive: true
      };

      const result = await updateTimeslot(mockSlot._id.toString(), payload);
      expect(result.endTime).toBe("10:30");
      expect(result.maxCapacity).toBe(5);
    });
  });

  describe("deleteTimeslot", () => {
    test("should soft delete a timeslot successfully", async () => {
      const result = await deleteTimeslot(mockSlot._id.toString());
      expect(result.isDeleted).toBe(true);
    });
  });
});
