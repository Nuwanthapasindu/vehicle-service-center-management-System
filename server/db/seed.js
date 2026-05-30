const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const process = require("process");

// Models
const User = require("../model/User");
const Auth = require("../model/Auth");
const Employee = require("../model/Employee");
const Timeslot = require("../model/Timeslot");

const { USER_ROLES, GENDERS } = require("../util/constants");
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
};

const seedAdminUser = async () => {
  try {
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      throw new Error("ADMIN_PASSWORD environment variable is required for seeding the admin user.");
    }

    // Check if admin auth already exists
    const existingAdminAuth = await Auth.findOne({ userName: adminUsername });
    if (existingAdminAuth) {
      console.log(`Admin user '${adminUsername}' already exists. Skipping seeding.`);
      return;
    }

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
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const adminAuth = new Auth({
      user: savedUser._id,
      userName: adminUsername,
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
    throw error;
  }
};

const seedTimeslots = async () => {
  try {
    const count = await Timeslot.countDocuments();
    if (count > 0) return;

    await Timeslot.insertMany([
      { startTime: "09:00", endTime: "13:00", maxCapacity: 2 },
      { startTime: "10:30", endTime: "14:30", maxCapacity: 2 },
      { startTime: "13:00", endTime: "17:00", maxCapacity: 2 },
      { startTime: "14:30", endTime: "18:30", maxCapacity: 2 }
    ]);

    console.log("Timeslots seeded successfully");
  } catch (error) {
    console.error("Error seeding timeslots:", error);
    throw error;
  }
};

async function main() {
  let hasError = false;
  try {
    await connectDB();
    await seedAdminUser();
    await seedTimeslots();
  } catch (error) {
    console.error("Error during seeding:", error);
    hasError = true;
  } finally {
    await mongoose.connection.close();
    process.exit(hasError ? 1 : 0);
  }
}

main();
