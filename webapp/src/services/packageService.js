import axios from "axios";

const getPackages = (params) => {
    return axios.get("/package", { params });
};

const getPublicPackages = () => {
    return axios.get("/package/public");
};

const getPackageById = (id) => {
    return axios.get(`/package/${id}`);
};

const packageService = {
    getPackages,
    getPublicPackages,
    getPackageById,
};

export default packageService;
