import axios, {
    InternalAxiosRequestConfig,
    AxiosError,
    AxiosInstance,
} from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const PUBLIC_ENDPOINTS: string[] = [
    'auth/login/',
    'auth/sign_up/',
    'auth/reset_password/',
    'auth/reset_password_confirm/',
    'auth/re_send_activation_email/',
    'auth/active_user/',
    'auth/products/',
    'auth/categories/',
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
        else{
            config.headers['Authorization'] = null;
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
    async (error: AxiosError): Promise<AxiosError> => {
        // Handle 401 Unauthorized responses
        if (error.response?.status === 401) {
            // Clear auth data from localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Redirect to login page if not already there
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }

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