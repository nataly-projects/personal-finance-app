import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login as setUser, logout as clearUser } from '../store/authSlice';
import { RootState } from '../store/store'; 
import API from '../services/api';
import { User } from '../utils/types';
import { AxiosError } from 'axios';

interface ResetPasswordParams {
  email: string;
  code: string;
  newPassword: string;
}

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, token } = useSelector((state: RootState) => state.auth);

  const updateAuthData = (user: User | null, token: string | null) => {
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      dispatch(setUser({ user, token }));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete API.defaults.headers.common['Authorization'];
      dispatch(clearUser());
    }
  };

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: any) => {
      const response = await API.post('/users/login', { email, password });
      return response.data;
    },
    onSuccess: (data) => {
      updateAuthData(data.user, data.token);
      navigate('/dashboard');    
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await API.post('/users/register', userData);
      return response.data;
    },
    onSuccess: (data) => {
      updateAuthData(data.user, data.token);
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: { name: string; email: string }) => {
      const response = await API.put('/users/profile', profileData);
      return response.data;
    },
    onSuccess: (data) => {
      // עדכון ה-Redux וה-LocalStorage עם הנתונים החדשים
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...data.user };
      updateAuthData(updatedUser, localStorage.getItem('token'));
    }
  });

  const logout = () => {
    updateAuthData(null, null);
    navigate('/login', { replace: true });
  };

  const passwordRequestMutation = useMutation({
    mutationFn: () => API.post('/users/password/request-update')
  });

  const passwordVerifyMutation = useMutation({
    mutationFn: (code: string) => API.post('/users/password/verify-code-update', { code }),
    onError: (error: any) => {
      console.error("Verification failed:", error.response?.data?.error);
    }
  });

  const passwordUpdateMutation = useMutation({
    mutationFn: (data: any) => API.put('/users/password/update', data),
    onError: (error: any) => {
      console.error("Update password failed:", error.response?.data?.error);
    }
  });


const passwordResetRequestMutation = useMutation({
    mutationFn: (email: string) => API.put('/users/password/request-reset', email)
  });

const verifyResetCodeMutation = useMutation({
    mutationFn: ({email, code}: {email: string, code: string}) => API.put('/users/password/verify-code-reset', {email, code})
  });


const passwordResetMutation = useMutation({
    mutationFn: (resetData: ResetPasswordParams) => API.put('/users/password/reset', resetData)
  });

  return {
    user,
    token,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error as AxiosError,

    register: registerMutation.mutateAsync,
    logout,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    updateProfileError: updateProfileMutation.error as AxiosError,
    
    requestPasswordUpdate: passwordRequestMutation.mutateAsync,
    verifyPasswordUpdateCode: passwordVerifyMutation.mutateAsync,
    updatePassword: passwordUpdateMutation.mutateAsync,

    passwordResetRequest: passwordResetRequestMutation.mutateAsync,
    isRequestingCode: passwordRequestMutation.isPending,
    requestError: passwordRequestMutation.error as AxiosError,

    verifyResetCode: verifyResetCodeMutation.mutateAsync,isVerifyingCode: verifyResetCodeMutation.isPending,
    verifyError: verifyResetCodeMutation.error as AxiosError,

    resetPassword: passwordResetMutation.mutateAsync,
    isResettingPassword: passwordResetMutation.isPending,
    resetError: passwordResetMutation.error as AxiosError,
    
    forgetPasswordAuthForms: () => {
      passwordResetRequestMutation.reset();
      verifyResetCodeMutation.reset();
      passwordResetMutation.reset();
    }
  };
};