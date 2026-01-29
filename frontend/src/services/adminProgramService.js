import api from "../utils/api";

const API_URL = "/api/admin/programs";

/**
 * List all programs with filters
 * @param {Object} filters - { csrPartnerId, status, page, limit, search }
 */
export const listPrograms = async (filters = {}) => {
  const response = await api.get(API_URL, { params: filters });
  return response.data;
};

/**
 * Create a new program
 * @param {Object} data - Program data
 */
export const createProgram = async (data) => {
  const response = await api.post(API_URL, data);
  return response.data;
};

/**
 * Get a single program by ID
 * @param {String} programId - Program ID
 */
export const getProgram = async (programId) => {
  const response = await api.get(`${API_URL}/${programId}`);
  return response.data;
};

/**
 * Update a program
 * @param {String} programId - Program ID
 * @param {Object} updates - Updates to apply
 */
export const updateProgram = async (programId, updates) => {
  const response = await api.put(`${API_URL}/${programId}`, updates);
  return response.data;
};

/**
 * Archive/complete a program
 * @param {String} programId - Program ID
 */
export const archiveProgram = async (programId) => {
  const response = await api.delete(`${API_URL}/${programId}`);
  return response.data;
};

/**
 * Get available schools for a program (based on scope)
 * @param {String} programId - Program ID
 */
export const getAvailableSchools = async (programId) => {
  const response = await api.get(`${API_URL}/${programId}/available-schools`);
  return response.data;
};

/**
 * Get assigned schools for a program
 * @param {String} programId - Program ID
 * @param {Object} filters - Optional filters
 */
export const getAssignedSchools = async (programId, filters = {}) => {
  const response = await api.get(`${API_URL}/${programId}/schools`, { params: filters });
  return response.data;
};

/**
 * Assign schools to a program
 * @param {String} programId - Program ID
 * @param {Array} schoolIds - Array of school IDs
 */
export const assignSchools = async (programId, schoolIds) => {
  const response = await api.post(`${API_URL}/${programId}/schools`, { schoolIds });
  return response.data;
};

/**
 * Assign schools in bulk
 * @param {String} programId - Program ID
 * @param {Array} schoolIds - Array of school IDs
 */
export const assignSchoolsBulk = async (programId, schoolIds) => {
  const response = await api.post(`${API_URL}/${programId}/schools/bulk`, { schoolIds });
  return response.data;
};

/**
 * Remove a school from a program
 * @param {String} programId - Program ID
 * @param {String} schoolId - School ID
 */
export const removeSchool = async (programId, schoolId) => {
  const response = await api.delete(`${API_URL}/${programId}/schools/${schoolId}`);
  return response.data;
};

/**
 * Update a school's status in a program
 * @param {String} programId - Program ID
 * @param {String} schoolId - School ID
 * @param {String} status - New status
 */
export const updateSchoolStatus = async (programId, schoolId, status) => {
  const response = await api.put(`${API_URL}/${programId}/schools/${schoolId}/status`, {
    status,
  });
  return response.data;
};

/**
 * Get schools summary for a program
 * @param {String} programId - Program ID
 */
export const getSchoolsSummary = async (programId) => {
  const response = await api.get(`${API_URL}/${programId}/schools/summary`);
  return response.data;
};

/**
 * Get checkpoints for a program
 * @param {String} programId - Program ID
 */
export const getCheckpoints = async (programId) => {
  const response = await api.get(`${API_URL}/${programId}/checkpoints`);
  return response.data;
};

/**
 * Trigger a checkpoint
 * @param {String} programId - Program ID
 * @param {Number} checkpointNumber - Checkpoint number (1-5)
 */
export const triggerCheckpoint = async (programId, checkpointNumber) => {
  const response = await api.post(
    `${API_URL}/${programId}/checkpoints/${checkpointNumber}/trigger`
  );
  return response.data;
};

/**
 * Check if a checkpoint can be triggered
 * @param {String} programId - Program ID
 * @param {Number} checkpointNumber - Checkpoint number
 */
export const canTriggerCheckpoint = async (programId, checkpointNumber) => {
  const response = await api.get(
    `${API_URL}/${programId}/checkpoints/${checkpointNumber}/can-trigger`
  );
  return response.data;
};

/**
 * Update program status
 * @param {String} programId - Program ID
 * @param {String} status - New status
 */
export const updateProgramStatus = async (programId, status) => {
  const response = await api.put(`${API_URL}/${programId}/status`, { status });
  return response.data;
};

const adminProgramService = {
  listPrograms,
  createProgram,
  getProgram,
  updateProgram,
  archiveProgram,
  getAvailableSchools,
  getAssignedSchools,
  assignSchools,
  assignSchoolsBulk,
  removeSchool,
  updateSchoolStatus,
  getSchoolsSummary,
  getCheckpoints,
  triggerCheckpoint,
  canTriggerCheckpoint,
  updateProgramStatus,
};

export default adminProgramService;
