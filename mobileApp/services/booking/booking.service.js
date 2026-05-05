import axios from "axios";

export const bookingService = {
  getBookingDetailsAdmin: async (id) => {
    return await axios.get(`/booking/admin/${id}/details`);
  },
  updateBookingAdmin: async (id, payload) => {
    return await axios.patch(`/booking/admin/${id}`, payload);
  },
  deleteBookingAdmin: async (id) => {
    return await axios.delete(`/booking/admin/${id}`);
  },
  getBookingHistoryAdmin: async (params = {}) => {
    return await axios.get('/booking/admin/history', { params });
  }
};
