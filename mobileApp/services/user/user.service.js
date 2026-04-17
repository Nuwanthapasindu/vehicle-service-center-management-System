import axios from 'axios';

export const userService = {
  searchCustomersByMobile: async (mobile) => {
    const response = await axios.get(`/user/search-mobile/${mobile}`);
    return response?.data?.payload?.customers || [];
  }
};
