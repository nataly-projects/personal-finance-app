// require('dotenv').config();
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const Transaction = require("../models/Transaction");
// const { Task } = require('../models/Task');



// async function registerUser (req, res) {
//     console.log('registerUser');
//   const { email, password, fullName } = req.body;

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ email, password: hashedPassword, fullName });
//     const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
//         expiresIn: '100y',
//     });
//     await newUser.save();
//     res.status(201).json({ token, user: newUser });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message });
//   }
// };

// async function loginUser (req, res) {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
//       expiresIn: '100y',
//     });

//     res.status(200).json({ token, user });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// async function getUserProfile (req, res) {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// async function getUserDashboard (req, res) {
//   try {
//     console.log('getUserDashboard');
//     const transactions = await Transaction.find({userId: req.user.id });

//     const totalIncome = transactions
//       .filter(t => t.type === 'income')
//       .reduce((sum, t) => sum + t.amount, 0);

//     const totalExpense = transactions
//       .filter(t => t.type === 'expense')
//       .reduce((sum, t) => sum + t.amount, 0);

//     //aggregate by category
//     const breakdownByCategory = transactions.reduce((acc, t) => {
//       acc[t.category] = (acc[t.category] || 0) + t.amount;
//       return acc;
//     }, {});

//     res.json({
//       totalIncome,
//       totalExpense,
//       breakdownByCategory,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error fetching dashboard data" });
//   }
// }

// async function getUserTasks(req, res) {
//   // const { userId } = req.params;
//   try {
//     const userTasks = await Task.find({ userId: req.user.id });
    
//     console.log('tasks: ', userTasks);
//     res.status(200).json(userTasks);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// }


// async function addUserTask(req, res) {
//   const { userId } = req.params;
//   const {newTask} = req.body;
//   console.log('newTask: ', newTask);
//   try {
//     const task = new Task({...newTask});
//      await task.save();
//     const user = await User.findByIdAndUpdate(
//       userId,
//       { $push: { tasks: task._id } },
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     res.status(201).json({ message: 'Task added successfully',  task});

//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// }

// async function updateUserTask(req, res) {
//   const { userId, taskId } = req.params;
//   const {updateTask} = req.body;
//   console.log('updateTask: ', updateTask);
//   try {
//     const task = await Task.findByIdAndUpdate(
//       taskId,
//       { ...updateTask },
//       { new: true }
//     );    

//     if (!task) {
//         return res.status(404).json({ error: 'Task not found' });
//     }

//     res.status(200).json({ message: 'Task updated successfully', task });
  
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// }

// async function deleteUserTask(req, res) {
//   const { userId, taskId } = req.params;
//   try {
//     const task = await Task.findByIdAndDelete(taskId);
//     if (!task) {
//       return res.status(404).json({ error: 'Task not found' });
//     }
//     const user = await User.findById(userId);
//     user.tasks = user.tasks.filter(t => t.toString() !== taskId);
//     await user.save();

//     res.status(200).json({ message: 'Task deleted successfully' });

//   } catch (error) {
//     res.status(500).json({ error: 'Error while deleting task, please try again later' });
//   }

   
// }

// module.exports = {
//     registerUser,
//     loginUser,
//     getUserProfile, 
//     getUserDashboard,
//     getUserTasks,
//     addUserTask,
//     updateUserTask,
//     deleteUserTask
// }

require('dotenv').config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

async function registerUser (req, res) {
  const { email, password, fullName } = req.body;

  try {
    // בדיקת תקינות הנתונים
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "כל השדות נדרשים" });
    }

    // בדיקה אם המשתמש כבר קיים
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "משתמש כבר קיים במערכת" });
    }

    // הצפנת הסיסמה
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // יצירת משתמש חדש
    const newUser = new User({ 
      email, 
      password: hashedPassword, 
      fullName 
    });
    
    // שמירת המשתמש
    await newUser.save();
    
    // יצירת טוקן
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '100y',
    });
    
    // החזרת תשובה
    res.status(201).json({ 
      token, 
      user: {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName
      } 
    });
  } catch (error) {
    console.error("שגיאה בהרשמה:", error);
    res.status(500).json({ message: "שגיאת שרת, נסה שוב מאוחר יותר" });
  }
};

async function loginUser (req, res) {
  const { email, password } = req.body;

  try {
    // בדיקת תקינות הנתונים
    if (!email || !password) {
      return res.status(400).json({ message: "כל השדות נדרשים" });
    }

    // מציאת המשתמש
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "משתמש לא נמצא" });
    }

    // בדיקת סיסמה
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "סיסמה שגויה" });
    }

    // יצירת טוקן
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '100y',
    });

    // החזרת תשובה
    res.status(200).json({ 
      token, 
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName
      } 
    });
  } catch (error) {
    console.error("שגיאה בהתחברות:", error);
    res.status(500).json({ message: "שגיאת שרת, נסה שוב מאוחר יותר" });
  }
};

async function getUserProfile (req, res) {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "משתמש לא נמצא" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("שגיאה בקבלת פרופיל:", error);
    res.status(500).json({ message: "שגיאת שרת, נסה שוב מאוחר יותר" });
  }
};

async function getUserDashboard (req, res) {
  try {
    // קבלת עסקאות של המשתמש
    const transactions = await Transaction.find({ userId: req.user.id });
    
    // חישוב סה"כ הכנסות והוצאות
    const totalIncome = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpenses = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    
    // חישוב הוצאות לפי קטגוריות
    const expensesByCategory = transactions
      .filter(t => t.type === "expense")
      .reduce((acc, t) => {
        if (!acc[t.category]) {
          acc[t.category] = 0;
        }
        acc[t.category] += t.amount;
        return acc;
      }, {});
    
    // החזרת נתוני הדשבורד
    res.status(200).json({
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      expensesByCategory,
      recentTransactions: transactions.slice(-5).reverse()
    });
  } catch (error) {
    console.error("שגיאה בקבלת נתוני דשבורד:", error);
    res.status(500).json({ message: "שגיאת שרת, נסה שוב מאוחר יותר" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getUserDashboard
};
