import axios from "axios";

export const invoiceService = {
  fetchInvoices: async (params = {}) => {
    const response = await axios.get("/invoice", { params });
    return response?.data?.payload?.invoices || response?.data?.invoices || [];
  },
  fetchInvoiceById: async (id) => {
    const response = await axios.get(`/invoice/${id}`);
    return response?.data?.payload?.invoice || response?.data?.invoice || null;
  },
  addInvoiceItem: async (id, payload) => {
    return await axios.put(`/invoice/${id}/items/add`, payload);
  },
  removeInvoiceItem: async (id, payload) => {
    return await axios.delete(`/invoice/${id}/items/remove`, { data: payload });
  }
};
