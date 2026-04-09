import axios from "axios";

export const stockService = {
  fetchStock: async () => {
    const response = await axios.get("/inventory");
    return response?.data?.payload?.data || response?.data?.data || [];
  },
  adjustStock: async (id, quantityChange) => {
    return await axios.patch(`/inventory/adjust/${id}`, {
      quantityChange,
    });
  },
};
