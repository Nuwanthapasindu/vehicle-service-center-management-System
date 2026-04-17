import axios from 'axios';

export const packageService = {
  fetchPackages: async (params = {}) => {
    const response = await axios.get('/package/public', { params });
    // Returns { payload: { packages: [...] } } from the new public endpoint
    return response?.data?.payload?.packages || [];
  },
  fetchPackageById: async (id) => {
    const response = await axios.get(`/package/${id}`);
    return response?.data?.payload?.package || null;
  }
};
