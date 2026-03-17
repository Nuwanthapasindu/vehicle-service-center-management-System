import axios from "axios";

const createVehicle = async (vehicleData) => {
    try {
        const response = await axios.post('/api/v1/vehicle', vehicleData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

const getMyVehicles = async () => {
    try {
        const response = await axios.get('/api/v1/vehicle');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

const deleteVehicle = async (id) => {
    try {
        const response = await axios.delete(`/api/v1/vehicle/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

const VehicleService = {
    createVehicle,
    getMyVehicles,
    deleteVehicle
};

export default VehicleService;
