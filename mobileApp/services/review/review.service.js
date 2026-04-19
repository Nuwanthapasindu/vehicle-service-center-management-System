import axios from "axios";

class ReviewService {
  /**
   * Fetch paginated reviews for admin dashboard
   * @param {number} page 
   * @param {number} limit 
   * @param {boolean} isApproved 
   * @returns {Promise<Object>}
   */
  async getAdminReviews(page = 1, limit = 10, isApproved) {
    const params = { page, limit };
    if (isApproved !== undefined) {
      params.isApproved = isApproved;
    }
    const response = await axios.get("/review/admin", { params });
    return response.data;
  }

  /**
   * Update review approval status
   * @param {string} reviewId 
   * @param {boolean} isApproved 
   * @returns {Promise<Object>}
   */
  async updateApprovalStatus(reviewId, isApproved) {
    const response = await axios.patch(`/review/admin/${reviewId}/approval`, { isApproved });
    return response.data;
  }
}

export default new ReviewService();
