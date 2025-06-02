// src/services/auth.service.ts

import apiClient from '../config/api.config';



class AuthService {
  async login(credentials: Record<string, any>) {
    const response = await apiClient.post('/auth/login/', credentials);
    return response.data;
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

  setSession(token: string | null, user: Record<string, never> | null) {
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      this.logout();
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}

// 📦 Export a singleton instance
const authService = new AuthService();
export default authService;