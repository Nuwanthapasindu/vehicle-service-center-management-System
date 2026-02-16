const jwt = require("jsonwebtoken");
const User = require("../model/User");
const AppError = require("../error/AppError");

const authTokenMiddleware = async (request, response, next) => {
  const token = request.headers?.authorization;

  if (!token) {
    return next(new AppError("No token provided", 401));
  }
  if (!token.startsWith("Bearer")) {
    return next(new AppError("Invalid token", 401));
  }
  try {
    // VALIDATING JWT
    const jwtToken = token.split(" ")[1];
    const decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET);
    if (!decodedToken) throw new AppError("unauthorized", 401);
    const user = await User.findById(decodedToken.id).select([
      "-password",
      "-_id",
      "-otp",
    ]);
    if (!user) throw new AppError("unauthorized", 401);
    request.user = user;
    return next();
  } catch (error) {
    next(
      new AppError(error.message, error.statusCode ? error.statusCode : 401)
    );
    return;
  }
};

module.exports = { authTokenMiddleware };
