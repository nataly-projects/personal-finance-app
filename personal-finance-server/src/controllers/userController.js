require('dotenv').config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require('../../logger');
const User = require("../models/User");
const Transaction = require("../models/Transaction");

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
  try {
    const transactions = await Transaction.find({ userId: req.user.id });
    
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
    
    logger.info(`Dashboard data fetched for user ID: ${req.user.id}`);
    res.status(200).json({
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      expensesByCategory,
      recentTransactions: transactions.slice(-5).reverse()
    });
  } catch (error) {
    logger.error(`Error fetching dashboard data for user ID: ${req.user.id}:`, error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getUserDashboard
};
