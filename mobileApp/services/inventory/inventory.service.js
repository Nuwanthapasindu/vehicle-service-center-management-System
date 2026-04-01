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
    return await axios.post("/inventory", payload);
  },
  updateItem: async (id, payload) => {
    return await axios.patch(`/inventory/${id}`, payload);
  },
  deleteItem: async (id) => {
    return await axios.delete(`/inventory/${id}`);
  }
};