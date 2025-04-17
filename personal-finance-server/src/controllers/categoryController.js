const Category = require("../models/Category.js");
const User = require("../models/User");

async function addCategory (req, res) {
  try {
    const { name } = req.body;
    
    // בדיקת תקינות הנתונים
    if (!name) {
      return res.status(400).json({ message: "שם הקטגוריה נדרש" });
    }

    // בדיקה אם הקטגוריה כבר קיימת עבור משתמש זה
    const existingCategory = await Category.findOne({ name, userId: req.user.id });
    if (existingCategory) {
      return res.status(409).json({ message: "קטגוריה זו כבר קיימת" });
    }

    // Create a new category
    const category = new Category({
      name,
      userId: req.user.id,
    });

    // שמירת הקטגוריה
    await category.save();

    // הוספת הקטגוריה למערך הקטגוריות של המשתמש
    const user = await User.findById(req.user.id);
    user.categories.push(category._id);
    await user.save();

    res.status(201).json(category);
  } catch (error) {
    console.error("שגיאה בהוספת קטגוריה:", error);
    res.status(500).json({ message: "שגיאת שרת, נסה שוב מאוחר יותר" });
  }
};

async function getCategories (req, res) {
  try {
    const categories = await Category.find({ userId: req.user.id });
    res.status(200).json(categories);
  } catch (error) {
    console.error("שגיאה בקבלת קטגוריות:", error);
    res.status(500).json({ message: "שגיאת שרת, נסה שוב מאוחר יותר" });
  }
};


async function deleteCategory (req, res) {
  try {
    // בדיקה אם הקטגוריה קיימת ושייכת למשתמש
    const category = await Category.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    // מחיקת הקטגוריה
    await Category.findByIdAndDelete(req.params.id);
    
    // הסרת הקטגוריה ממערך הקטגוריות של המשתמש
    const user = await User.findById(req.user.id);
    user.categories = user.categories.filter(
      catId => catId.toString() !== req.params.id
    );
    await user.save();
    
    res.status(200).json({ message: "הקטגוריה נמחקה בהצלחה" });
  } catch (error) {
    console.error("שגיאה במחיקת קטגוריה:", error);
    res.status(500).json({ message: "שגיאת שרת, נסה שוב מאוחר יותר" });
  }
};

module.exports = {
  addCategory,
  getCategories,
  deleteCategory  
}