import { Request, Response } from 'express';
import { Category } from '../models/Category';
import { logger } from '../utils/logger';
import {
  AddCategoryRequest,
  AddCategoryResponse,
  GetCategoriesResponse,
  UpdateCategoryRequest,
  UpdateCategoryResponse,
  DeleteCategoryResponse
} from '@shared/types/category';
import { AuthenticatedRequest } from '../utils/types';

export const addCategory = async (req: AuthenticatedRequest, res: Response<AddCategoryResponse>) => {
  const userId = req.user.id;
  try {
    const { name } = req.body as AddCategoryRequest;
    
    if (!name) {
      logger.warn("Add category failed: Missing name");
      return res.status(400).json({ success: false, error: "Category name is required" });
    }
    
    const existingCategory = await Category.findOne({ name, userId });
    if (existingCategory) {
      logger.warn(`Add category failed: Category "${name}" already exists for user ID: ${userId}`);
      return res.status(400).json({ success: false, error: "Category with this name already exists" });
    }
    
    const category = new Category({ name, userId });
    await category.save();
    
    logger.info(`Category added successfully for user ID: ${userId}`);
    res.status(201).json({
      success: true,
      category: {
        id: category.id.toString(),
        name: category.name,
        userId: category.userId.toString(),
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
      }
    });
  } catch (error) {
    logger.error(`Error adding category for user ID: ${userId}:`, error);
    res.status(500).json({ success: false, error: "Server error, please try again later" });
  }
};

export const getCategories = async (req: AuthenticatedRequest, res: Response<GetCategoriesResponse>) => {
  const userId = req.user.id;
  try {
    const categories = await Category.find({ userId }).sort({ name: 1 });
    
    if (!categories || categories.length === 0) {
      logger.info(`No categories found for user ID: ${userId}`);
      return res.status(200).json({ success: true, categories: [] });
    }

    logger.info(`Categories fetched successfully for user ID: ${userId}`);
    res.status(200).json({
      success: true,
      categories: categories.map(c => ({
        id: c.id.toString(),
        name: c.name,
        userId: c.userId.toString(),
        createdAt: c.createdAt,
        updatedAt: c.updatedAt
      }))
    });
  } catch (error) {
    logger.error(`Error fetching categories for user ID: ${userId}:`, error);
    res.status(500).json({ success: false, error: "Server error, please try again later" });
  }
};

export const updateCategory = async (req: AuthenticatedRequest, res: Response<UpdateCategoryResponse>) => {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    const { name } = req.body as UpdateCategoryRequest;
    
    if (!name) {
      logger.warn("Update category failed: Missing name");
      return res.status(400).json({ success: false, error: "Category name is required" });
    }

    const existingCategory = await Category.findOne({ name, userId, _id: { $ne: id } });
    if (existingCategory) {
      logger.warn(`Update category failed: Category "${name}" already exists for user ID: ${userId}`);
      return res.status(400).json({ success: false, error: "Category with this name already exists" });
    }
    
    const category = await Category.findOneAndUpdate(
      { _id: id, userId },
      { name, updatedAt: new Date() },
      { new: true }
    );
    
    if (!category) {
      logger.warn(`Update category failed: Category not found for ID: ${id}`);
      return res.status(404).json({ success: false, error: "Category not found" });
    }

    logger.info(`Category updated successfully for ID: ${id}`);
    res.status(200).json({
      success: true,
      category: {
        id: category.id.toString(),
        name: category.name,
        userId: category.userId.toString(),
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
      }
    });
  } catch (error) {
    logger.error(`Error updating category for ID: ${id}:`, error);
    res.status(500).json({ success: false, error: "Server error, please try again later" });
  }
};

export const deleteCategory = async (req: AuthenticatedRequest, res: Response<DeleteCategoryResponse>) => {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    const category = await Category.findOne({ _id: id, userId });
    
    if (!category) {
      logger.warn(`Delete category failed: Category not found for ID: ${id}`);
      return res.status(404).json({ success: false, error: "Category not found" });
    }
    
    await Category.findByIdAndDelete(id);
    logger.info(`Category deleted successfully for ID: ${id}`);
    res.status(200).json({ success: true });
  } catch (error) {
    logger.error(`Error deleting category for ID: ${id}:`, error);
    res.status(500).json({ success: false, error: "Server error, please try again later" });
  }
}; 