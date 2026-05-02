const mongoose = require("mongoose");
const Team = require("../model/Team");
const Employee = require("../model/Employee");
const AppError = require("../error/AppError");
const {
  validatedCreateTeam,
  validatedUpdateTeam,
} = require("../validation/team.validation");

exports.createTeam = async (payload) => {
  const { value, error } = validatedCreateTeam(payload);
  if (error) throw new AppError(error.details[0].message, 400);
  try {
    const { name, employees } = value; // Array of Employee IDs

    // CHECK TEAM NAME ALREADY EXIST
    const existingTeam = await Team.exists({ name, isDeleted: false });
    if (existingTeam) throw new AppError("Team name already exist", 400);

    // CHECK EMPLOYEE IDs ARE VALID AND NOT DELETED
    for (const id of employees) {
      if (!mongoose.Types.ObjectId.isValid(id))
        throw new AppError("Invalid employee ID", 400);
    }
    const existingEmployees = await Employee.find({
      _id: { $in: employees },
      isDeleted: false,
    });
    if (existingEmployees.length !== employees.length)
      throw new AppError("Employee not found", 400);

    await Team.create({ name, employees });

    return "Team registered successfully";
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};

// Get all teams
exports.getAllTeams = async () => {
  try {
    const teams = await Team.find({ isDeleted: false })
      .populate({
        path: "employees",
        select: ["-isDeleted", "-deletedAt", "-__v"],
      })
      .select(["-__v", "-isDeleted", "-deletedAt"]) // Populates employee details to get the count
      .sort({ createdAt: -1 });
    return teams;
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};

// get a one team
exports.getTeamById = async (id) => {
  try {
    // CHECK ID IS A VALID OBJECT ID
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new AppError("Invalid Team ID", 400);

    const team = await Team.findById(id)
      .populate({
        path: "employees",
        select: ["-isDeleted", "-deletedAt", "-__v"],
      })
      .lean();

    if (!team || team.isDeleted) {
      throw new AppError("Team not found", 404);
    }
    const { __v, isDeleted, deletedAt, ...rest } = team;

    return rest;
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};

exports.updateTeam = async (id, payload) => {
  // CHECK ID IS A VALID OBJECT ID
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new AppError("Invalid Team ID", 400);
  // VALIDATE THE PAYLOAD
  const { value, error } = validatedUpdateTeam(payload);
  if (error) throw new AppError(error.details[0].message, 400);
  try {
    const existingTeam = await Team.exists({
      name: value.name,
      isDeleted: false,
      _id: { $ne: id },
    });
    if (existingTeam) throw new AppError("Team name already exist", 400);
    if (Array.isArray(value.employees) && value.employees.length > 0) {
      for (const id of value.employees) {
        if (!mongoose.Types.ObjectId.isValid(id))
          throw new AppError("Invalid employee ID", 400);
      }
      const existingEmployees = await Employee.find({
        _id: { $in: value.employees },
        isDeleted: false,
      });
      if (existingEmployees.length !== value.employees.length)
        throw new AppError("Employee not found", 400);
    }
    await Team.findByIdAndUpdate(id, value);
    return "Team updated successfully";
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};

exports.deleteTeam = async (id) => {
  try {
    // CHECK ID IS A VALID OBJECT ID
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new AppError("Invalid Team ID", 400);
    const team = await Team.findById(id);
    if (!team || team.isDeleted) {
      throw new AppError("Team not found", 404);
    }
    await Team.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
    });

    return "Team deleted successfully";
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};
