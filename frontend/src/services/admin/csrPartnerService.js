import api from "../../utils/api";

const API_URL = "/api/admin/csr";

/**
 * List all CSR partners with filters
 * @param {Object} filters - { status, search, page, limit }
 */
export const listPartners = async (filters = {}) => {
  const response = await api.get(API_URL, { params: filters });
  return response.data;
};

/**
 * Get pending approval partners
 */
export const getPendingPartners = async () => {
  const response = await api.get(`${API_URL}/pending`);
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
 * Update CSR partner details (company name, contact, email, phone, website)
 * @param {String} partnerId - Partner ID
 * @param {Object} updates - { companyName?, contactName?, email?, phone?, website? }
 */
export const updatePartner = async (partnerId, updates) => {
  const response = await api.put(`${API_URL}/${partnerId}`, updates);
  return response.data;
};

/**
 * List CSR notifications (View sent notifications)
 * @param {Object} params - { sponsorId?, type?, status?, page?, limit?, fromDate?, toDate? }
 */
export const listNotifications = async (params = {}) => {
  const response = await api.get(`${API_URL}/notifications`, { params });
  return response.data;
};

/**
 * Send notification to one or more CSR partners
 * @param {Object} payload - { sponsorIds or sponsorId, title, message?, type?, link?, sendEmail? }
 */
export const sendNotification = async (payload) => {
  const response = await api.post(`${API_URL}/notifications/send`, payload);
  return response.data;
};

const csrPartnerService = {
  listPartners,
  getPendingPartners,
  getPartner,
  getPartnerDetails,
  approvePartner,
  rejectPartner,
  deactivatePartner,
  reactivatePartner,
  updatePartner,
  listNotifications,
  sendNotification,
};

export default csrPartnerService;
