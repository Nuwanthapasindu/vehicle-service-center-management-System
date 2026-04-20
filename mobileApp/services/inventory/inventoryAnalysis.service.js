import axios from "axios";

export const inventoryAnalysisService = {
  fetchStats: async () => {
    const response = await axios.get("/inventory-analysis/stats");
    return response?.data?.payload?.data || response?.data?.data || null;
  },
  fetchCategoryBreakdown: async () => {
    const response = await axios.get("/inventory-analysis/category-breakdown");
    return response?.data?.payload?.data || response?.data?.data || [];
  },
  fetchStockMovement: async () => {
    const response = await axios.get("/inventory-analysis/movement");
    return response?.data?.payload?.data || response?.data?.data || [];
  }
};
