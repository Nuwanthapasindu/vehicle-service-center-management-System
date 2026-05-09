import axios from "axios"

export const getGalleryImages = async (params = {}) => {
  try {
    const response = await axios.get("/gallery", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
