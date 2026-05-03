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
  },
  fetchPackagesAdmin: async (params = {}) => {
    return await axios.get("/package", { params });
  },
  createPackage: async (payload) => {
    return await axios.post("/package", payload);
  },
  updatePackage: async (id, payload) => {
    return await axios.put(`/package/${id}`, payload);
  },
  deletePackage: async (id) => {
    return await axios.delete(`/package/${id}`);
  }
};
