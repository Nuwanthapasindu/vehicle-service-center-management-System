const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const process = require("process");

// Models
const User = require("../model/User");
const Auth = require("../model/Auth");
const Employee = require("../model/Employee");

const { USER_ROLES, GENDERS } = require("../util/constants");
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("MongoDB connected");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

const seedAdminUser = async () => {
  try {
    // Check if admin auth already exists
    const existingAdminAuth = await Auth.findOne({ userName: "admin" });
    if (existingAdminAuth) return;

    // 1. Create User
    const adminUser = new User({
      name: "System Admin",
      mobile: "0000000000",
      address: "System HQ",
      role: USER_ROLES.ADMIN,
      isActive: true,
      isDeleted: false,
    });
    const savedUser = await adminUser.save();

    // 2. Create Auth
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const adminAuth = new Auth({
      user: savedUser._id,
      userName: "admin",
      password: hashedPassword,
    });
    await adminAuth.save();

    // 3. Create Employee
    const adminEmployee = new Employee({
      user: savedUser._id,
      dob: new Date("1990-01-01"),
      nic: "000000000V",
      gender: GENDERS.MALE,
      skills: ["ADMINISTRATION"],
    });
    await adminEmployee.save();

    console.log("Admin user created successfully");
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
};

async function main() {
  try {
    await connectDB();
    await seedAdminUser();
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

main();
