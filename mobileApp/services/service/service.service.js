import axios from 'axios';

export const serviceService = {
  fetchServices: async (params = {}) => {
    const response = await axios.get('/service/public', { params });
    return response?.data?.payload?.services || [];
  },
  fetchServiceById: async (id) => {
    const response = await axios.get(`/service/${id}`);
    return response?.data?.payload?.service || null;
  }
};
