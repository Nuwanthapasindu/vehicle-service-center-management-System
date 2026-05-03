const mongoose = require("mongoose");
const Employee = require("../../model/Employee");
const User = require("../../model/User");
const Auth = require("../../model/Auth");
const Team = require("../../model/Team");
const {
  createEmployee,
  getEmployees,
  updateEmployee,
  toggleAvailability,
  deleteEmployee,
} = require("../../controller/employee.controller");
const AppError = require("../../error/AppError");
const { hashPassword } = require("../../util/password");

// Mock hashPassword function
jest.mock("../../util/password", () => ({
  hashPassword: jest.fn((password) => `hashed-${password}`),
}));

// Manual mocks for Mongoose methods
Employee.findOne = jest.fn();
Employee.findById = jest.fn();
Employee.findByIdAndUpdate = jest.fn();
Employee.find = jest.fn();
Employee.create = jest.fn();
User.create = jest.fn();
Auth.create = jest.fn();

User.findOne = jest.fn();
User.exists = jest.fn();
User.create = jest.fn();
User.findByIdAndUpdate = jest.fn();

Auth.findOne = jest.fn();
Auth.exists = jest.fn();
Auth.create = jest.fn();
Auth.findByIdAndUpdate = jest.fn();

Employee.exists = jest.fn();
Team.updateMany = jest.fn();

describe("Employee Controller Unit Tests (Manual Mocks Fixed)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const validId = "507f1f77bcf86cd799439011"; // valid ObjectId string
  const validPayload = {
    name: "John Doe",
    mobile: "0712345678", // valid SL mobile
    address: "123 Street",
    role: "MECHANIC",
    userName: "johnmech12",
    password: "Password@123", // valid password
    dob: "1990-01-01",
    nic: "900001234V",
    skills: ["skill1", "skill2"],
    gender: "MALE",
  };

  // createEmployee
  describe("createEmployee", () => {
    it("should create employee successfully", async () => {
      User.findOne.mockResolvedValue(null);
      Employee.findOne.mockResolvedValue(null);
      Auth.findOne.mockResolvedValue(null);

      User.create.mockResolvedValue({ _id: "userId1", ...validPayload });
      Auth.create.mockResolvedValue({ _id: "authId1" });
      Employee.create.mockResolvedValue({ _id: "empId1" });

      const result = await createEmployee(validPayload);

      expect(result).toBe("Employee registered successfully");
      expect(hashPassword).toHaveBeenCalledWith("Password@123");
      expect(User.create).toHaveBeenCalled();
      expect(Auth.create).toHaveBeenCalled();
      expect(Employee.create).toHaveBeenCalled();
    });

    it("should throw error if mobile exists", async () => {
      User.findOne.mockResolvedValue({ _id: "existingUser" });
      await expect(createEmployee(validPayload)).rejects.toThrow(
        "Mobile number already exist",
      );
    });

    it("should throw error if NIC exists", async () => {
      User.findOne.mockResolvedValue(null);
      Employee.findOne.mockResolvedValue({ _id: "existingEmp" });
      await expect(createEmployee(validPayload)).rejects.toThrow(
        "NIC already exist",
      );
    });

    it("should throw error if username exists", async () => {
      User.findOne.mockResolvedValue(null);
      Employee.findOne.mockResolvedValue(null);
      Auth.findOne.mockResolvedValue({ _id: "existingAuth" });
      await expect(createEmployee(validPayload)).rejects.toThrow(
        "Username already exist",
      );
    });
  });

  // getEmployees
  describe("getEmployees", () => {
    it("should return employees with isAvailable filter", async () => {
      Employee.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue([
            { _id: "emp1", isAvailable: true, user: { name: "John" } },
            { _id: "emp2", isAvailable: true, user: { name: "Jane" } },
          ]),
        }),
      });

      const employees = await getEmployees({ isAvailable: "true" });
      expect(employees.length).toBe(2);
      expect(employees[0].user.name).toBe("John");
    });

    it("should return all employees if no filter", async () => {
      Employee.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          select: jest
            .fn()
            .mockResolvedValue([
              { _id: "emp1", isAvailable: true, user: { name: "John" } },
            ]),
        }),
      });

      const employees = await getEmployees({});
      expect(employees.length).toBe(1);
    });
  });

  // updateEmployee
  describe("updateEmployee", () => {
    it("should update employee successfully", async () => {
      const payload = { name: "Updated Name", password: "NewPass@123" };

      Employee.findById.mockResolvedValue({ _id: validId, user: "userId1" });
      User.exists.mockResolvedValue(null);
      Employee.exists.mockResolvedValue(null);
      Auth.exists.mockResolvedValue(null);
      User.findByIdAndUpdate.mockResolvedValue({});
      Auth.findOne.mockResolvedValue({ _id: "authId1" });
      Auth.findByIdAndUpdate.mockResolvedValue({});
      Employee.findByIdAndUpdate.mockResolvedValue({});

      const result = await updateEmployee(validId, payload);
      expect(result).toBe("Employee updated successfully");
    });

    it("should throw error if employee not found", async () => {
      Employee.findById.mockResolvedValue(null);
      await expect(updateEmployee(validId, {})).rejects.toThrow(
        "Employee not found",
      );
    });
  });

  // toggleAvailability
  describe("toggleAvailability", () => {
    it("should toggle availability successfully", async () => {
      const employee = { _id: validId, isAvailable: true, save: jest.fn() };
      Employee.findById.mockResolvedValue(employee);

      const result = await toggleAvailability(validId);
      expect(employee.isAvailable).toBe(false);
      expect(employee.save).toHaveBeenCalled();
      expect(result).toBe("Employee availability: false");
    });

    it("should throw error if employee not found", async () => {
      Employee.findById.mockResolvedValue(null);
      await expect(toggleAvailability(validId)).rejects.toThrow();
    });
  });

  // deleteEmployee
  describe("deleteEmployee", () => {
    it("should soft delete employee and user", async () => {
      const employee = { _id: validId, user: "userId1" };
      Employee.findById.mockResolvedValue(employee);
      Employee.findByIdAndUpdate.mockResolvedValue({});
      User.findByIdAndUpdate.mockResolvedValue({});
      Team.updateMany.mockResolvedValue({});

      const result = await deleteEmployee(validId);
      expect(result).toBe("Employee and associated user deleted successfully");
    });

    it("should throw error if employee not found", async () => {
      Employee.findById.mockResolvedValue(null);
      await expect(deleteEmployee(validId)).rejects.toThrow(
        "Employee not found",
      );
    });
  });
});
