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

const authRouter = require("./routes/auth.route");
const log = require("./middleware/log");
const fileRouter = require("./routes/file.route");
const employeeRouter = require("./routes/employee.route");
const teamRouter = require("./routes/team.route");
const jobCardRoutes = require("./routes/jobCard.route");
const serviceRouter = require("./routes/service.route");
const packageRouter = require("./routes/package.route");
const userRouter = require("./routes/user.route");
const vehicleRouter = require("./routes/vehicle.route");
const bookingRouter = require("./routes/booking.route");
const timeslotRouter = require("./routes/timeslot.route");
const inventoryRouter = require("./routes/inventory.route");
const categoryRouter = require("./routes/category.route");
const reviewRouter = require("./routes/review.route");
const invoiceRouter = require("./routes/invoice.route");
const supplierRouter = require("./routes/supplier.route");
const purchaseOrderRouter = require("./routes/purchaseOrder.route");
const inventoryAnalysisRouter = require("./routes/inventoryAnalysis.route");
const inventoryLogsRouter = require("./routes/inventoryLogs.route");

const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(log);
if (process.env.NODE_ENV !== "production") {
  app.use(
    "/api/v1/docs",
    swaggerUI.serve,
    swaggerUI.setup(swaggerSpec, {
      explorer: true,
    }),
  );
}

// STATIC FOLDER
app.use(
  "/api/v1/storage/uploads",
  express.static(path.join(process.cwd(), "storage", "uploads")),
);

// ROUTES
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/file", fileRouter);
app.use("/api/v1/employees", employeeRouter);
app.use("/api/v1/teams", teamRouter);
app.use("/api/v1/job-cards", jobCardRoutes);
app.use("/api/v1/service", serviceRouter);
app.use("/api/v1/package", packageRouter);
app.use("/api/v1/inventory", inventoryRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/suppliers", supplierRouter);
app.use("/api/v1/purchase-orders", purchaseOrderRouter);
app.use("/api/v1/vehicle", vehicleRouter);
app.use("/api/v1/booking", bookingRouter);
app.use("/api/v1/timeslot", timeslotRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/invoice", invoiceRouter);
app.use("/api/v1/inventory-analysis", inventoryAnalysisRouter);
app.use("/api/v1/inventory-logs", inventoryLogsRouter);

// DEFAULT ROUTE
app.use((req, res, next) => {
  next(
    new AppError(
      `${req.baseUrl} not found or ${req.method} method not support.`,
      404,
    ),
  );
});

app.use(errorHandling);

module.exports = app;
