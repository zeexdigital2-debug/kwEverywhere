import axios from 'axios';

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
const baseURL = rawApiUrl
  ? (rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`)
  : (typeof window !== 'undefined' ? '/api' : 'http://localhost:48920/api');

// Admin API client pointing to backend /api
const adminApi = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // send httpOnly cookie
});

// Attach Authorization Bearer token from localStorage as fallback
adminApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('kws_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Admin Auth calls
export const adminAuth = {
  login: (username, password) =>
    adminApi.post('/admin/auth/login', { username, password }).then(r => r.data),
  logout: () =>
    adminApi.post('/admin/auth/logout').then(r => r.data),
  verify: () =>
    adminApi.get('/admin/auth/verify').then(r => r.data),
  changePassword: (payload) =>
    adminApi.post('/admin/auth/change-password', payload).then(r => r.data)
};

// Admin Management calls
export const adminService = {
  // Stats
  getStats: () => adminApi.get('/admin/stats').then(r => r.data),

  // Articles
  getArticles: (params) => adminApi.get('/admin/articles', { params }).then(r => r.data),
  getArticle: (id) => adminApi.get(`/admin/articles/${id}`).then(r => r.data),
  createArticle: (data) => adminApi.post('/admin/articles', data).then(r => r.data),
  updateArticle: (id, data) => adminApi.put(`/admin/articles/${id}`, data).then(r => r.data),
  deleteArticle: (id) => adminApi.delete(`/admin/articles/${id}`).then(r => r.data),
  bulkArticles: (ids, action) => adminApi.post('/admin/articles/bulk', { ids, action }).then(r => r.data),

  // Categories
  getCategories: () => adminApi.get('/admin/categories').then(r => r.data),
  createCategory: (data) => adminApi.post('/admin/categories', data).then(r => r.data),
  updateCategory: (id, data) => adminApi.put(`/admin/categories/${id}`, data).then(r => r.data),
  deleteCategory: (id) => adminApi.delete(`/admin/categories/${id}`).then(r => r.data),

  // Media
  getMedia: (params) => adminApi.get('/admin/media', { params }).then(r => r.data),
  uploadMedia: (formData) =>
    adminApi.post('/admin/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data),
  deleteMedia: (id) => adminApi.delete(`/admin/media/${id}`).then(r => r.data),

  // Users
  getUsers: (params) => adminApi.get('/admin/users', { params }).then(r => r.data),
  getUser: (id) => adminApi.get(`/admin/users/${id}`).then(r => r.data),
  updateUser: (id, data) => adminApi.put(`/admin/users/${id}`, data).then(r => r.data),
  deleteUser: (id) => adminApi.delete(`/admin/users/${id}`).then(r => r.data),

  // Settings
  getSettings: () => adminApi.get('/admin/settings').then(r => r.data),
  updateSettings: (group, data) => adminApi.put('/admin/settings', { group, data }).then(r => r.data)
};

export default adminApi;
