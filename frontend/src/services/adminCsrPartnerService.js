import api from "../utils/api";

const API_URL = "/api/admin/csr";

/**
 * List all CSR partners with filters
 * @param {Object} filters - { status, page, limit, search }
 */
export const listPartners = async (filters = {}) => {
  const response = await api.get(API_URL, { params: filters });
  return response.data;
};

/**
 * Get a single CSR partner by ID
 * @param {String} partnerId - Partner ID
 */
export const getPartner = async (partnerId) => {
  const response = await api.get(`${API_URL}/${partnerId}`);
  return response.data;
};

/**
 * Get partner details with associated programs
 * @param {String} partnerId - Partner ID
 */
export const getPartnerDetails = async (partnerId) => {
  const response = await api.get(`${API_URL}/${partnerId}`);
  return response.data;
};

/**
 * Get pending approval partners
 */
export const getPendingPartners = async () => {
  const response = await api.get(API_URL, { params: { status: "pending" } });
  return response.data;
};

/**
 * Approve a CSR partner
 * @param {String} partnerId - Partner ID
 */
export const approvePartner = async (partnerId) => {
  const response = await api.post(`${API_URL}/${partnerId}/verify`);
  return response.data;
};

/**
 * Reject a CSR partner
 * @param {String} partnerId - Partner ID
 * @param {String} reason - Rejection reason
 */
export const rejectPartner = async (partnerId, reason) => {
  const response = await api.post(`${API_URL}/${partnerId}/reject`, { reason });
  return response.data;
};

/**
 * Deactivate a CSR partner
 * @param {String} partnerId - Partner ID
 */
export const deactivatePartner = async (partnerId) => {
  const response = await api.put(`${API_URL}/${partnerId}/deactivate`);
  return response.data;
};

/**
 * Reactivate a CSR partner
 * @param {String} partnerId - Partner ID
 */
export const reactivatePartner = async (partnerId) => {
  const response = await api.put(`${API_URL}/${partnerId}/reactivate`);
  return response.data;
};

/**
 * Get CSR partner count by status
 */
export const getPartnerCounts = async () => {
  const response = await api.get(`${API_URL}/counts`);
  return response.data;
};

const adminCsrPartnerService = {
  listPartners,
  getPartner,
  getPartnerDetails,
  getPendingPartners,
  approvePartner,
  rejectPartner,
  deactivatePartner,
  reactivatePartner,
  getPartnerCounts,
};

export default adminCsrPartnerService;
