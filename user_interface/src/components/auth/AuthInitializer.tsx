import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/slices/authSlice';
import { apiService } from '../../services/api.service';
import { API_ENDPOINTS } from '../../config/api.config';
import { User } from '../../types';

/**
 * AuthInitializer component to check for existing tokens and fetch user data on app startup
 * This component doesn't render anything, it just performs the authentication check
 */
const AuthInitializer: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      // Check if we have an auth token in localStorage
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        try {
          // Try to fetch user profile with the stored token
          const userData = await apiService.get<User>(API_ENDPOINTS.USER.PROFILE);
          
          // If successful, update the auth state
          dispatch(loginSuccess(userData));
        } catch (error) {
          // If token is invalid, clear it from storage
          console.error('Authentication failed with stored token:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
        }
      }
    };

    initializeAuth();
  }, [dispatch]);

  // This component doesn't render anything
  return null;
};

export default AuthInitializer; 