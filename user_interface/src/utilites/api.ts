import axios from 'axios';

const baseURL =  'http://127.0.0.1:8000/api/';

const instance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    // timeout: 1000,
});

export default instance;

export const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});