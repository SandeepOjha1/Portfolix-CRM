import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('crm_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized and not already on the login or contact page
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/contact')
      ) {
        localStorage.removeItem('crm_token');
        localStorage.removeItem('crm_admin');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

