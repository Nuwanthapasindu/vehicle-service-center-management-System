const express = require("express");
const connectDB = require("./config/db.config");
const cors = require("cors");
const helmet = require("helmet");
const errorHandling = require("./middleware/errorHandling");
const swaggerUI = require("swagger-ui-express");
const  swaggerSpec = require("./config/document.config");
const AppError = require("./error/AppError");
require("dotenv").config();

// ROUTERS IMPORT
const authRouter = require("./routes/auth.route");
const log = require("./middleware/log");
const fileRouter = require("./routes/file.route");
const inventoryRouter = require("./routes/inventory.route");
const categoryRouter = require("./routes/category.route");

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
    methods: ["GET", "POST", "PUT","PATCH", "DELETE"],
  })
);
app.use(helmet());
app.use(log);
// Serve Swagger documentation
if (process.env.NODE_ENV !== "production") {
app.use("/api/v1/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec,{
  explorer: true,
  
}));
}
// ROUTES
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/file", fileRouter);
app.use("/api/v1/inventory", inventoryRouter);
app.use("/api/v1/categories", categoryRouter);

// DEFAULT ROUTE
app.use((req, res, next) => {
  next(
    new AppError(
      `${req.baseUrl} not found or ${req.method} method not support.`,
      404
    )
  );
});

// LOW LEVEL MIDDLEWARE
app.use(errorHandling);

module.exports = app;
