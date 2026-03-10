import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = 'https://api.mamatokens.com/api/v1';

const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to every request
apiClient.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle errors
apiClient.interceptors.response.use((response) => response, (error: AxiosError) => {
    console.log('API Error:', error.response?.data || error.message);

    //If unauthorized, remove token from localStorage
    if (error.response?.status === 401) {
        localStorage.removeItem('auth_token');
    }

    throw error;
});

export default apiClient;