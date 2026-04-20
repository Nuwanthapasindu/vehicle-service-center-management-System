import axios from "axios";

export const inventoryLogsService = {
  fetchLogs: async (params = {}) => {
    const timezoneOffset = new Date().getTimezoneOffset();
    const response = await axios.get("/inventory-logs", { params: { ...params, timezoneOffset } });
    return response?.data?.payload || response?.data || { data: [], pagination: { page: 1, limit: 20, total: 0, pages: 1 } };
  },
  fetchItemLogs: async (id, params = {}) => {
    const timezoneOffset = new Date().getTimezoneOffset();
    const response = await axios.get(`/inventory-logs/${id}`, { params: { ...params, timezoneOffset } });
    return response?.data?.payload || response?.data || { data: [], pagination: { page: 1, limit: 20, total: 0, pages: 1 } };
  }
};
