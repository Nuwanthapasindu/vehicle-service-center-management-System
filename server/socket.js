const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("./model/User");
const { USER_ROLES } = require("./util/constants");

let io = null;

module.exports.init = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Authentication Middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const jwtToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
      const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
      if (!decoded) {
        return next(new Error("Authentication error: Invalid token"));
      }

      const user = await User.findById(decoded.id).lean();
      if (!user || user.isDeleted || !user.isActive) {
        return next(new Error("Authentication error: User not active or deleted"));
      }

      if (user.role !== USER_ROLES.ADMIN) {
        return next(new Error("Access denied: Not an admin"));
      }

      socket.user = user;
      next();
    } catch (error) {
      return next(new Error("Authentication error: " + error.message));
    }
  });

  io.on("connection", (socket) => {
    // Add admin to "admins" room
    socket.join("admins");

    socket.on("disconnect", () => {
      socket.leave("admins");
    });
  });

  return io;
};

module.exports.broadcastNotificationToAdmins = (notification) => {
  if (io) {
    io.to("admins").emit("newNotification", notification);
  }
};
