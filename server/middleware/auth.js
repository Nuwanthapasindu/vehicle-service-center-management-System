const jwt = require("jsonwebtoken");
const User = require("../model/User");
const Employee = require("../model/Employee");
const AppError = require("../error/AppError");
const { USER_ROLES } = require("../util/constants");

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
    const authUser = await User.findById(decodedToken.id)
      .select(["-__v","-isActive","-isDeleted"])
      .lean();
    if (!authUser) throw new AppError("unauthorized", 401);
    const { _id, ...restUser } = authUser;
    let user = { ...restUser };
    if (
      authUser.role === USER_ROLES.ADMIN ||
      authUser.role === USER_ROLES.MECHANIC
    ) {
      const employee = await Employee.findOne({ user: _id })
        .select(["-__v", "-user"])
        .lean();
      if (!employee) throw new AppError("unauthorized", 401);
      user = { ...user, ...employee };
    }

    request.user = user;
    return next();
  } catch (error) {
    next(
      new AppError(error.message, error.statusCode ? error.statusCode : 401),
    );
    return;
  }
};

module.exports = { authTokenMiddleware };
