import axios from "axios";

export const timeslotService = {
  getSchedule: async (dateStr) => {
    return await axios.get(`/timeslot/schedule?date=${dateStr}`);
  },
  getAvailable: async (dateStr) => {
    return await axios.get(`/timeslot/available?date=${dateStr}`);
  }
};
