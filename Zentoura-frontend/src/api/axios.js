import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add language parameter to GET requests
        if (config.method === 'get') {
            const language = localStorage.getItem('language') || 'en';
            config.params = config.params || {};
            if (!config.params.language) {
                config.params.language = language;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const IMAGE_BASE_URL = 'http://localhost:5001/uploads';

export default axiosInstance;
