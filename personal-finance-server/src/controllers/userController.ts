import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import {Transaction} from '../models/Transaction';
import {Task} from '../models/Task';
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

// Extend Express Request type to include user
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

export const register = async (req: Request<{}, {}, RegisterRequest>, res: Response<RegisterResponse>) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      logger.warn("Registration failed: Missing fields");
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        logger.warn(`Registration failed: User with email ${email} already exists`);
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      email,
      password: hashedPassword,
      fullName
    });

    await user.save();
    logger.info(`New user registered: ${email} ${fullName}`);
    
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '100y' }
    );

    res.status(201).json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token
    });
  } catch (error) {
    logger.error('Registration error for ${email} ${fullName}:', error);
    res.status(500).json({ success: false, error: 'Server error, please try again later' });
  }
};

export const login = async (req: Request<{}, {}, LoginRequest>, res: Response<LoginResponse>) => {
  const { email, password } = req.body;

  try {

    if (!email || !password) {
      logger.warn("Login failed: Missing fields");
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Login failed: User with email ${email} not found`);
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Login failed: Invalid password for email ${email}`);
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token
    });
  } catch (error) {
    logger.error(`Login error for ${email}:`, error);
    res.status(500).json({ success: false, error: 'Server error, please try again later' });
  }
};

export const requestPasswordReset = async (req: Request<{}, {}, PasswordResetRequest>, res: Response<PasswordResetResponse>) => {
  const { email } = req.body;

  try {

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Password reset request failed: User with email ${email} not found`);
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const resetCode = generateVerificationCode();
    const resetCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.passwordResetCode = {
      code: resetCode,
      expiresAt: resetCodeExpiry
    };
    
    await user.save();

    
    await sendResetCodeEmail({
      email: user.email,
      verificationCode: resetCode,
      userName: user.fullName
    });

    logger.info(`Password reset code sent to user email: ${email}`);
    res.json({ success: true });
  } catch (error) {
    logger.error(`Password reset request error for user email: ${email}:`, error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const verifyResetCode = async (req: Request<{}, {}, VerifyResetCodeRequest>, res: Response<VerifyResetCodeResponse>) => {
  const { email, code } = req.body;

  try {

    const user = await User.findOne({ 
      email, 
      resetCode: code,
      resetCodeExpiry: { $gt: new Date() }
    });

    if (!user) {
      logger.warn(`Reset code verification failed: User with email ${email} not found or Invalid code`);
      return res.status(400).json({ success: false, error: 'Invalid or expired code' });
    }

    res.json({ success: true });
  } catch (error) {
    logger.error(`Reset code verification error for email ${email}:`, error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const resetPassword = async (req: Request<{}, {}, ResetPasswordRequest>, res: Response<ResetPasswordResponse>) => {
  const { email, code, newPassword } = req.body;
  try {
    const user = await User.findOne({ 
      email, 
      resetCode: code,
      resetCodeExpiry: { $gt: new Date() }
    });

    if (!user) {
      logger.warn(`Password reset failed: User with email ${email} not found or invalid code`);
      return res.status(400).json({ success: false, error: 'Invalid or expired code' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.passwordResetCode = undefined;
    await user.save();

    logger.info(`Password reset successfully for email: ${email}`);
    res.json({ success: true });
  } catch (error) {
    logger.error(`Password reset error for email ${email}:`, error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId).select('-password');
  
    if (!user) {
      logger.warn(`Profile fetch failed: User with ID ${userId} not found`);
      return res.status(404).json({ success: false, error: "User not found" });
    }

    logger.info(`Profile fetched for user ID: ${userId}`);
    res.status(200).json({ 
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    logger.error(`Error fetching profile for user ID: ${userId}:`, error);
    res.status(500).json({ success: false, error: "Server error, please try again later" });
  }
};

export const getUserDashboard = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  try {
    const transactions = await Transaction.find({ userId });

    const openTasks = await Task.find({ userId, completed: false }) 
      .sort({ dueDate: 1 }) 
      .limit(5);//TODO - get the limit number from the client (in the request)
    
    const totalIncome = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpenses = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expensesByCategory = transactions
      .filter(t => t.type === "expense")
      .reduce((acc, t) => {
        if (!acc[t.categoryId]) {
          acc[t.categoryId] = 0;
        }
        acc[t.categoryId] += t.amount;
        return acc;
      }, {} as Record<string, number>);
    
    logger.info(`Dashboard data fetched for user ID: ${userId}`);
    res.status(200).json({
      success: true,
      data: {
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
        expensesByCategory,
        recentTransactions: transactions.slice(-5).reverse(),
        tasks: openTasks
      }
    });
  } catch (error) {
    logger.error(`Error fetching dashboard data for user ID: ${userId}:`, error);
    res.status(500).json({ success: false, error: "Server error, please try again later" });
  }
};

export const requestPasswordUpdate = async (req: AuthenticatedRequest, res: Response<RequestPasswordUpdateResponse>) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      logger.warn(`Password update request failed: User with ID ${userId} not found`);
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const verificationCode = generateVerificationCode();
    user.passwordUpdateCode = {
      code: verificationCode,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
    };
    await user.save();

    await sendResetCodeEmail(user.email, verificationCode, user.fullName);

    logger.info(`Password verification code sent to user ID: ${req.user.id}`);
    res.json({ success: true });
  } catch (error) {
    logger.error(`Error requesting password update for user ID: ${userId}:`, error);
    res.status(500).json({ success: false, error: "Error requesting password update" });
  }
};

export const verifyPasswordUpdateCode = async (req: AuthenticatedRequest, res: Response<VerifyPasswordUpdateResponse>) => {
  const userId = req.user.id;
  try {
    const { code } = req.body;
    
    const user = await User.findOne({ 
      userId, 
      resetCode: code,
      resetCodeExpiry: { $gt: new Date()} 
      });
    
    if (!user) {
      logger.warn(`Code verification failed: User with ID ${userId} not found or Invalid code`);
      return res.status(404).json({ success: false, error: "User not found or invalid code" });
    }

   
    logger.info(`Password update code verified for user ID: ${userId}`);
    res.json({ success: true });
  } catch (error) {
    logger.error(`Error verifying password update code for user ID: ${userId}:`, error);
    res.status(500).json({ success: false, error: "Error verifying code" });
  }
};

export const updatePassword = async (req: AuthenticatedRequest, res: Response<UpdatePasswordResponse>) => {
  const userId = req.user.id;
  try {
    const { currentPassword, newPassword, verificationCode } = req.body;
    const user = await User.findById(userId);
    
    if (!user) {
      logger.warn(`Password update failed: User with ID ${userId} not found`);
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      logger.warn(`Password update failed: Invalid current password for user ID ${userId}`);
      return res.status(401).json({ success: false, error: "Current password is incorrect" });
    }

    if (!user.passwordUpdateCode || !user.passwordUpdateCode.code || !user.passwordUpdateCode.expiresAt) {
      logger.warn(`Password update failed: No password update request found for user ID ${userId}`);
      return res.status(400).json({ success: false, error: "No password update request found" });
    }

    if (user.passwordUpdateCode.code !== verificationCode || user.passwordUpdateCode.expiresAt < new Date()) {
      logger.warn(`Password update failed: Invalid verification code for user ID ${userId}`);
      return res.status(400).json({ success: false, error: "Invalid verification code" });
    }


    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.passwordUpdateCode = undefined;
    await user.save();

    logger.info(`Password updated successfully for user ID: ${userId}`);
    res.json({ success: true });
  } catch (error) {
    logger.error(`Error updating password for user ID: ${userId}:`, error);
    res.status(500).json({ success: false, error: "Error updating password" });
  }
};

export const updateUserProfile = async (req: AuthenticatedRequest, res: Response<UpdateProfileResponse>) => {
  const userId = req.user.id;
  try {
    const { fullName, email } = req.body;
    const user = await User.findById(userId);
    
    if (!user) {
      logger.warn(`Profile update failed: User with ID ${userId} not found`);
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        logger.warn(`Profile update failed for user ${userId}. Email ${email} is already in use`);
        return res.status(400).json({ success: false, error: "Email is already in use" });
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
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    logger.error(`Error updating profile for user ID: ${userId}:`, error);
    res.status(500).json({ success: false, error: "Error updating profile" });
  }
}; 