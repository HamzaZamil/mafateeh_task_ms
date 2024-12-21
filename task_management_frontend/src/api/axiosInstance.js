import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        withCredentials: true,
    },
});

// Function to initialize CSRF token
const initializeCsrfToken = async () => {
    await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie', {
        withCredentials: true,
    });
};

// Add a request interceptor for adding Authorization token
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = sessionStorage.getItem('authToken'); // Ensure consistent use of sessionStorage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
export { initializeCsrfToken };
