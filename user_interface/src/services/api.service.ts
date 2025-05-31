import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../config/api.config';

// Define public endpoints that don't need authentication
const PUBLIC_ENDPOINTS = [
  '/auth/login/',
  '/auth/register/',
  '/auth/forgot-password/',
  '/auth/reset-password/',
  '/products/',
  '/categories/'
];

// Helper function to check if a URL is public
const isPublicEndpoint = (url: string): boolean => {
  return PUBLIC_ENDPOINTS.some(endpoint => {
    // Check if the URL starts with the public endpoint
    // or is an exact match (for endpoints like /products/)
    return url === endpoint || 
           url.startsWith(`${endpoint}`) ||
           // For product details with IDs
           (endpoint === '/products/' && url.match(/^\/products\/[\w-]+\/$/));
  });
};

// // Helper function to ensure URLs end with a slash for Django compatibility
// const ensureTrailingSlash = (url: string): string => {
//   // Don't add slash if URL already has one or contains query parameters
//   if (url.endsWith('/') || url.includes('?')) {
//     return url;
//   }
//   // Don't add slash to empty URL
//   if (url === '') {
//     return url;
//   }
//   return `${url}/`;
// };

class ApiService {
  private static instance: ApiService;
  private api: AxiosInstance;
  private retryCount: number = 0;

  private constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Only add token for non-public endpoints
        const url = config.url || '';
        const isPublic = isPublicEndpoint(url);
        
        if (!isPublic) {
          const token = this.getAuthToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }


        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;
        
        // Handle 401 Unauthorized error
        if (error.response?.status === 401 && this.retryCount < API_CONFIG.RETRY_ATTEMPTS) {
          this.retryCount++;
          
          try {
            // Try to refresh the token
            const newToken = await this.refreshToken();
            if (newToken && originalRequest) {
              // Update token in storage
              this.setAuthToken(newToken);
              // Retry the original request with new token
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // If refresh token fails, logout user
            this.logout();
            return Promise.reject(refreshError);
          }
        }

        this.retryCount = 0;
        return Promise.reject(error);
      }
    );
  }

  // Token management methods
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  private async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await this.api.post('/auth/refresh-token/', {
        refresh_token: refreshToken,
      });

      return response.data.access_token;
    } catch (error) {
      return null;
    }
  }

  private logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    // Dispatch logout action or redirect to login page
    window.location.href = '/login';
  }

  // HTTP methods
  public async get<T>(url: string, config = {}): Promise<T> {
    const response = await this.api.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data = {}, config = {}): Promise<T> {
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data = {}, config = {}): Promise<T> {
    const response = await this.api.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config = {}): Promise<T> {
    const response = await this.api.delete<T>(url, config);
    return response.data;
  }

  public async patch<T>(url: string, data = {}, config = {}): Promise<T> {
    const response = await this.api.patch<T>(url, data, config);
    return response.data;
  }
}

export const apiService = ApiService.getInstance(); 