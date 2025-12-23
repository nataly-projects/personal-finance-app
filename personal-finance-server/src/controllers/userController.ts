import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse,
  PasswordResetRequest,
  PasswordResetResponse,
  VerifyResetCodeRequest,
  VerifyResetCodeResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  RequestPasswordUpdateRequest,
  RequestPasswordUpdateResponse,
  VerifyPasswordUpdateRequest,
  VerifyPasswordUpdateResponse
} from '@shared/types/auth';
import { generateVerificationCode } from '../utils/utils';
import { sendResetCodeEmail, sendPasswordUpdateEmail } from '../services/mailService';
import { logger } from '../utils/logger';
import { asyncHandler } from '../middleware/errorMiddleware';
import { getDashboardData } from '../services/dashboardService';
import { ApiError } from '../utils/utils';
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

export const register = asyncHandler(async (req: Request<{}, {}, RegisterRequest>, res: Response<RegisterResponse>) => {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    logger.warn("Registration failed: Missing fields");
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    logger.warn(`Registration failed: User with email ${email} already exists`);
    throw new ApiError(400, "User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({ 
    email, 
    password: hashedPassword, 
    fullName 
  });
  await user.save();
  
  logger.info(`New user registered: ${email}`);

  const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_KEY || 'your-secret-key',
      { expiresIn: '100y' }
  );

  res.status(201).json({
      success: true,
      user: {
          id: user.id.toString(),
          email: user.email,
          fullName: user.fullName,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
      },
      token
  });
});


export const login = asyncHandler(async (req: Request<{}, {}, LoginRequest>, res: Response<LoginResponse>) => {
  const { email, password } = req.body;

  if (!email || !password) {
    logger.warn("Login failed: Missing fields");
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    logger.warn(`Login failed: User with email ${email} not found`);
    return res.status(400).json({ success: false, error: 'Invalid credentials' });
  }
  const isMatch = user ? await bcrypt.compare
  (password, user.password) : false;
  if (!isMatch) {
    logger.warn(`Login failed: Invalid password for email ${email}`);
    return res.status(400).json({ success: false, error: 'Invalid credentials' });
  }

  const token = jwt.sign(
      { id: user.id.toString(), email: user.email },
      process.env.JWT_SECRET_KEY || 'your-secret-key',
      { expiresIn: '1d' }
  );

  res.json({
      success: true,
      user: {
        id: user.id.toString(),
        email: user.email,
        fullName: user.fullName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token
  });
});


export const requestPasswordReset = asyncHandler(async (req: Request<{}, {}, PasswordResetRequest>, res: Response<PasswordResetResponse>) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      logger.warn(`Password reset request failed: User with email ${email} not found`);
      throw new ApiError(404, "User not found");
    }

    const resetCode = generateVerificationCode();

    user.passwordResetCode = {
        code: resetCode,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000)
    };
    
    await user.save();

    await sendResetCodeEmail({
        email: user.email,
        verificationCode: resetCode,
        userName: user.fullName
    });

    logger.info(`Password reset code sent to: ${email}`);
    res.json({ success: true });
});


export const verifyResetCode = asyncHandler(async (req: Request<{}, {}, VerifyResetCodeRequest>, res: Response<VerifyResetCodeResponse>) => {
    const { email, code } = req.body;
    const user = await User.findOne({ 
        email, 
        'passwordResetCode.code': code, 
        'passwordResetCode.expiresAt': { $gt: new Date() }
    });

    if (!user) {
      logger.warn(`Reset code verification failed: User with email ${email} not found or Invalid code`);
      throw new ApiError(400, "Invalid or expired code");
    }

    res.json({ success: true });
});

export const resetPassword = asyncHandler(async (req: Request<{}, {}, ResetPasswordRequest>, res: Response<ResetPasswordResponse>) => {
    const { email, code, newPassword } = req.body;
    const user = await User.findOne({ 
        email, 
        'passwordResetCode.code': code,
        'passwordResetCode.expiresAt': { $gt: new Date() }
    });

    if (!user) {
      logger.warn(`Password reset failed: User with email ${email} not found or invalid code`);
      throw new ApiError(400, "Invalid or expired code");
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.passwordResetCode = undefined;
    await user.save();

    logger.info(`Password reset successfully for: ${email}`);
    res.json({ success: true });
});


export const getUserProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  const user = await User.findById(userId).select('-password');

  if (!user) {
    logger.warn(`Profile fetch failed: User with ID ${userId} not found`);
    throw new ApiError(404, "User not found");
  }

  logger.info(`Profile fetched for user ID: ${userId}`);

  res.status(200).json({ 
      success: true,
      user: {
        id: user.id.toString(),
        email: user.email,
        fullName: user.fullName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
  });
});


export const getUserDashboard = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;

  const dashboardData = await getDashboardData(userId);

  logger.info(`Dashboard data fetched for user ID: ${userId}`);
  
  res.status(200).json({
    success: true,
    data: dashboardData
  });
});


export const requestPasswordUpdate = asyncHandler(async (req: AuthenticatedRequest, res: Response<RequestPasswordUpdateResponse>) => {
  const userId = req.user.id;
 
  const user = await User.findById(userId);
  if (!user) {
    logger.warn(`Password update request failed: User with ID ${userId} not found`);
    throw new ApiError(404, "User not found");
  }

  const verificationCode = generateVerificationCode();
  user.passwordUpdateCode = {
    code: verificationCode,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
  };
  await user.save();

  await sendResetCodeEmail({
    email: user.email, 
    verificationCode: verificationCode, 
    userName: user.fullName});

  logger.info(`Password verification code sent to user ID: ${req.user.id}`);
  res.json({ success: true });
  
});


export const verifyPasswordUpdateCode = asyncHandler(async (req: AuthenticatedRequest, res: Response<VerifyPasswordUpdateResponse>) => {
  const userId = req.user.id;
  const { code } = req.body;
    
  const user = await User.findOne({ 
    userId, 
    resetCode: code,
    resetCodeExpiry: { $gt: new Date()} 
    });
    
  if (!user) {
    logger.warn(`Code verification failed: User with ID ${userId} not found or Invalid code`);
    throw new ApiError(404, "User not found");
  }

  logger.info(`Password update code verified for user ID: ${userId}`);
  res.json({ success: true });
});


export const updatePassword = asyncHandler(async (req: AuthenticatedRequest, res: Response<UpdatePasswordResponse>) => {
    const { currentPassword, newPassword, verificationCode } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    
    if (!user){
      logger.warn(`Password update failed: User with ID ${userId} not found`);
      throw new ApiError(404, "User not found");
    } 

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      logger.warn(`Password update failed: Invalid current password for user ID ${userId}`);
      throw new ApiError(401, "Current password is incorrect");
    } 

    // if (!user.passwordUpdateCode || 
    //     user.passwordUpdateCode.code !== verificationCode || 
    //     user.passwordUpdateCode.expiresAt < new Date()) {
    if(!user.passwordUpdateCode || !user.passwordUpdateCode.code || !user.passwordUpdateCode.expiresAt) {
        logger.warn(`Password update failed: No password update request found for user ID ${userId}`);
        throw new ApiError(400, "No password update request found");
    }

    if (user.passwordUpdateCode.code !== verificationCode || user.passwordUpdateCode.expiresAt < new Date()) {
      logger.warn(`Password update failed: Invalid verification code for user ID ${userId}`);
      throw new ApiError(400, "Invalid verification code");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordUpdateCode = undefined;
    await user.save();

    logger.info(`Password updated for user ID: ${req.user.id}`);
    res.json({ success: true });
});


export const updateUserProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response<UpdateProfileResponse>) => {
    const { fullName, email } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user){
      logger.warn(`Profile update failed: User with ID ${userId} not found`);
      throw new ApiError(404, "User not found");
    } 

    if (email && email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser){
          logger.warn(`Profile update failed for user ${userId}. Email ${email} is already in use`);
          throw new ApiError(400, "Email is already in use");
        }
        user.email = email;
    }

    user.fullName = fullName || user.fullName;
    user.updatedAt = new Date();
    await user.save();
    logger.info(`Profile updated successfully for user ID: ${userId}`);

    res.json({ 
        success: true,
        user: {
            id: user.id.toString(),
            email: user.email,
            fullName: user.fullName,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    });
});