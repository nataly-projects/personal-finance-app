import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  fullName: string;
  password?: string; 
  passwordUpdateCode?: string;
  passwordResetCode?: Date;
  createdAt: Date;
  updatedAt: Date | null;
  settings?: {
    monthlyOutcomeLimit: number | null;
    enableOutcomeAlert: boolean;
    theme: 'light' | 'dark';
  };
}

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email: string;
      };
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: Omit<User, 'password'>;
  token?: string;
  error?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface RegisterResponse {
  success: boolean;
  user?: Omit<User, 'password'>;
  token?: string;
  error?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  success: boolean;
  error?: string;
  message?: string;
}

export interface VerifyResetCodeRequest {
  email: string;
  code: string;
}

export interface VerifyResetCodeResponse {
  success: boolean;
  error?: string;
  message?: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  error?: string;
  message?: string;
}

export interface UpdateProfileRequest {
  fullName: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  user?: Omit<User, 'password'>;
  error?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
  verificationCode: string;
}

export interface UpdatePasswordResponse {
  success: boolean;
  error?: string;
}

export interface RequestPasswordUpdateRequest {
  email: string;
}

export interface RequestPasswordUpdateResponse {
  success: boolean;
  error?: string;
}

export interface VerifyPasswordUpdateRequest {
  code: string;
}

export interface VerifyPasswordUpdateResponse {
  success: boolean;
  error?: string;
} 