import axios from "axios";

export const reviewService = {
  /**
   * Fetch paginated reviews for admin dashboard
   */
  getAdminReviews: async (page = 1, limit = 10, isApproved) => {
    const params = { page, limit };
    if (isApproved !== undefined) {
      params.isApproved = isApproved;
    }
    const response = await axios.get("/review/admin", { params });
    return response.data;
  },

  /**
   * Fetch review statistics and data for Admin Report
   */
  getAdminReviewReport: async (params = {}) => {
    const response = await axios.get("/review/admin/report", { params });
    return response.data;
  },

  /**
   * Fetch a single review by ID for admin
   */
  getAdminReviewById: async (reviewId) => {
    const response = await axios.get(`/review/admin/${reviewId}`);
    return response.data;
  },

  /**
   * Add an admin reply to a review
   */
  addAdminReply: async (reviewId, reply) => {
    const response = await axios.post(`/review/admin/${reviewId}/reply`, { reply });
    return response.data;
  },

  /**
   * Update an existing admin reply
   */
  updateAdminReply: async (reviewId, reply) => {
    const response = await axios.patch(`/review/admin/${reviewId}/reply`, { reply });
    return response.data;
  },

  /**
   * Delete an admin reply
   */
  deleteAdminReply: async (reviewId) => {
    const response = await axios.delete(`/review/admin/${reviewId}/reply`);
    return response.data;
  },

  /**
   * Fetch public reviews and statistics
   */
  getPublicReviews: async (params = {}) => {
    const response = await axios.get("/review", { params });
    return response.data;
  },

  /**
   * Update review approval status
   */
  updateApprovalStatus: async (reviewId, isApproved) => {
    const response = await axios.patch(`/review/admin/${reviewId}/approval`, { isApproved });
    return response.data;
  }
};

export default reviewService;
