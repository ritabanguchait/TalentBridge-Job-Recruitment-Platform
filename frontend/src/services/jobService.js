import api from './api';

export const jobService = {
  // Public APIs
  searchJobs: async (params = {}) => {
    const response = await api.get('/jobs', { params });
    return response.data;
  },

  getJobById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  // Recruiter APIs
  createJob: async (jobData) => {
    const response = await api.post('/recruiter/jobs', jobData);
    return response.data;
  },

  getMyJobs: async (page = 0, size = 10) => {
    const response = await api.get('/recruiter/jobs', { params: { page, size } });
    return response.data;
  },

  updateJob: async (id, jobData) => {
    const response = await api.put(`/recruiter/jobs/${id}`, jobData);
    return response.data;
  },

  deleteJob: async (id) => {
    const response = await api.delete(`/recruiter/jobs/${id}`);
    return response.data;
  },

  getRecruiterProfile: async () => {
    const response = await api.get('/recruiter/profile');
    return response.data;
  },

  updateRecruiterProfile: async (profileData) => {
    const response = await api.put('/recruiter/profile', profileData);
    return response.data;
  },
};

export default jobService;
