import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login as setUser, logout as clearUser } from '../store/authSlice';
import { User } from '../utils/types';
import { safeJSONParse } from '../utils/utils';
import API from '../services/api';


interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const token = localStorage.getItem('token');
    const user = safeJSONParse<User>(localStorage.getItem('user'));

    return {
      token: token || null,
      user: user || null,
      loading: false,
      error: null
    };
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.token) {
      localStorage.setItem('token', auth.token);
      API.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`;
    } else {
      localStorage.removeItem('token');
      delete API.defaults.headers.common['Authorization'];
    }
  }, [auth.token]);

  useEffect(() => {
    if (auth.user) {
      const userForStorage = {
        ...auth.user,
        createdAt: auth.user.createdAt?.toString() || null,
        updatedAt: auth.user.updatedAt?.toString() || null
      };
      localStorage.setItem('user', JSON.stringify(userForStorage));
      dispatch(setUser({user: auth.user, token: auth?.token || ''}));
    } else {
      localStorage.removeItem('user');
      dispatch(setUser({ user: {
        id: '',
        email: '',
        fullName: '',
        createdAt: null,
        updatedAt: null
      }, token: '' }));
    }
  }, [auth.user, auth.token, dispatch]);

  const login = async (email: string, password: string) => {
    try {
      const response = await API.post('/users/login', { email, password });
      const { token, user } = response.data;
      
      const userWithDates = {
        ...user,
        createdAt: user.createdAt ? new Date(user.createdAt) : null,
        updatedAt: user.updatedAt ? new Date(user.updatedAt) : null
      };

      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setAuth({ 
        token, 
        user: userWithDates,
        loading: false,
        error: null
      });

      dispatch(setUser({ user: userWithDates, token }));

      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    try {
      const response = await API.post('/users/register', { email, password, fullName });
      const { token, user } = response.data;
      
      const userWithDates = {
        ...user,
        createdAt: user.createdAt ? new Date(user.createdAt) : null,
        updatedAt: user.updatedAt ? new Date(user.updatedAt) : null
      };

      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setAuth({ 
        token, 
        user: userWithDates,
        loading: false,
        error: null
      });

      dispatch(setUser({ user: userWithDates, token }));


      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    delete API.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ 
      token: null, 
      user: null,
      loading: false,
      error: null
    });
    dispatch(clearUser());
    navigate('/login', { replace: true });
  };

  const requestPasswordUpdate = async () => {
    try {
      await API.post('/users/password/request-update');
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error requesting password update'
      };
    }
  };

  const verifyPasswordUpdateCode = async (code: string) => {
    try {
      await API.post('/users/password/verify-code', { code });
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error verifying code'
      };
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string, verificationCode: string) => {
    try {
      await API.put('/users/password', {
        currentPassword,
        newPassword,
        verificationCode
      });
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error updating password'
      };
    }
  };

  const updateProfile = async (profileData: { name: string; email: string;}) => {
    try {
      const response = await API.put('/users/profile', profileData);
      dispatch(setUser(response.data.user));
      return response.data;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw new Error(error.response?.data?.message || 'Error updating profile');
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      await API.post('/users/password/request-reset', { email });
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error requesting password reset'
      };
    }
  };

  const verifyResetCode = async (email: string, code: string) => {
    try {
      await API.post('/users/password/verify-code-reset', { email, code });
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error verifying reset code'
      };
    }
  };

  const resetPassword = async (email: string, code: string, newPassword: string) => {
    try {
      await API.post('/users/password/reset', { email, code, newPassword });
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error resetting password'
      };
    }
  };

  return {
    user: auth.user,
    token: auth.token,
    loading: auth.loading,
    error: auth.error,
    login,
    register,
    logout,
    requestPasswordUpdate,
    verifyPasswordUpdateCode,
    updatePassword,
    updateProfile,
    requestPasswordReset,
    verifyResetCode,
    resetPassword
  };
};