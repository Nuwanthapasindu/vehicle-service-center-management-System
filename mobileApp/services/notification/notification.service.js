import axios from "axios";

export const notificationService = {
  getNotifications: async () => {
    const response = await axios.get("/notifications");
    return response?.data?.payload || [];
  },
  getUnreadCount: async () => {
    const response = await axios.get("/notifications/unread-count");
    return response?.data?.payload?.count || 0;
  },
  markAsRead: async (id) => {
    const response = await axios.patch(`/notifications/${id}/read`);
    return response?.data?.payload || {};
  },
  markAllAsRead: async () => {
    const response = await axios.patch("/notifications/read-all");
    return response?.data?.payload || {};
  },
};
