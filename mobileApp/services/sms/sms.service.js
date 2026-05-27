import axios from "axios";

export const smsService = {
  getSmsAccountStatus: async () => {
    const response = await axios.get("/sms/account");
    return response?.data?.payload || {};
  },
};
