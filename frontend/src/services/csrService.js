import api from '../utils/api';

const handleError = (error) => {
  throw error.response?.data || error;
};

const buildQuery = (params = {}) => {
  const query = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== "") {
      query.append(key, params[key]);
    }
  });
  return query.toString();
};

const csrService = {
  getImpactMetrics: (filters = {}) =>
    api
      .get(`/api/csr-overview/data${buildQuery(filters)}`)
      .then((res) => res.data)
      .catch(handleError),
  sponsor: {
    register: (payload) => api.post('/api/csr/register', payload).catch(handleError),
    profile: () => api.get('/api/csr/profile').then((res) => res.data?.data || res.data).catch(handleError),
    update: (payload) => api.put('/api/csr/profile', payload).then((res) => res.data?.data || res.data).catch(handleError),
  },
};

export default csrService;
