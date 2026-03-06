const Team = require("../model/Team");
const Employee = require("../model/Employee");
const  responseBuilder  = require("../util/responseBuilder");

exports.createTeam = async (req, res, next) => {
    try {
        const { name, employees } = req.body; // Array of Employee IDs
        const team = await Team.create({ name, employees });

        // --- CLASS USAGE ---
        const builder = new responseBuilder(res);
        builder.setStatus(201);
        return builder.buildResponse({ 
            message: "Team created", 
            data: team 
        });
        //return responseBuilder(res, 201, "Team created", team);
    } catch (error) {
        next(error);
    }
};

// Skill-Based Assignment: Filter teams by required skill & availability
exports.getTeamsBySkill = async (req, res, next) => {
    try {
        const { skill } = req.query;

        // 1. Find all available employees with this skill
        const eligibleEmployees = await Employee.find({
            skills: { $in: [skill] },
            isAvailable: true,
            isDeleted: false
        }).select('_id');

        const employeeIds = eligibleEmployees.map(e => e._id);

        // 2. Find teams that have at least one of these employees
        const teams = await Team.find({
            employees: { $in: employeeIds },
            isDeleted: false
        }).populate('employees');

        // --- CLASS USAGE ---
        const builder = new responseBuilder(res);
        builder.setStatus(200);
        return builder.buildResponse({ 
            message: "Available teams with required skill", 
            data: teams 
        });

        //return responseBuilder(res, 200, "Available teams with required skill", teams);
    } catch (error) {
        next(error);
    }
};

exports.updateTeam = async (req, res, next) => {
    try {
        const updatedTeam = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
        // --- CLASS USAGE ---
        const builder = new responseBuilder(res);
        builder.setStatus(200);
        return builder.buildResponse({ 
            message: "Team updated", 
            data: updatedTeam 
        });
        //return responseBuilder(res, 200, "Team updated", updatedTeam);
    } catch (error) {
        next(error);
    }
};

exports.deleteTeam = async (req, res, next) => {
    try {
        await Team.findByIdAndUpdate(req.params.id, { isDeleted: true, deletedAt: new Date() });
        // --- CLASS USAGE ---
        const builder = new responseBuilder(res);
        builder.setStatus(200);
        return builder.buildResponse({ 
            message: "Team deleted" 
        });
        //return responseBuilder(res, 200, "Team deleted");
    } catch (error) {
        next(error);
    }
};