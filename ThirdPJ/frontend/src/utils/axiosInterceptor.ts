import axios from 'axios';

// Set base URL for all API requests
axios.defaults.baseURL = 'http://localhost:3000';

const setupAxiosInterceptor = () => {
    // Request Interceptor
    axios.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers['x-auth-token'] = token;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response Interceptor
    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                // 401 Unauthorized error
                console.error('401 Unauthorized: Redirecting to login page.');
                localStorage.removeItem('token'); // Remove invalid token
                window.location.href = '/login'; // Redirect to login page
            }
            return Promise.reject(error);
        }
    );
};

export default setupAxiosInterceptor;