import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure, logout } from '../store/slices/authSlice';
import { authService } from '../services/auth.service';
import { RootState } from '../store';
import { User } from '../types';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);

  const login = async (email: string, password: string) => {
    try {
      dispatch(loginStart());
      const response = await authService.login({ email, password });
      
      // Store tokens in localStorage
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      
      // Map API response to User type
      const userData: User = {
        id: Number(response.user.id),
        email: response.user.email,
        name: response.user.name,
        addresses: [] // Initialize with empty addresses array
      };
      
      dispatch(loginSuccess(userData));
      navigate('/');
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch(loginFailure(errorMessage));
      throw error;
    }
  };

  const register = async (data: any) => {
    try {
      dispatch(loginStart());
      const response = await authService.register(data);
      
      // Store tokens in localStorage
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      
      // Map API response to User type
      const userData: User = {
        id: Number(response.user.id),
        email: response.user.email,
        name: response.user.name,
        addresses: [] // Initialize with empty addresses array
      };
      
      dispatch(loginSuccess(userData));
      navigate('/');
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch(loginFailure(errorMessage));
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      // Call logout API if user is authenticated
      if (isAuthenticated) {
        await authService.logout();
      }
      
      // Remove tokens from localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, we should still clear local state
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      dispatch(logout());
      navigate('/login');
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      return await authService.forgotPassword(email);
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      return await authService.resetPassword(token, password);
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout: logoutUser,
    forgotPassword,
    resetPassword
  };
}; 