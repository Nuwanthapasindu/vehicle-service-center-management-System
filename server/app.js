const express = require("express");
const connectDB = require("./config/db.config");
const cors = require("cors");
const helmet = require("helmet");
const errorHandling = require("./middleware/errorHandling");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./config/document.config");
const AppError = require("./error/AppError");
const path = require("path");
const process = require("process");
require("dotenv").config();

// ROUTERS IMPORT
const authRouter = require("./routes/auth.route");
const log = require("./middleware/log");
const fileRouter = require("./routes/file.route");
const serviceRouter = require("./routes/service.route");
const packageRouter = require("./routes/package.route");
const userRouter = require("./routes/user.route");
const vehicleRouter = require("./routes/vehicle.route");
const bookingRouter = require("./routes/booking.route");
const timeslotRouter = require("./routes/timeslot.route");

// CONFIGURE EXPRESS APP
const app = express();
//  DATABASE CONNECTION ESTABLISHMENT
connectDB();

// TOP LEVEL MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(log);
// Serve Swagger documentation
if (process.env.NODE_ENV !== "production") {
  app.use("/api/v1/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec, {
    explorer: true,

  }));
}

// STATIC FOLDER
app.use("/api/v1/storage/uploads", express.static(path.join(process.cwd(), "storage", "uploads")));

// ROUTES
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/file", fileRouter);
app.use("/api/v1/service", serviceRouter);
app.use("/api/v1/package", packageRouter);
app.use("/api/v1/vehicle", vehicleRouter);
app.use("/api/v1/booking", bookingRouter);
app.use("/api/v1/timeslot", timeslotRouter);

// DEFAULT ROUTE
app.use((req, res, next) => {
  next(
    new AppError(
      `${req.baseUrl} not found or ${req.method} method not support.`,
      404,
    ),
  );
});

// LOW LEVEL MIDDLEWARE
app.use(errorHandling);

module.exports = app;
