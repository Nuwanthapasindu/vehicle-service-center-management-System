import axios from "axios";

const supplyChainService = {
  // Supplier API calls
  getSuppliers: async () => {
    const response = await axios.get("/suppliers");
    return response.data?.payload?.suppliers || [];
  },

  createSupplier: async (payload) => {
    const response = await axios.post("/suppliers", payload);
    return response.data;
  },

  updateSupplier: async (id, payload) => {
    const response = await axios.put(`/suppliers/${id}`, payload);
    return response.data;
  },

  deleteSupplier: async (id) => {
    const response = await axios.delete(`/suppliers/${id}`);
    return response.data;
  },

  // Purchase Order API calls
  getPurchaseOrders: async () => {
    const response = await axios.get("/purchase-orders");
    return response.data?.payload?.orders || [];
  },

  createPurchaseOrder: async (payload) => {
    const response = await axios.post("/purchase-orders", payload);
    return response.data;
  },

  updatePurchaseOrder: async (id, payload) => {
    const response = await axios.put(`/purchase-orders/${id}`, payload);
    return response.data;
  },

  deletePurchaseOrder: async (id) => {
    const response = await axios.delete(`/purchase-orders/${id}`);
    return response.data;
  },

  // Inventory & Stock related calls used in Supply Chain
  getInventory: async (names = []) => {
    const params = names.length > 0 ? { names: names.join(",") } : {};
    const response = await axios.get("/inventory", { params });
    return response.data?.payload?.data || [];
  },

  increaseStock: async (payload) => {
    const response = await axios.patch("/inventory/increase-stock", payload);
    return response.data;
  },
};

export default supplyChainService;
