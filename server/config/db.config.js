const mongoose = require("mongoose");

async function connectDB() {
  mongoose.set("strictQuery", true);
  try {
    const conn = await mongoose.connect(process.env.MONGO_DB_URL);
    console.log(`Database connected: ${conn.connection.host} ...`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = connectDB;
