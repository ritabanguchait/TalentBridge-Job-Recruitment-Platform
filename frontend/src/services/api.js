import axios from 'axios';

/**
 * Pre-configured Axios instance for TalentBridge backend REST APIs.
 * Automatically injects the JWT token from localStorage into Authorization headers.
 */
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT Bearer token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('talentbridge_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Global handling for expired sessions (401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If 401 occurs on authenticated endpoints, clear session
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        localStorage.removeItem('talentbridge_token');
        localStorage.removeItem('talentbridge_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
