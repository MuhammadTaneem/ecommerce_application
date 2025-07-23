// src/services/auth.service.ts

import apiClient from '../config/api.config';

interface LoginResponse {
  id: number;
  type: string;
  token: string;
}

interface UserResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  user_type: string;
  role: {
    id: number;
    name: string;
    permissions: string[];
    description: string;
  };
  is_active: boolean;
  date_joined: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  user_type?: string;
}

interface SearchParams {
  search?: string;
  email?: string;
  phone?: string;
  role_id?: string | number;
}

class AuthService {
  async login(data: LoginData) {
    const response = await apiClient.post<LoginResponse>('auth/login/', data);
    if (response.data.token) {
      this.setSession(response.data.token, response.data);
    }
    return response;
  }

  async register(data: RegisterData) {
    const response = await apiClient.post<UserResponse>('auth/sign_up/', data);
    return response;
  }

  async getProfile() {
    const response = await apiClient.get<UserResponse>('auth/profile/');
    return response;
  }

  async updateProfile(data: Partial<RegisterData>) {
    const response = await apiClient.put<UserResponse>('auth/update_profile/', data);
    return response;
  }

  async changePassword(data: { password: string; new_password: string; confirm_new_password: string }) {
    const response = await apiClient.put('auth/change_password/', data);
    return response;
  }

  async requestPasswordReset(email: string) {
    const response = await apiClient.post('auth/reset_password/', { email });
    return response;
  }

  async resetPassword(data: { token: string; new_password: string; confirm_new_password: string }) {
    const response = await apiClient.put('auth/reset_password_confirm/', data);
    return response;
  }

  async resendActivationEmail(email: string) {
    const response = await apiClient.post('auth/re_send_activation_email/', { email });
    return response;
  }

  async activateAccount(token: string) {
    const response = await apiClient.post('auth/active_user/', { token });
    return response;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }

    return null;
  }

  setSession(token: string | null, user: Record<string, any> | null) {
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user_id', JSON.stringify(user['id']));
      localStorage.setItem('user_type', JSON.stringify(user['type']));
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      this.logout();
      delete apiClient.defaults.headers.common['Authorization'];
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return true;
    }
    return false;
  }

  async getAddresses(): Promise<any> {
    try {
      const response = await apiClient.get('auth/addresses/');
      return response.data;
    } catch (error) {
      console.error('Error fetching addresses:', error);
      throw error;
    }
  }

  async getCustomers(page = 1, limit = 10, searchParams: SearchParams = {}) {
    try {
      let queryParams = `page=${page}&limit=${limit}`;
      
      // Add search parameters to the query string
      if (searchParams.search) {
        queryParams += `&search=${encodeURIComponent(searchParams.search)}`;
      }
      
      if (searchParams.email) {
        queryParams += `&email=${encodeURIComponent(searchParams.email)}`;
      }
      
      if (searchParams.phone) {
        queryParams += `&phone=${encodeURIComponent(searchParams.phone)}`;
      }
      
      if (searchParams.role_id) {
        queryParams += `&role_id=${encodeURIComponent(searchParams.role_id.toString())}`;
      }
      
      const response = await apiClient.get(`auth/list/?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }
}

// 📦 Export a singleton instance
const authService = new AuthService();
export default authService;