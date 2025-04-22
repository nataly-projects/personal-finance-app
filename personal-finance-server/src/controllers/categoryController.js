const Category = require("../models/Category.js");
const User = require("../models/User");
const logger = require('../../logger.js');

async function addCategory (req, res) {
  try {
    if (!req.user || !req.user.id) {
      logger.warn("Add category failed: User not authenticated");
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    const { name } = req.body;
    if (!name || name.trim() === "") {
      logger.warn("Add category failed: Category name is required");
      return res.status(400).json({ message: "Category name is required" });
    }

    const existingCategory = await Category.findOne({ name, userId: req.user.id });
    if (existingCategory) {
      logger.warn(`Add category failed: Category '${name}' already exists for user ID: ${req.user.id}`);
      return res.status(409).json({ message: "This category already exists" });
    }

    const category = new Category({
      name,
      userId: req.user.id,
    });

    await category.save();

    const user = await User.findById(req.user.id);
    if (!user) {
      logger.error(`Add category failed: User not found for ID: ${req.user.id}`);
      return res.status(404).json({ message: "User not found" });
    }

    user.categories.push(category._id);
    await user.save();

    logger.info(`Category '${name}' added successfully for user ID: ${req.user.id}`);
    res.status(201).json(category);
  } catch (error) {
    logger.error(`Error adding category for user ID ${req.user.id}:`, error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

async function getCategories (req, res) {
  try {
    if (!req.user || !req.user.id) {
      logger.warn("Get categories failed: User not authenticated");
      return res.status(401).json({ message: "User not authenticated" });
    }

    const categories = await Category.find({ userId: req.user.id });
    if (!categories || categories.length === 0) {
      logger.info(`No categories found for user ID: ${req.user.id}`);
      return res.status(200).json([]);
    }
    
    logger.info(`Categories fetched successfully for user ID: ${req.user.id}`);
    res.status(200).json(categories);
  } catch (error) {
    logger.error(`Error fetching categories for user ID: ${req.user.id}:`, error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};


async function deleteCategory (req, res) {
  try {
    if (!req.user || !req.user.id) {
      logger.warn("Delete category failed: User not authenticated");
      return res.status(401).json({ message: "User not authenticated" });
    }

    const category = await Category.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!category) {
      logger.warn(`Delete category failed: Category not found for ID: ${req.params.id}`);
      return res.status(404).json({ message: "Category not found" });
    }
    
    await Category.findByIdAndDelete(req.params.id);
    
    const user = await User.findById(req.user.id);
    if (!user) {
      logger.error(`Delete category failed: User not found for ID: ${req.user.id}`);
      return res.status(404).json({ message: "User not found" });
    }

    user.categories = user.categories.filter(
      catId => catId.toString() !== req.params.id
    );
    await user.save();
  
    logger.info(`Category with ID: ${req.params.id} deleted successfully for user ID: ${req.user.id}`);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting category ID ${req.params.id} for user ID: ${req.user.id}:`, error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

module.exports = {
  addCategory,
  getCategories,
  deleteCategory  
}