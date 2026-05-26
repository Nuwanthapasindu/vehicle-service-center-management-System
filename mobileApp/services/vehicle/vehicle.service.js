import axios from "axios";

export const vehicleService = {
  getAllVehiclesAdmin: async (search = "", page = 1, limit = 5) => {
    const response = await axios.get(`/vehicle/all?search=${search}&page=${page}&limit=${limit}`);
    return response?.data?.payload?.vehicles || [];
  },
};
