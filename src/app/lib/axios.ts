import axios from 'axios';
import { secureStorage } from './secure-storage';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor for API calls
api.interceptors.request.use(
    (config) => {
        const apiKey = secureStorage.getItem('api_key');
        const apiSecret = secureStorage.getItem('api_secret');
        if (apiKey && apiSecret) {
            config.headers.Authorization = `token ${apiKey}:${apiSecret}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for API calls
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response?.status === 401) {
            // Clear local storage and redirect to login if unauthorized
            secureStorage.removeItem('token');
            secureStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
