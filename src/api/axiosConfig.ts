import axios from 'axios';

// Vite usa import.meta.env en lugar de process.env
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

const api = axios.create({
    baseURL: apiUrl, // <--- AQUÍ USAMOS LA VARIABLE
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;