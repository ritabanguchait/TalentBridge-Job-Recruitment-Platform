import api from './api';

export const applicationService = {
  // Candidate APIs
  applyForJob: async (jobId, coverNote) => {
    const response = await api.post('/candidate/applications', { jobId, coverNote });
    return response.data;
  },

  getMyApplications: async (page = 0, size = 10) => {
    const response = await api.get('/candidate/applications', { params: { page, size } });
    return response.data;
  },

  getApplicationDetailsForCandidate: async (id) => {
    const response = await api.get(`/candidate/applications/${id}`);
    return response.data;
  },

  withdrawApplication: async (id) => {
    const response = await api.put(`/candidate/applications/${id}/withdraw`);
    return response.data;
  },

  getCandidateProfile: async () => {
    const response = await api.get('/candidate/profile');
    return response.data;
  },

  updateCandidateProfile: async (profileData) => {
    const response = await api.put('/candidate/profile', profileData);
    return response.data;
  },

  getCandidateDashboardStats: async () => {
    const response = await api.get('/candidate/dashboard');
    return response.data;
  },

  // Recruiter APIs
  getJobApplications: async (jobId, status, page = 0, size = 10) => {
    const params = { page, size };
    if (status) params.status = status;
    const response = await api.get(`/recruiter/jobs/${jobId}/applications`, { params });
    return response.data;
  },

  getAllRecruiterApplications: async (page = 0, size = 10) => {
    const response = await api.get('/recruiter/applications', { params: { page, size } });
    return response.data;
  },

  getApplicationDetailsForRecruiter: async (id) => {
    const response = await api.get(`/recruiter/applications/${id}`);
    return response.data;
  },

  updateApplicationStatus: async (id, status, remarks) => {
    const response = await api.put(`/recruiter/applications/${id}/status`, { status, remarks });
    return response.data;
  },

  getRecruiterDashboardStats: async () => {
    const response = await api.get('/recruiter/dashboard');
    return response.data;
  },
};

export default applicationService;
