import axios from 'axios';

const instance = axios.create({
    // Dynamically use the current hostname (localhost or IP) to allow mobile access
    baseURL: `http://${window.location.hostname}:5000/api`
});

// Add a request interceptor to include the token in all requests
instance.interceptors.request.use(
    (config) => {
        const storedUser = JSON.parse(localStorage.getItem('mindcare_user'));
        const token = storedUser?.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
