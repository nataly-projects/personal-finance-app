const Transaction = require("../models/Transaction");

async function addTransaction (req, res) {
  try {
    // בדיקת תקינות הנתונים
    const { amount, category, type, description } = req.body;
    
    if (!amount || !category || !type || !description) {
      return res.status(400).json({ message: "כל השדות נדרשים" });
    }
    
    if (type !== "income" && type !== "expense") {
      return res.status(400).json({ message: "סוג העסקה חייב להיות 'income' או 'expense'" });
    }
    
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "הסכום חייב להיות מספר חיובי" });
    }
    
    // יצירת עסקה חדשה
    const transaction = new Transaction({ 
      ...req.body, 
      userId: req.user.id 
    });
    
    // שמירת העסקה
    await transaction.save();
    
    res.status(201).json(transaction);
  } catch (error) {
    console.error("שגיאה בהוספת עסקה:", error);
    res.status(500).json({ message: "שגיאת שרת, נסה שוב מאוחר יותר" });
  }
};

async function getTransactions (req, res) {
  try {
    // קבלת העסקאות של המשתמש
    const transactions = await Transaction.find({ userId: req.user.id })
      .sort({ date: -1 }); // מיון לפי תאריך יורד
    
    res.status(200).json(transactions);
  } catch (error) {
    console.error("שגיאה בקבלת עסקאות:", error);
    res.status(500).json({ message: "שגיאת שרת, נסה שוב מאוחר יותר" });
  }
};

async function updateTransaction (req, res) {
  try {
    // בדיקה אם העסקה קיימת ושייכת למשתמש
    const existingTransaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!existingTransaction) {
      return res.status(404).json({ message: "עסקה לא נמצאה" });
    }
    
    // עדכון העסקה
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.status(200).json(transaction);
  } catch (error) {
    console.error("שגיאה בעדכון עסקה:", error);
    res.status(500).json({ message: "שגיאת שרת, נסה שוב מאוחר יותר" });
  }
};

async function deleteTransaction (req, res) {
  try {
    // בדיקה אם העסקה קיימת ושייכת למשתמש
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!transaction) {
      return res.status(404).json({ message: "עסקה לא נמצאה" });
    }
    
    // מחיקת העסקה
    await Transaction.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: "העסקה נמחקה בהצלחה" });
  } catch (error) {
    console.error("שגיאה במחיקת עסקה:", error);
    res.status(500).json({ message: "שגיאת שרת, נסה שוב מאוחר יותר" });
  }
};

module.exports = {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction
}