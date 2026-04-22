const mongoose = require("mongoose");
const dns = require("dns");

async function connectDB() {
  mongoose.set("strictQuery", true);

  // First attempt: system default DNS
  try {
    const conn = await mongoose.connect(process.env.MONGO_DB_URL);
    console.log(`Database connected: ${conn.connection.host} ...`);
    return;
  } catch (err) {
    const issDNSError =
      err.message?.includes("querySrv") ||
      err.message?.includes("ECONNREFUSED") ||
      err.message?.includes("ENOTFOUND");

    if (!issDNSError) {
      // Not a DNS issue, don't retry
      console.error("Database connection failed:", err.message);
      process.exit(1);
    }

    console.warn("DNS resolution failed, retrying with fallback DNS servers...");
  }

  // Second attempt: fallback DNS
  try {
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
    const conn = await mongoose.connect(process.env.MONGO_DB_URL);
    console.log(`Database connected (fallback DNS): ${conn.connection.host} ...`);
  } catch (err) {
    console.error("Database connection failed even with fallback DNS:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;