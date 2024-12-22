import axios from 'axios';

// Create Axios instance with base configuration
const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
    },
    withCredentials: true, // Ensures cookies are sent with requests
});

// Function to initialize CSRF token
const initializeCsrfToken = async () => {
    try {
        await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie', {
            withCredentials: true,
        });
        console.log('CSRF token initialized successfully.');
    } catch (error) {
        console.error('Error initializing CSRF token:', error);
    }
};

// Add a request interceptor for adding Authorization token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken'); // Check both storages
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            console.warn("Authorization token is missing. Please log in.");
        }
        return config;
    },
    (error) => {
        console.error("Request error in Axios interceptor:", error);
        return Promise.reject(error);
    }
);

export default axiosInstance;
export { initializeCsrfToken };
