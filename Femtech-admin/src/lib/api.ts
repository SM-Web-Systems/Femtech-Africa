import axios from 'axios';

const API_BASE_URL = 'https://api.mamatokens.com/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminApi = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/admin/login', { email, password });
    return response.data;
  },
  getStats: async () => {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  },
  getUsers: async (page = 1, limit = 20) => {
    const response = await apiClient.get(`/admin/users?page=${page}&limit=${limit}`);
    return response.data;
  },
  getTransactions: async (page = 1, limit = 20) => {
    const response = await apiClient.get(`/admin/transactions?page=${page}&limit=${limit}`);
    return response.data;
  },
  getRedemptions: async (page = 1, limit = 20) => {
    const response = await apiClient.get(`/admin/redemptions?page=${page}&limit=${limit}`);
    return response.data;
  },
  getMilestones: async () => {
    const response = await apiClient.get('/admin/milestones');
    return response.data;
  },
  getActivity: async () => {
    const response = await apiClient.get('/admin/activity');
    return response.data;
  },
};

export default apiClient;
