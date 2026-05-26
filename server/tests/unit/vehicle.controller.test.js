const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

// Clear existing models to prevent OverwriteModelError in watch mode
Object.keys(mongoose.models).forEach((key) => {
  delete mongoose.models[key];
});

const User = require("../../model/User");
const Vehicle = require("../../model/Vehicle");
const File = require("../../model/File");
const Booking = require("../../model/Booking");
const JobCard = require("../../model/JobCard");
const Invoice = require("../../model/Invoice");
const Timeslot = require("../../model/Timeslot");
const { addVehicle, getMyVehicles, deleteVehicle, getVehicleById, updateVehicle, getAllVehicles, getVehicleDetailsAdmin } = require("../../controller/vehicle.controller");
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
  await File.deleteMany({});
  await Booking.deleteMany({});
  await JobCard.deleteMany({});
  await Invoice.deleteMany({});
  await Timeslot.deleteMany({});
});

describe("Vehicle Controller Tests", () => {
  const mockMobile = "0712345678";
  let mockUser;

  beforeEach(async () => {
    mockUser = await new User({
      name: "Test User",
      mobile: mockMobile,
      address: "123 Test St",
      role: "CUSTOMER",
      isActive: true,
    }).save();
  });

  describe("addVehicle", () => {
    test("should add a vehicle successfully", async () => {
      const payload = {
        licensePlate: "WP-CAB-1234",
        type: "CAR",
        make: "Toyota",
        model: "Corolla",
        year: 2022,
      };

      const result = await addVehicle(payload, mockMobile);
      expect(result).toBe("Vehicle added successfully");

      const savedVehicle = await Vehicle.findOne({
        licensePlate: "WP-CAB-1234",
      });
      expect(savedVehicle).not.toBeNull();
      expect(savedVehicle.make).toBe("Toyota");
      expect(savedVehicle.year).toBe(2022);
      expect(savedVehicle.ownerId.toString()).toBe(mockUser._id.toString());
    });

    test("should add a vehicle with an image successfully", async () => {
      const mockFile = await new File({
        originalName: "test.png",
        fileName: "1711580000000-test.png",
        filePath: "uploads/1711580000000-test.png",
        fileType: "image/png",
        fileSize: 1024,
      }).save();

      const payload = {
        licensePlate: "WP-CAB-4321",
        type: "CAR",
        make: "Toyota",
        model: "Corolla",
        year: 2021,
        image: mockFile._id.toString(),
      };

      const result = await addVehicle(payload, mockMobile);
      expect(result).toBe("Vehicle added successfully");

      const savedVehicle = await Vehicle.findOne({
        licensePlate: "WP-CAB-4321",
      });
      expect(savedVehicle.image.toString()).toBe(mockFile._id.toString());
    });

    test("should fail if validation fails (e.g., missing license plate)", async () => {
      const payload = {
        type: "CAR",
        make: "Toyota",
        model: "Corolla",
      };

      await expect(addVehicle(payload, mockMobile)).rejects.toThrow(AppError);
    });

    test("should fail if user not found", async () => {
      const payload = {
        licensePlate: "WP-CAB-1234",
        type: "CAR",
        make: "Toyota",
        model: "Corolla",
        year: 2022,
      };

      await expect(addVehicle(payload, "0000000000")).rejects.toThrow(
        "Owner not found",
      );
    });

    test("should fail if license plate already exists", async () => {
      await new Vehicle({
        ownerId: mockUser._id,
        licensePlate: "WP-CAB-1234",
        type: "CAR",
        make: "Honda",
        model: "Civic",
        year: 2020,
      }).save();

      const payload = {
        licensePlate: "WP-CAB-1234",
        type: "CAR",
        make: "Toyota",
        model: "Corolla",
        year: 2022,
      };

      await expect(addVehicle(payload, mockMobile)).rejects.toThrow(
        "License plate already registered",
      );
    });
  });

  describe("getMyVehicles", () => {
    test("should return user's non-deleted vehicles", async () => {
      await new Vehicle({
        ownerId: mockUser._id,
        licensePlate: "WP-CAB-1234",
        type: "CAR",
        make: "Toyota",
        model: "Corolla",
        year: 2021,
      }).save();

      await new Vehicle({
        ownerId: mockUser._id,
        licensePlate: "WP-CAB-5678",
        type: "VAN",
        make: "Toyota",
        model: "Hiace",
        year: 2018,
        isDeleted: true,
      }).save();

      const vehicles = await getMyVehicles(mockMobile);
      expect(vehicles.length).toBe(1);
      expect(vehicles[0].licensePlate).toBe("WP-CAB-1234");
    });
  });

  describe("deleteVehicle", () => {
    test("should soft delete a vehicle", async () => {
      const vehicle = await new Vehicle({
        ownerId: mockUser._id,
        licensePlate: "WP-CAB-1234",
        type: "CAR",
        make: "Toyota",
        model: "Corolla",
        year: 2022,
      }).save();

      const result = await deleteVehicle(vehicle._id, mockMobile);
      expect(result).toBe("Vehicle deleted successfully");

      const deletedVehicle = await Vehicle.findById(vehicle._id);
      expect(deletedVehicle.isDeleted).toBe(true);
      expect(deletedVehicle.deletedAt).not.toBeNull();
    });

    test("should fail if vehicle does not belong to user", async () => {
      const otherUser = await new User({
        name: "Other User",
        mobile: "0777777777",
        address: "456 Other Dr",
        role: "CUSTOMER",
      }).save();

      const vehicle = await new Vehicle({
        ownerId: otherUser._id,
        licensePlate: "WP-CAB-1234",
        type: "CAR",
        make: "Toyota",
        model: "Corolla",
        year: 2019,
      }).save();

      await expect(deleteVehicle(vehicle._id, mockMobile)).rejects.toThrow(
        "Vehicle not found",
      );
    });
  });

  describe("getVehicleById", () => {
    test("should return vehicle details", async () => {
      const vehicle = await new Vehicle({
        ownerId: mockUser._id,
        licensePlate: "WP-CAB-1234",
        type: "CAR",
        make: "Toyota",
        model: "Corolla",
        year: 2022,
      }).save();

      const result = await getVehicleById(vehicle._id, mockMobile);
      expect(result.licensePlate).toBe("WP-CAB-1234");
    });
  });

  describe("updateVehicle", () => {
    test("should update vehicle details", async () => {
      const vehicle = await new Vehicle({
        ownerId: mockUser._id,
        licensePlate: "WP-CAB-1234",
        type: "CAR",
        make: "Toyota",
        model: "Corolla",
        year: 2022,
      }).save();

      const payload = {
        model: "Camry",
        year: 2023,
      };

      const result = await updateVehicle(vehicle._id, mockMobile, payload);
      expect(result).toBe("Vehicle updated successfully");

      const updatedVehicle = await Vehicle.findById(vehicle._id);
      expect(updatedVehicle.model).toBe("Camry");
      expect(updatedVehicle.year).toBe(2023);
    });

    test("should fail if new license plate is already taken by another vehicle", async () => {
      const vehicle1 = await new Vehicle({
        ownerId: mockUser._id,
        licensePlate: "WP-CAB-1111",
        type: "CAR",
        make: "Toyota",
        model: "Corolla",
        year: 2021,
      }).save();

      await new Vehicle({
        ownerId: mockUser._id,
        licensePlate: "WP-CAB-2222",
        type: "CAR",
        make: "Honda",
        model: "Civic",
        year: 2018,
      }).save();

      const payload = {
        licensePlate: "WP-CAB-2222",
      };

      await expect(
        updateVehicle(vehicle1._id, mockMobile, payload),
      ).rejects.toThrow("A vehicle with this license plate already exists");
    });
  });

  describe("getAllVehicles", () => {
    test("should return all vehicles with owners and images populated", async () => {
      const mockFile = await new File({
        originalName: "test.png",
        fileName: "1711580000000-test.png",
        filePath: "uploads/1711580000000-test.png",
        fileType: "image/png",
        fileSize: 1024,
      }).save();

      await new Vehicle({
        ownerId: mockUser._id,
        licensePlate: "WP-CAB-1111",
        type: "CAR",
        make: "Toyota",
        model: "Corolla",
        year: 2021,
        image: mockFile._id,
      }).save();

      const secondUser = await new User({
        name: "Second User",
        mobile: "0771234567",
        address: "456 Second Rd",
        role: "CUSTOMER",
        isActive: true,
      }).save();

      await new Vehicle({
        ownerId: secondUser._id,
        licensePlate: "WP-CAB-2222",
        type: "VAN",
        make: "Toyota",
        model: "Hiace",
        year: 2018,
      }).save();

      const result = await getAllVehicles();
      expect(result.length).toBe(2);
      expect(result[0].licensePlate).toBe("WP-CAB-2222"); // sorted by createdAt desc
      expect(result[0].ownerId.name).toBe("Second User");
      expect(result[1].licensePlate).toBe("WP-CAB-1111");
      expect(result[1].ownerId.name).toBe("Test User");
      expect(result[1].image.originalName).toBe("test.png");
    });

    test("should search vehicles by license plate", async () => {
      await new Vehicle({
        ownerId: mockUser._id,
        licensePlate: "WP-CAB-1111",
        type: "CAR",
        make: "Toyota",
        model: "Corolla",
        year: 2021,
      }).save();

      await new Vehicle({
        ownerId: mockUser._id,
        licensePlate: "WP-XYZ-9999",
        type: "SUV",
        make: "Toyota",
        model: "Land Cruiser",
        year: 2022,
      }).save();

      const searchResult1 = await getAllVehicles("XYZ");
      expect(searchResult1.length).toBe(1);
      expect(searchResult1[0].licensePlate).toBe("WP-XYZ-9999");

      const searchResult2 = await getAllVehicles("1111");
      expect(searchResult2.length).toBe(1);
      expect(searchResult2[0].licensePlate).toBe("WP-CAB-1111");

      const searchResult3 = await getAllVehicles("abc");
      expect(searchResult3.length).toBe(0);
    });
  });

  describe("getVehicleDetailsAdmin", () => {
    test("should return full vehicle details, total expenditure, and service history", async () => {
      const mockFile = await new File({
        originalName: "avatar.png",
        fileName: "1711580000000-avatar.png",
        filePath: "uploads/1711580000000-avatar.png",
        fileType: "image/png",
        fileSize: 512,
      }).save();

      const vehicle = await new Vehicle({
        ownerId: mockUser._id,
        licensePlate: "WP-CAB-1234",
        type: "CAR",
        make: "Toyota",
        model: "Corolla",
        year: 2022,
        image: mockFile._id,
      }).save();

      // Create mock booking
      const booking = await new Booking({
        customer: mockUser._id,
        vehicle: vehicle._id,
        date: new Date("2026-05-20"),
        slot: new mongoose.Types.ObjectId(),
      }).save();

      // Create mock JobCard
      const jobCard = await new JobCard({
        booking: booking._id,
        status: "FINISH",
        milageCount: 15000,
        createdAt: new Date("2026-05-20"),
      }).save();

      // Create mock Invoice
      const invoice = await new Invoice({
        jobCard: jobCard._id,
        customer: mockUser._id,
        selectedPackage: {
          package: new mongoose.Types.ObjectId(),
          selectedPackageTier: {
            name: "Standard",
            price: 12500,
          },
        },
        invoiceId: "INV-1001",
      }).save();

      const result = await getVehicleDetailsAdmin(vehicle._id.toString());
      expect(result.vehicle).toBeDefined();
      expect(result.vehicle.licensePlate).toBe("WP-CAB-1234");
      expect(result.vehicle.ownerId.name).toBe("Test User");
      expect(result.vehicle.image.originalName).toBe("avatar.png");
      expect(result.totalExpenditure).toBe(12500);
      expect(result.serviceHistory.length).toBe(1);
      expect(result.serviceHistory[0].milageCount).toBe(15000);
      expect(result.serviceHistory[0].cost).toBe(12500);
      expect(result.serviceHistory[0].invoiceId).toBe("INV-1001");
    });

    test("should return details even for soft-deleted vehicles, but fail if vehicle does not exist", async () => {
      const vehicle = await new Vehicle({
        ownerId: mockUser._id,
        licensePlate: "WP-CAB-9999",
        type: "CAR",
        make: "Toyota",
        model: "Corolla",
        year: 2022,
        isDeleted: true,
      }).save();

      const result = await getVehicleDetailsAdmin(vehicle._id.toString());
      expect(result.vehicle).toBeDefined();
      expect(result.vehicle.isDeleted).toBe(true);
      expect(result.vehicle.licensePlate).toBe("WP-CAB-9999");
      
      await expect(getVehicleDetailsAdmin(new mongoose.Types.ObjectId().toString())).rejects.toThrow("Vehicle not found");
    });
  });
});
