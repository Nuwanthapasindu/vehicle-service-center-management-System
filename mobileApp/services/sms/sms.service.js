import axios from "axios";

export const smsService = {
  getSmsAccountStatus: async () => {
    const response = await axios.get("/sms/account");
    return response?.data?.payload || {};
  },
  createSmsCampaign: async (payload) => {
    const response = await axios.post("/sms/campaigns", payload);
    return response?.data?.payload || {};
  },
  getSmsCampaigns: async (page = 1, limit = 10) => {
    const response = await axios.get(`/sms/campaigns`,{
      params: { page, limit }
    });
    const payload = response?.data?.payload;
    if (payload && typeof payload === "object" && !Array.isArray(payload)) {
      return payload.campaigns || [];
    }
    return payload || [];
  },
};
