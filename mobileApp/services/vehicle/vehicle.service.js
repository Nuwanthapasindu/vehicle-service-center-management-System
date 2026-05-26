import axios from "axios";

export const vehicleService = {
  getAllVehiclesAdmin: async (search = "", page = 1, limit = 100) => {
    const response = await axios.get(`/vehicle/all?search=${search}&page=${page}&limit=${limit}`);
    return response?.data?.payload?.vehicles || [];
  },
  getVehicleDetailsAdmin: async (id) => {
    const response = await axios.get(`/vehicle/admin/${id}`);
    return response?.data?.payload || {};
  },
};
