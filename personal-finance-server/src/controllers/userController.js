require('dotenv').config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require('../../logger');
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Task = require("../models/Task");
const { sendResetCodeEmail } = require('../services/mailService');
const { generateVerificationCode, EMAIL_SUBJECTS } = require('../utils/utils');

async function registerUser (req, res) {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      logger.warn("Registration failed: Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`Registration failed: User with email ${email} already exists`);
      return res.status(400).json({ message: "User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({ 
      email, 
      password: hashedPassword, 
      fullName 
    });
    
    await newUser.save();
    logger.info(`New user registered: ${email} ${fullName}`);

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '100y',
    });
    
    res.status(201).json({ 
      token, 
      user: {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName
      } 
    });
  } catch (error) {
    logger.error(`Error during registration for ${email} ${fullName}:`, error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

async function loginUser (req, res) {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      logger.warn("Login failed: Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Login failed: User with email ${email} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn(`Login failed: Invalid password for email ${email}`);
      return res.status(401).json({ message: "Invalid password" });
    }

    logger.info(`User logged in: ${email} ${user.fullName}`);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '100y',
    });

    res.status(200).json({ 
      token, 
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName
      } 
    });
  } catch (error) {
    logger.error(`Error during login for ${email}:`, error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

async function getUserProfile (req, res) {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      logger.warn(`Profile fetch failed: User with ID ${req.user.id} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    logger.info(`Profile fetched for user ID: ${req.user.id}`);
    res.status(200).json(user);
  } catch (error) {
    logger.error(`Error fetching profile for user ID: ${req.user.id}:`, error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

async function getUserDashboard (req, res) {
  const userId = req.user.id;
  try {
    const transactions = await Transaction.find({ userId});

    const openTasks = await Task.find({ userId, completed: false }) 
      .sort({ dueDate: 1 }) 
      .limit(5);
    
    const totalIncome = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpenses = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expensesByCategory = transactions
      .filter(t => t.type === "expense")
      .reduce((acc, t) => {
        if (!acc[t.category]) {
          acc[t.category] = 0;
        }
        acc[t.category] += t.amount;
        return acc;
      }, {});
    
    logger.info(`Dashboard data fetched for user ID: ${userId}`);
    res.status(200).json({
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      expensesByCategory,
      recentTransactions: transactions.slice(-5).reverse(),
      tasks: openTasks
    });
  } catch (error) {
    logger.error(`Error fetching dashboard data for user ID: ${userId}:`, error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

async function requestPasswordUpdate(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      logger.warn(`Password update request failed: User with ID ${req.user.id} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    const verificationCode = generateVerificationCode();
    user.passwordUpdate = {
      code: verificationCode,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
    };
    await user.save();

    await sendResetCodeEmail({
      to: user.email,
      subject: EMAIL_SUBJECTS.PASSWORD_UPDATE,
      text: `Your password update verification code is: ${verificationCode}\nThe code is valid for 15 minutes only.`
    });

    logger.info(`Password verification code sent to user ID: ${req.user.id}`);
    res.json({ message: "Verification code has been sent to your email" });
  } catch (error) {
    logger.error(`Error requesting password update for user ID: ${req.user.id}:`, error);
    res.status(500).json({ message: "Error requesting password update" });
  }
}

async function verifyPasswordUpdateCode(req, res) {
  try {
    const { code } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      logger.warn(`Code verification failed: User with ID ${req.user.id} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.passwordUpdate || !user.passwordUpdate.code || !user.passwordUpdate.expiresAt) {
      logger.warn(`Code verification failed: No password update request found for user ID ${req.user.id}`);
      return res.status(400).json({ message: "No password update request found" });
    }

    if (user.passwordUpdate.code !== code) {
      logger.warn(`Code verification failed: Invalid code for user ID ${req.user.id}`);
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (user.passwordUpdate.expiresAt < new Date()) {
      logger.warn(`Code verification failed: Code expired for user ID ${req.user.id}`);
      return res.status(400).json({ message: "Verification code has expired" });
    }

    logger.info(`Password update code verified for user ID: ${req.user.id}`);
    res.json({ message: "Code verified successfully" });
  } catch (error) {
    logger.error(`Error verifying password update code for user ID: ${req.user.id}:`, error);
    res.status(500).json({ message: "Error verifying code" });
  }
}

async function updatePassword(req, res) {
  try {
    const { currentPassword, newPassword, verificationCode } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      logger.warn(`Password update failed: User with ID ${req.user.id} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      logger.warn(`Password update failed: Invalid current password for user ID ${req.user.id}`);
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    if (!user.passwordUpdate || !user.passwordUpdate.code || !user.passwordUpdate.expiresAt) {
      logger.warn(`Password update failed: No password update request found for user ID ${req.user.id}`);
      return res.status(400).json({ message: "No password update request found" });
    }

    if (user.passwordUpdate.code !== verificationCode) {
      logger.warn(`Password update failed: Invalid verification code for user ID ${req.user.id}`);
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (user.passwordUpdate.expiresAt < new Date()) {
      logger.warn(`Password update failed: Code expired for user ID ${req.user.id}`);
      return res.status(400).json({ message: "Verification code has expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.passwordUpdate = undefined;
    await user.save();

    logger.info(`Password updated successfully for user ID: ${req.user.id}`);
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    logger.error(`Error updating password for user ID: ${req.user.id}:`, error);
    res.status(500).json({ message: "Error updating password" });
  }
}

async function updateUserProfile(req, res) {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      logger.warn(`Profile update failed: User with ID ${req.user.id} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        logger.warn(`Profile update failed: Email ${email} is already taken`);
        return res.status(400).json({ message: "Email is already taken" });
      }
    }

    user.fullName = name || user.fullName;
    user.email = email || user.email;
    
    await user.save();
    logger.info(`Profile updated for user ID: ${req.user.id}`);

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
      }
    });
  } catch (error) {
    logger.error(`Error updating profile for user ID: ${req.user.id}:`, error);
    res.status(500).json({ message: "Error updating profile" });
  }
}

async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      logger.warn(`Password reset request failed: User with email ${email} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    const resetCode = generateVerificationCode();
    user.passwordReset = {
      code: resetCode,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
    };
    await user.save();

    await sendResetCodeEmail({
      to: user.email,
      subject: EMAIL_SUBJECTS.PASSWORD_RESET,
      text: `Your password reset code is: ${resetCode}\nThe code is valid for 15 minutes only.`
    });

    logger.info(`Password reset code sent to user email: ${email}`);
    res.json({ message: "Reset code has been sent to your email" });
  } catch (error) {
    logger.error(`Error requesting password reset for email: ${req.body.email}:`, error);
    res.status(500).json({ message: "Error requesting password reset" });
  }
}

async function verifyResetCode(req, res) {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      logger.warn(`Reset code verification failed: User with email ${email} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.passwordReset || !user.passwordReset.code || !user.passwordReset.expiresAt) {
      logger.warn(`Reset code verification failed: No reset request found for email ${email}`);
      return res.status(400).json({ message: "No password reset request found" });
    }

    if (user.passwordReset.code !== code) {
      logger.warn(`Reset code verification failed: Invalid code for email ${email}`);
      return res.status(400).json({ message: "Invalid reset code" });
    }

    if (user.passwordReset.expiresAt < new Date()) {
      logger.warn(`Reset code verification failed: Code expired for email ${email}`);
      return res.status(400).json({ message: "Reset code has expired" });
    }

    logger.info(`Password reset code verified for email: ${email}`);
    res.json({ message: "Code verified successfully" });
  } catch (error) {
    logger.error(`Error verifying reset code for email: ${req.body.email}:`, error);
    res.status(500).json({ message: "Error verifying reset code" });
  }
}

async function resetPassword(req, res) {
  try {
    const { email, code, newPassword } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      logger.warn(`Password reset failed: User with email ${email} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.passwordReset || !user.passwordReset.code || !user.passwordReset.expiresAt) {
      logger.warn(`Password reset failed: No reset request found for email ${email}`);
      return res.status(400).json({ message: "No password reset request found" });
    }

    if (user.passwordReset.code !== code) {
      logger.warn(`Password reset failed: Invalid reset code for email ${email}`);
      return res.status(400).json({ message: "Invalid reset code" });
    }

    if (user.passwordReset.expiresAt < new Date()) {
      logger.warn(`Password reset failed: Code expired for email ${email}`);
      return res.status(400).json({ message: "Reset code has expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.passwordReset = undefined;
    await user.save();

    logger.info(`Password reset successfully for email: ${email}`);
    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    logger.error(`Error resetting password for email: ${req.body.email}:`, error);
    res.status(500).json({ message: "Error resetting password" });
  }
}

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getUserDashboard,
  requestPasswordUpdate,
  verifyPasswordUpdateCode,
  updatePassword,
  updateUserProfile,
  requestPasswordReset,
  verifyResetCode,
  resetPassword
};
