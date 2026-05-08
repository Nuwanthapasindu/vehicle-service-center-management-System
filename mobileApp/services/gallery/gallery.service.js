import axios from "axios";

export const galleryService = {
  getGalleryImages: async (params = {}) => {
    return await axios.get("/gallery", { params });
  },
  
  createGalleryImage: async (payload) => {
    return await axios.post("/gallery", payload);
  },

  deleteGalleryImage: async (id) => {
    return await axios.delete(`/gallery/${id}`);
  },

  deleteMultipleGalleryImages: async (ids) => {
    return await axios.delete("/gallery/delete-multiple", { data: { ids } });
  },
};
