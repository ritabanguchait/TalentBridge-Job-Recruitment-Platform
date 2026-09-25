import api from './api';

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  updateUserStatus: async (userId, active) => {
    const response = await api.put(`/admin/users/${userId}/status`, { active });
    return response.data;
  },

  getJobs: async (params = {}) => {
    const response = await api.get('/admin/jobs', { params });
    return response.data;
  },

  updateJobStatus: async (jobId, status) => {
    const response = await api.put(`/admin/jobs/${jobId}/status`, { status });
    return response.data;
  },

  deleteJob: async (jobId) => {
    const response = await api.delete(`/admin/jobs/${jobId}`);
    return response.data;
  },
};

export default adminService;
