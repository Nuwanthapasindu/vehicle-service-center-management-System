const express = require("express");
const connectDB = require("./config/db.config");
const cors = require("cors");
const helmet = require("helmet");
const errorHandling = require("./middleware/errorHandling");
const swaggerUI = require("swagger-ui-express");
const  swaggerSpec = require("./config/document.config");
const AppError = require("./error/AppError");
require("dotenv").config();

const authRouter = require("./routes/auth.route");
const log = require("./middleware/log");
const fileRouter = require("./routes/file.route");

const app = express();
connectDB();

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
if (process.env.NODE_ENV !== "production") {
app.use("/api/v1/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec,{
  explorer: true,
  
}));
}

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/file", fileRouter);

//  SUPPLY CHAIN ROUTES 
app.use('/api/suppliers', require('./routes/supplier.route'));
app.use('/api/orders', require('./routes/order.route')); 
app.use('/api/inventory', require('./routes/inventory.route'));

app.use((req, res, next) => {
  next(
    new AppError(
      `${req.baseUrl} not found or ${req.method} method not support.`,
      404
    )
  );
});

app.use(errorHandling);

module.exports = app;