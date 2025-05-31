import axios, {
    InternalAxiosRequestConfig,
    AxiosResponse,
    AxiosError,
} from 'axios';
import { ApiResponse, SuccessApiResponse , ErrorApiResponse } from "../types/api.ts";

// ========================
// 🔗 API Base URL
// ========================
const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

// ========================
// 🌐 Public Endpoints (no auth required)
// ========================
const PUBLIC_ENDPOINTS = [
    '/auth/login/',
    '/auth/register/',
    '/auth/forgot-password/',
    '/auth/reset-password/',
    '/products/',
    '/categories/',
];

const isPublicEndpoint = (url: string): boolean => {
    return PUBLIC_ENDPOINTS.some(
        (endpoint) =>
            url === endpoint ||
            url.startsWith(`${endpoint}`) ||
            (endpoint === '/products/' && url.match(/^\/products\/[\w-]+\/$/))
    );
};

// ========================
// 🧩 Create Axios Instance
// ========================
export const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ========================
// 🔐 Request Interceptor - Add token conditionally
// ========================
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        const shouldAddToken = config.url && !isPublicEndpoint(config.url);

        if (token && shouldAddToken) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => {
        // Network or setup error
        const errorResponse: ErrorApiResponse = {
            status: 500,
            message: 'Request setup failed',
            error_dict: { details: error.message },
        };
        return Promise.reject(errorResponse);
    }
);

// ========================
// 📦 Response Interceptor - Normalize response format
// ========================
apiClient.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {

      const transformedData: SuccessApiResponse = {
        status: response.status,
        message: response.data?.message || 'Success',
        data: response.data?.data || response.data,
      };
      
      // Return the original response structure but with transformed data
      response.data = transformedData;
      return response;
    },
    (error: AxiosError<ApiResponse<unknown>>) => {
        const response = error.response;
        const status = response?.status || 500;
        const message =  error.message||response?.data?.message || 'Something went wrong';


        if (status === 401) {
            localStorage.removeItem('token');
        }

        const errorResponse: ErrorApiResponse = {
            status,
            message,
            error_dict: response?.data || { details: error.message },
        };

        return Promise.reject(errorResponse);
    }
);

export default apiClient;