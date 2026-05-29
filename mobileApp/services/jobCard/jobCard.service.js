import axios from "axios";

export const jobCardService = {
  createJobCard: async (payload) => {
    return await axios.post("/job-cards", payload);
  },
  assignTeam: async (payload) => {
    return await axios.patch("/job-cards/assign", payload);
  }
};
