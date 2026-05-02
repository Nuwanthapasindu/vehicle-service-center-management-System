const mongoose = require("mongoose");
const Employee = require("../model/Employee");
const User = require("../model/User");
const Auth = require("../model/Auth");
const Team = require("../model/Team");
const { hashPassword } = require("../util/password");
const {
  validatedCreateEmployee,
  validatedUpdateEmployee,
} = require("../validation/employee.validation");
const AppError = require("../error/AppError");

// Admin: Add Employee (User + Auth + Employee)
exports.createEmployee = async (payload) => {
  //  VALIDATE PAYLOAD
  const { value, error } = validatedCreateEmployee(payload);
  if (error) throw new AppError(error.details[0].message, 400);
  try {
    // CHECK MOBILE NUMBER ALLREADY EXIST
    const existingUser = await User.findOne({ mobile: value.mobile });
    if (existingUser) throw new AppError("Mobile number already exist", 400);

    //  CHECK NIC ALLREADY EXIST
    const existingNic = await Employee.findOne({ nic: value.nic });
    if (existingNic) throw new AppError("NIC already exist", 400);

    //  CHECK USERNAME ALLREADY EXIST
    const existingUserName = await Auth.findOne({ userName: value.userName });
    if (existingUserName) throw new AppError("Username already exist", 400);

    //  CREATE USER
    const newUser = await User.create({
      name: value.name,
      mobile: value.mobile,
      address: value.address,
      role: value.role,
      isActive: true,
    });

    //  CREATE AUTH
    const hashedPassword = await hashPassword(value.password);
    await Auth.create({
      user: newUser._id,
      userName: value.userName,
      password: hashedPassword,
    });

    //  CREATE EMPLOYEE
    await Employee.create({
      user: newUser._id,
      dob: value.dob,
      nic: value.nic,
      skills: value.skills,
      gender: value.gender,
      isAvailable: value.isAvailable,
    });

    return "Employee registered successfully";
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};

// Admin: View Employee List (With Available/Unavailable filters)
exports.getEmployees = async (query) => {
  try {
    const { isAvailable } = query;
    let filters = { isDeleted: false };

    if (isAvailable !== undefined) {
      filters.isAvailable = isAvailable === "true";
    }
    const employees = await Employee.find(filters)
      .populate({ path: "user", select: ["-__v", "-isDeleted", "-deletedAt"] })
      .select(["-__v", "-isDeleted", "-deletedAt"]);
    return employees;
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};

// Admin: Update Employee Profile
exports.updateEmployee = async (id, payload) => {
  // VALIDATE PAYLOAD
  const { error, value } = validatedUpdateEmployee(payload);
  if (error) throw new AppError(error.details[0].message, 400);
  // CHECK ID IS A VALID OBJECT ID
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new AppError("Invalid employee ID", 400);
  try {
    const {
      name,
      mobile,
      address,
      userName,
      password,
      dob,
      nic,
      skills,
      gender,
      isAvailable,
    } = value;
    const employee = await Employee.findById(id);
    if (!employee) throw new AppError("Employee not found", 404);

    // CHECK MOBILE NUMBER ALREADY EXIST
    const existingUser = await User.exists({
      mobile: mobile,
      _id: { $ne: employee.user },
    });
    if (existingUser) throw new AppError("Mobile number already exist", 400);

    // CHECK NIC ALREADY EXIST
    const existingNic = await Employee.exists({
      nic: nic,
      _id: { $ne: employee._id },
    });
    if (existingNic) throw new AppError("NIC already exist", 400);

    // CHECK USERNAME ALREADY EXIST
    const existingUserName = await Auth.exists({
      userName: userName,
      user: { $ne: employee.user },
    });
    if (existingUserName) throw new AppError("Username already exist", 400);

    // Update User info
    await User.findByIdAndUpdate(employee.user, {
      name,
      mobile,
      address,
    });

    //2. GET AUTH FIRST
    const auth = await Auth.findOne({ user: employee.user });

    if (auth) {
      let updateData = {};

      if (userName) updateData.userName = userName;

      if (password) {
        const hashedPassword = await hashPassword(password);
        updateData.password = hashedPassword;
      }

      await Auth.findByIdAndUpdate(auth._id, updateData);
    }

    // Update Employee info
    await Employee.findByIdAndUpdate(id, {
      dob,
      nic,
      skills,
      gender,
      isAvailable,
    });
    return "Employee updated successfully";
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};

// Admin: Toggle Availability
exports.toggleAvailability = async (id) => {
  // CHECK ID IS A VALID OBJECT ID
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new AppError("Invalid employee ID", 400);
  try {
    const employee = await Employee.findById(id);
    if (!employee) throw new AppError("Employee not found", 404);
    employee.isAvailable = !employee.isAvailable;
    await employee.save();

    return `Employee availability: ${employee.isAvailable}`;
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};

// Admin: Delete Employee
exports.deleteEmployee = async (id) => {
  try {
    // CHECK ID IS A VALID OBJECT ID
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new AppError("Invalid employee ID", 400);
    const employee = await Employee.findById(id);
    if (!employee) {
      throw new AppError("Employee not found", 404);
    }

    // Soft delete Employee
    await Employee.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
      isAvailable: false,
    });

    // Soft delete User
    await User.findByIdAndUpdate(employee.user, {
      isDeleted: true,
      deletedAt: new Date(),
      isActive: false,
    });

    // REMOVE DELETED USER FROM TEAMS
    await Team.updateMany({ employees: id }, { $pull: { employees: id } });
    return "Employee and associated user deleted successfully";
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};
