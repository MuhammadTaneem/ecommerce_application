import axios, {
    InternalAxiosRequestConfig,
    AxiosError,
    AxiosInstance,
} from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const PUBLIC_ENDPOINTS: string[] = [
    '/auth/login/',
    '/auth/register/',
    '/auth/forgot-password/',
    '/auth/reset-password/',
    '/products/',
    '/categories/',
];

const isPublicEndpoint = (url: string): boolean => {
    return PUBLIC_ENDPOINTS.some((endpoint) =>
        url.startsWith(endpoint) ||
        new RegExp(`^${endpoint.replace(/\//g, '\\/')}(?:[\\w\\-]+)?/?$`).test(url)
    );
};

const apiClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token = localStorage.getItem('token');
        const shouldAddToken = config.url && !isPublicEndpoint(config.url);

        if (token && shouldAddToken) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError): Promise<AxiosError> => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError): Promise<AxiosError> => {
        // Optional: Handle global errors (e.g., network issues, 500s)
        if (import.meta.env.DEV) {
            console.error('[API Response Error]', error.message);
        }

        if (!navigator.onLine) {
            alert('You are offline. Please check your internet connection.');
        } else if (error.response?.status === 500) {
            alert('Internal server error. Please try again later.');
        }

        return Promise.reject(error);
    }
);

export default apiClient;