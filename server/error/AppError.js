const statusWording = require("../util/statusWording");

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    this.status = statusWording(statusCode);
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
