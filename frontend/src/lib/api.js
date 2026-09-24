import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach Authorization Bearer token or extension API key
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kws_token') || localStorage.getItem('kws_api_key');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['x-api-key'] = token;
  }
  return config;
}, (error) => Promise.reject(error));

export default api;
