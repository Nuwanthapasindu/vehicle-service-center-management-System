import axios from 'axios';

export const userService = {
  searchCustomersByMobile: async (mobile) => {
    const response = await axios.get(`/user/search-mobile/${mobile}`);
    return response?.data?.payload?.customers || [];
  },
  getAllCustomers: async (search = "") => {
    const response = await axios.get(`/user/customers?search=${search}`);
    return response?.data?.payload?.customers || [];
  },
  getCustomerDetails: async (customerId) => {
    const response = await axios.get(`/user/customers/${customerId}`);
    return response?.data?.payload || {};
  }
};
