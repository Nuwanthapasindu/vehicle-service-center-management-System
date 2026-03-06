const Employee = require("../model/Employee");
const User = require("../model/User");
const Auth = require("../model/Auth");
const  responseBuilder  = require("../util/responseBuilder");
const { hashPassword } = require("../util/password");
const mongoose = require("mongoose");

// Admin: Add Employee (User + Auth + Employee)
exports.createEmployee = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { name, mobile, address, role, dob, nic, skills, gender, userName, password } = req.body;

        // 1. Create User
        const newUser = await User.create([{
            name, mobile, address, role, isActive: true
        }], { session });

        // 2. Create Auth record (Using userName from model)
        const hashedPassword = await hashPassword(password);
        await Auth.create([{
            user: newUser[0]._id,
            userName,
            password: hashedPassword
        }], { session });

        // 3. Create Employee profile
        const newEmployee = await Employee.create([{
            user: newUser[0]._id,
            dob,
            nic,
            skills,
            gender
        }], { session });

        await session.commitTransaction();
        session.endSession();
        // --- NEW CLASS USAGE ---
        const builder = new responseBuilder(res);
        builder.setStatus(201);
        return builder.buildResponse({ 
            message: "Employee registered successfully", 
            data: newEmployee[0] 
        });
        //return responseBuilder(res, 201, "Employee registered successfully", newEmployee[0]);
    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        session.endSession();
        next(error);
    }
};

// Admin: View Employee List (With Available/Unavailable filters)
exports.getEmployees = async (req, res, next) => {
    try {
        const { isAvailable } = req.query;
        let filters = { isDeleted: false };
        
        if (isAvailable !== undefined) {
            filters.isAvailable = isAvailable === 'true';
        }

        const employees = await Employee.find(filters).populate('user');
        // --- NEW CLASS USAGE ---
        const builder = new responseBuilder(res);
        builder.setStatus(200);
        return builder.buildResponse({ 
            message: "Employees retrieved", 
            data: employees 
        });
        //return responseBuilder(res, 200, "Employees retrieved", employees);
    } catch (error) {
        next(error);
    }
};

// Admin: Update Employee Profile
exports.updateEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, mobile, address, dob, nic, skills } = req.body;

        const employee = await Employee.findById(id);
        if (!employee) return res.status(404).json({ message: "Not found" });

        // Update User info
        await User.findByIdAndUpdate(employee.user, { name, mobile, address });
        
        // Update Employee info
        const updatedEmployee = await Employee.findByIdAndUpdate(id, 
            { dob, nic, skills }, 
            { new: true }
        ).populate('user');

        // --- NEW CLASS USAGE ---
        const builder = new responseBuilder(res);
        builder.setStatus(200);
        return builder.buildResponse({ 
            message: "Profile updated", 
            data: updatedEmployee 
        });

        //return responseBuilder(res, 200, "Profile updated", updatedEmployee);
    } catch (error) {
        next(error);
    }
};

// Admin: Toggle Availability
exports.toggleAvailability = async (req, res, next) => {
    try {
        const employee = await Employee.findById(req.params.id);
        employee.isAvailable = !employee.isAvailable;
        await employee.save();

        // --- NEW CLASS USAGE ---
        const builder = new responseBuilder(res);
        builder.setStatus(200);
        return builder.buildResponse({ 
            message: `Employee availability: ${employee.isAvailable}` 
        });
        //return responseBuilder(res, 200, `Employee availability: ${employee.isAvailable}`);
    } catch (error) {
        next(error);
    }
};

// Admin: Delete Employee (Soft Delete)
exports.deleteEmployee = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { id } = req.params;

        const employee = await Employee.findById(id);
        if (!employee) return res.status(404).json({ message: "Employee not found" });

        // 1. Soft delete Employee record
        await Employee.findByIdAndUpdate(id, {
            isDeleted: true,
            deletedAt: new Date(),
            isAvailable: false
        }, { session });

        // 2. Soft delete associated User record
        await User.findByIdAndUpdate(employee.user, {
            isDeleted: true,
            deletedAt: new Date(),
            isActive: false
        }, { session });

        await session.commitTransaction();
        session.endSession();

        // --- NEW CLASS USAGE ---
        const builder = new responseBuilder(res);
        builder.setStatus(200);
        return builder.buildResponse({ 
            message: "Employee and associated user deleted successfully" 
        });

        //return responseBuilder(res, 200, "Employee and associated user deleted successfully");
    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        session.endSession();
        next(error);
    }
};