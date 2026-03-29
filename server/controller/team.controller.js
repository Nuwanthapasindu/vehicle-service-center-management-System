const mongoose = require("mongoose");
const Team = require("../model/Team");
const Employee = require("../model/Employee");
const AppError = require("../error/AppError");
const  responseBuilder  = require("../util/responseBuilder");
const { validatedCreateTeam,validatedUpdateTeam } = require("../validation/team.validation");

exports.createTeam = async (payload) => {
    const { value, error} = validatedCreateTeam(payload);
    if (error) throw new AppError(error.details[0].message, 400);
    try {
        const { name, employees} = value; // Array of Employee IDs
        const team = await Team.create({ name, employees });
        
        return "Team registered successfully";
       
    } catch (error) {
        throw new AppError(error.message, error.statusCode || 500);
    }
};

// Get all teams
exports.getAllTeams = async() => {
    try {
        const teams = await Team.find({ isDeleted: false })
            .populate('employees'); // Populates employee details to get the count
        
        return teams;    

    } catch (error) {
        throw new AppError(error.message, error.statusCode || 500);
    }
};

// get a one team
exports.getTeamById = async (id) => {
    try {
        
        const team = await Team.findById(id).populate('employees');

        if (!team || team.isDeleted) {
          throw new AppError("Team not found", 404);
        }
        
        return team;
    } catch (error) {
        throw new AppError(error.message, error.statusCode || 500);
    }
};

exports.updateTeam = async (id,payload) => {
    // CHECK ID IS A VALID OBJECT ID
    if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError("Invalid Team ID", 400);
    // VALIDATE THE PAYLOAD
    const { value, error} = validatedUpdateTeam(payload);
    if (error) throw new AppError(error.details[0].message, 400);
    try {
        await Team.findByIdAndUpdate(id, value);
        return "Team updated successfully";
    } catch (error) {
        throw new AppError(error.message, error.statusCode || 500);
    }
};

exports.deleteTeam = async (id) => {
    try {
        await Team.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() });
        
        return "Team deleted successfully";
    } catch (error) {
        throw new AppError(error.message, error.statusCode || 500);
    }
};