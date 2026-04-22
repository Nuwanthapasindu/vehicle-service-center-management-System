import axios from "axios";

const getServices = (params) => {
    return axios.get("/service", { params });
};

const getPublicServices = () => {
    return axios.get("/service/public");
};

const getServiceById = (id) => {
    return axios.get(`/service/${id}`);
};

const serviceService = {
    getServices,
    getPublicServices,
    getServiceById,
};

export default serviceService;