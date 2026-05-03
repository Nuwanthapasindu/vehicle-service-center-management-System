const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

// Clear existing models to prevent OverwriteModelError
Object.keys(mongoose.models).forEach((key) => {
  delete mongoose.models[key];
});

const User = require("../../model/User");
const Vehicle = require("../../model/Vehicle");
const Booking = require("../../model/Booking");
const Timeslot = require("../../model/Timeslot");
const JobCard = require("../../model/JobCard");
const Invoice = require("../../model/Invoice");
const {
  createBooking,
  getBookingHistory,
  getDashboardData,
} = require("../../controller/booking.controller");
const AppError = require("../../error/AppError");

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
  await User.deleteMany({});
  await Vehicle.deleteMany({});
  await Booking.deleteMany({});
  await Timeslot.deleteMany({});
  await JobCard.deleteMany({});
  await Invoice.deleteMany({});
});

describe("Booking Controller Tests", () => {
  const mockMobile = "0712345678";
  let mockUser, mockVehicle, mockSlot;

  beforeEach(async () => {
    mockUser = await new User({
      name: "Test Customer",
      mobile: mockMobile,
      address: "Test Address",
      role: "CUSTOMER",
    }).save();

    mockVehicle = await new Vehicle({
      ownerId: mockUser._id,
      licensePlate: "WP-CAB-1234",
      type: "CAR",
      make: "Toyota",
      model: "Corolla",
      year: 2022,
    }).save();

    mockSlot = await new Timeslot({
      startTime: "09:00",
      endTime: "10:00",
      maxCapacity: 2,
    }).save();
  });

  describe("createBooking", () => {
    test("should create a booking successfully", async () => {
      const payload = {
        vehicle: mockVehicle._id.toString(),
        slot: mockSlot._id.toString(),
        date: new Date(Date.now() + 2 * 86400000).toISOString(), // 2 days from now
        specialNote: "Test note",
      };

      const result = await createBooking(payload, mockMobile);
      expect(result).toBeDefined();
      expect(result.vehicle.toString()).toBe(mockVehicle._id.toString());
      expect(result.slot.toString()).toBe(mockSlot._id.toString());

      const bookingCount = await Booking.countDocuments({
        customer: mockUser._id,
      });
      expect(bookingCount).toBe(1);
    });

    test("should fail if timeslot is fully booked", async () => {
      const date = new Date(Date.now() + 2 * 86400000);
      date.setHours(0, 0, 0, 0);

      const mockVehicle2 = await new Vehicle({
        ownerId: mockUser._id,
        licensePlate: "WP-CAB-5678",
        type: "CAR",
        make: "Honda",
        model: "Civic",
        year: 2021,
      }).save();

      const mockVehicle3 = await new Vehicle({
        ownerId: mockUser._id,
        licensePlate: "WP-CAB-9999",
        type: "CAR",
        make: "Nissan",
        model: "Leaf",
        year: 2020,
      }).save();

      // Fill capacity
      await new Booking({
        customer: mockUser._id,
        vehicle: mockVehicle._id,
        slot: mockSlot._id,
        date: date,
      }).save();

      await new Booking({
        customer: mockUser._id,
        vehicle: mockVehicle2._id,
        slot: mockSlot._id,
        date: date,
      }).save();

      const payload = {
        vehicle: mockVehicle3._id.toString(),
        slot: mockSlot._id.toString(),
        date: date.toISOString(),
      };

      await expect(createBooking(payload, mockMobile)).rejects.toThrow(
        "This timeslot is fully booked for the selected date",
      );
    });

    test("should fail if the same vehicle tries to book the same slot on the same day twice", async () => {
      const date = new Date(Date.now() + 2 * 86400000);
      date.setHours(0, 0, 0, 0);

      // First booking
      await createBooking(
        {
          vehicle: mockVehicle._id.toString(),
          slot: mockSlot._id.toString(),
          date: date.toISOString(),
        },
        mockMobile,
      );

      // Second booking (same vehicle, same slot, same date)
      const payload = {
        vehicle: mockVehicle._id.toString(),
        slot: mockSlot._id.toString(),
        date: date.toISOString(),
      };

      await expect(createBooking(payload, mockMobile)).rejects.toThrow(
        "This vehicle is already booked for this specific time slot on the selected date.",
      );
    });
  });

  describe("getBookingHistory", () => {
    test("should return booking history with job card details", async () => {
      const booking = await new Booking({
        customer: mockUser._id,
        vehicle: mockVehicle._id,
        slot: mockSlot._id,
        date: new Date(),
      }).save();

      // Create JobCard
      await new JobCard({
        booking: booking._id,
        status: "START",
        isDeleted: false,
      }).save();

      const history = await getBookingHistory(mockMobile);
      expect(history.length).toBe(1);
      expect(history[0].status).toBe("START");
      expect(history[0].licensePlate).toBe("WP-CAB-1234");
    });
  });

  describe("getDashboardData", () => {
    test("should return dashboard statistics", async () => {
      await new Booking({
        customer: mockUser._id,
        vehicle: mockVehicle._id,
        slot: mockSlot._id,
        date: new Date(),
      }).save();

      const data = await getDashboardData(mockMobile);
      expect(data.stats.totalVehicles).toBe(1);
      expect(data.stats.totalBookings).toBe(1);
      expect(data.recentVehicles.length).toBe(1);
    });
  });
});
