import axios from "axios";

export const inventoryService = {
  fetchInventory: async () => {
    const response = await axios.get("/inventory");
    return response?.data?.payload?.data || response?.data?.data || [];
  },
  fetchCategories: async () => {
    const response = await axios.get("/categories");
    return response?.data?.payload?.data || response?.data?.data || [];
  },
  addItem: async (payload) => {
    const response = await axios.post("/inventory", payload);
    return response?.data;
  },
  updateItem: async (id, payload) => {
    const response = await axios.patch(`/inventory/${id}`, payload);
    return response?.data;
  },
  deleteItem: async (id) => {
    const response = await axios.delete(`/inventory/${id}`);
    return response?.data;
  }
};