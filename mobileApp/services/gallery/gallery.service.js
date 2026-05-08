import axios from "axios";

export const galleryService = {
  getGalleryImages: async () => {
    return await axios.get("/gallery");
  },
  
  createGalleryImage: async (payload) => {
    return await axios.post("/gallery", payload);
  },

  deleteGalleryImage: async (id) => {
    return await axios.delete(`/gallery/${id}`);
  },
};
