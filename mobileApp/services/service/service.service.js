import axios from 'axios';

export const serviceService = {
  fetchServices: async (params = {}) => {
    const response = await axios.get('/service/public', { params });
    return response?.data?.payload?.services || [];
  },
  fetchServiceById: async (id) => {
    const response = await axios.get(`/service/${id}`);
    return response?.data?.payload?.service || null;
  },
  fetchServicesAdmin: async (params = {}) => {
    return await axios.get("/service", { params });
  },
  createService: async (payload) => {
    return await axios.post("/service", payload);
  },
  updateService: async (id, payload) => {
    return await axios.put(`/service/${id}`, payload);
  },
  deleteService: async (id) => {
    return await axios.delete(`/service/${id}`);
  }
};
