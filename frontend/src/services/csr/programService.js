import api from "../../utils/api";

const API_URL = "/api/csr";

/**
 * Get all programs for the authenticated CSR user
 */
export const getMyPrograms = async () => {
  const response = await api.get(`${API_URL}/programs`);
  return response.data;
};

/**
 * Get program overview data
 * @param {String} programId - Program ID
 */
export const getProgramOverview = async (programId) => {
  const response = await api.get(`${API_URL}/programs/${programId}/overview`);
  return response.data;
};

/**
 * Get student reach metrics
 * @param {String} programId - Program ID
 */
export const getStudentReach = async (programId) => {
  const response = await api.get(`${API_URL}/programs/${programId}/student-reach`);
  return response.data;
};

/**
 * Get engagement metrics
 * @param {String} programId - Program ID
 */
export const getEngagement = async (programId) => {
  const response = await api.get(`${API_URL}/programs/${programId}/engagement`);
  return response.data;
};

/**
 * Get readiness exposure (10 pillars)
 * @param {String} programId - Program ID
 */
export const getReadinessExposure = async (programId) => {
  const response = await api.get(`${API_URL}/programs/${programId}/readiness-exposure`);
  return response.data;
};

/**
 * Get school coverage data
 * @param {String} programId - Program ID
 * @param {Object} filters - { district, page, limit }
 */
export const getSchoolCoverage = async (programId, filters = {}) => {
  const response = await api.get(`${API_URL}/programs/${programId}/school-coverage`, { params: filters });
  return response.data;
};

/**
 * Get recognition metrics
 * @param {String} programId - Program ID
 */
export const getRecognition = async (programId) => {
  const response = await api.get(`${API_URL}/programs/${programId}/recognition`);
  return response.data;
};

/**
 * Get checkpoints for a program
 * @param {String} programId - Program ID
 */
export const getCheckpoints = async (programId) => {
  const response = await api.get(`${API_URL}/programs/${programId}/checkpoints`);
  return response.data;
};

/**
 * Acknowledge a checkpoint
 * @param {String} programId - Program ID
 * @param {Number} checkpointNumber - Checkpoint number
 */
export const acknowledgeCheckpoint = async (programId, checkpointNumber) => {
  const response = await api.post(
    `${API_URL}/programs/${programId}/checkpoints/${checkpointNumber}/acknowledge`
  );
  return response.data;
};

/**
 * Get available reports (list reports for a program)
 * @param {String} programId - Program ID
 */
export const getReports = async (programId) => {
  const response = await api.get(`${API_URL}/programs/${programId}/reports`);
  return response.data;
};

/** Alias for getReports - list available reports */
export const listReports = getReports;

/**
 * Download report
 * @param {String} programId - Program ID
 * @param {String} reportType - Report type (impact-summary, school-coverage, compliance)
 * @param {String} format - Format (pdf, excel) - default 'pdf'
 */
export const downloadReport = async (programId, reportType, format = "pdf") => {
  const response = await api.get(
    `${API_URL}/programs/${programId}/reports/${reportType}`,
    {
      params: { format },
      responseType: "blob",
    }
  );
  return response.data;
};

/**
 * Download Impact Summary PDF
 * @param {String} programId - Program ID
 */
export const downloadImpactSummary = async (programId) => {
  const response = await api.get(
    `${API_URL}/programs/${programId}/reports/impact-summary`,
    { responseType: "blob" }
  );
  return response.data;
};

/**
 * Download School Coverage Report (Excel or PDF)
 * @param {String} programId - Program ID
 * @param {String} format - 'pdf' | 'excel'
 */
export const downloadSchoolCoverage = async (programId, format = "pdf") => {
  const response = await api.get(
    `${API_URL}/programs/${programId}/reports/school-coverage`,
    { params: { format }, responseType: "blob" }
  );
  return response.data;
};

/**
 * Download Compliance Summary PDF
 * @param {String} programId - Program ID
 */
export const downloadComplianceSummary = async (programId) => {
  const response = await api.get(
    `${API_URL}/programs/${programId}/reports/compliance`,
    { responseType: "blob" }
  );
  return response.data;
};

const programService = {
  getMyPrograms,
  getProgramOverview,
  getStudentReach,
  getEngagement,
  getReadinessExposure,
  getSchoolCoverage,
  getRecognition,
  getCheckpoints,
  acknowledgeCheckpoint,
  getReports,
  listReports,
  downloadReport,
  downloadImpactSummary,
  downloadSchoolCoverage,
  downloadComplianceSummary,
};

export default programService;
