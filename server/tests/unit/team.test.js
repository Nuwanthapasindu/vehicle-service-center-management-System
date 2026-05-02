const mongoose = require("mongoose");
const Team = require("../../model/Team");
const Employee = require("../../model/Employee");
const AppError = require("../../error/AppError");
const {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
} = require("../../controller/team.controller");

// Manual mocks — must be set up before any tests run
Team.exists = jest.fn();
Team.create = jest.fn();
Team.find = jest.fn();
Team.findById = jest.fn();
Team.findByIdAndUpdate = jest.fn();

Employee.find = jest.fn();

describe("Team Service Unit Tests (Manual Mocks)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const validId = "507f1f77bcf86cd799439011";

  const validPayload = {
    name: "Dev Team",
    employees: [validId],
  };

  // createTeam
  describe("createTeam", () => {
    it("should create team successfully", async () => {
      Team.exists.mockResolvedValue(null); // no duplicate name
      Employee.find.mockResolvedValue([{ _id: validId }]); // employees exist
      Team.create.mockResolvedValue({ _id: "team1", ...validPayload });

      const result = await createTeam(validPayload);

      expect(result).toBe("Team registered successfully");
      expect(Team.create).toHaveBeenCalled();
    });

    it("should throw error if team name already exists", async () => {
      Team.exists.mockResolvedValue({ _id: "existingTeam" });

      await expect(createTeam(validPayload)).rejects.toThrow(
        "Team name already exist",
      );
    });

    it("should throw error if validation fails", async () => {
      const invalidPayload = { name: "" };

      await expect(createTeam(invalidPayload)).rejects.toThrow();
    });
  });

  // getAllTeams
  describe("getAllTeams", () => {
    it("should return all teams", async () => {
      const mockTeams = [{ name: "Team A" }, { name: "Team B" }];

      Team.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockTeams),
      });

      const result = await getAllTeams();

      expect(result.length).toBe(2);
      expect(result[0].name).toBe("Team A");
    });
  });

  // getTeamById
  describe("getTeamById", () => {
    it("should return team by id", async () => {
      const mockTeam = {
        _id: validId,
        name: "Team A",
        isDeleted: false,
      };

      Team.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockTeam),
      });

      const result = await getTeamById(validId);

      expect(result.name).toBe("Team A");
    });

    it("should throw error if team not found", async () => {
      Team.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(null),
      });

      await expect(getTeamById(validId)).rejects.toThrow("Team not found");
    });

    it("should throw error if team is deleted", async () => {
      Team.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue({ isDeleted: true }),
      });

      await expect(getTeamById(validId)).rejects.toThrow("Team not found");
    });
  });

  // updateTeam
  describe("updateTeam", () => {
    it("should update team successfully", async () => {
      Team.exists.mockResolvedValue(null); // no duplicate name
      Employee.find.mockResolvedValue([{ _id: validId }]); // employees exist
      Team.findByIdAndUpdate.mockResolvedValue({});

      const result = await updateTeam(validId, {
        name: "Updated Team",
        employees: [validId],
      });

      expect(result).toBe("Team updated successfully");
    });

    it("should throw error for invalid ID", async () => {
      await expect(updateTeam("invalid-id", {})).rejects.toThrow(
        "Invalid Team ID",
      );
    });

    it("should throw validation error", async () => {
      await expect(updateTeam(validId, { name: "" })).rejects.toThrow();
    });
  });

  // deleteTeam
  describe("deleteTeam", () => {
    it("should soft delete team", async () => {
      Team.findById.mockResolvedValue({ _id: validId, isDeleted: false });
      Team.findByIdAndUpdate.mockResolvedValue({});

      const result = await deleteTeam(validId);

      expect(result).toBe("Team deleted successfully");
    });

    it("should throw error if team not found", async () => {
      Team.findById.mockResolvedValue(null);

      await expect(deleteTeam(validId)).rejects.toThrow("Team not found");
    });
  });
});
