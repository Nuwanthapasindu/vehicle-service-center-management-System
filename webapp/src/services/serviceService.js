import axios from "axios";

const getServices = (params) => {
  return axios.get("/service", { params });
};

const getServiceById = (id) => {
  return axios.get(`/service/${id}`);
};

const serviceService = {
  getServices,
  getServiceById,
};

export default serviceService;
