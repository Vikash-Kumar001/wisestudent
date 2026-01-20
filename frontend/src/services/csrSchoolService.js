import api from "../utils/api";

const csrSchoolService = {
  getSchools: (params = {}) => api.get("/api/csr/schools", { params }),
};

export default csrSchoolService;
