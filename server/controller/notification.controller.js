const Notification = require("../model/Notification");
const User = require("../model/User");
const AppError = require("../error/AppError");

// Helper to get user by mobile
const getUserByMobile = async (mobile) => {
  const user = await User.findOne({ mobile, isDeleted: false }).lean();
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

module.exports.getNotifications = async (mobile) => {
  try {
    const user = await getUserByMobile(mobile);
    const notifications = await Notification.find({ recipient: user._id })
      .sort({ createdAt: -1 })
      .lean();
    return notifications;
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};

module.exports.markAsRead = async (notificationId, mobile) => {
  try {
    const user = await getUserByMobile(mobile);
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      throw new AppError("Notification not found", 404);
    }
    return notification;
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};

module.exports.markAllAsRead = async (mobile) => {
  try {
    const user = await getUserByMobile(mobile);
    await Notification.updateMany(
      { recipient: user._id, isRead: false },
      { isRead: true }
    );
    return { success: true };
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};

module.exports.getUnreadCount = async (mobile) => {
  try {
    const user = await getUserByMobile(mobile);
    const count = await Notification.countDocuments({ recipient: user._id, isRead: false });
    return { count };
  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};
