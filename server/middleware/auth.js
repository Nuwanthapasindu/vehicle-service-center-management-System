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
      .select(["-__v"])
      .lean();
    if (!authUser || !authUser.isActive || authUser.isDeleted)
      throw new AppError("unauthorized", 401);
    const { _id, ...restUser } = authUser;
    let user = { ...restUser };
    if (
      authUser.role === USER_ROLES.ADMIN ||
      authUser.role === USER_ROLES.MECHANIC
    ) {
      const employee = await Employee.findOne({ user: _id })
        .select(["-__v", "-user", "-_id"])
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

/**
 * Access control middleware
 *
 * @param {string[]} roles - list of allowed roles
 *
 * @returns {(req: Request, res: Response, next: NextFunction) => void} - middleware function
 *
 * @throws {AppError} - if roles is not an array or if roles is empty
 * @throws {AppError} - if user role is not in roles
 */
const accessControl = (roles) => {
  return (req, res, next) => {
    if (Array.isArray(roles) && roles.length > 0) {
      const user = req.user;
      if (roles.includes(user.role)) {
        next();
      } else {
        next(new AppError(`Access denied for ${user.role} users`, 403));
        return;
      }
    } else {
      next(new AppError("Invalid role(s) specified", 400));
    }
  };
};

module.exports = { authTokenMiddleware, accessControl };
