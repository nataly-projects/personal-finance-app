import { Response } from 'express';
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
import { asyncHandler } from '../middleware/errorMiddleware';
import { ApiError } from '../utils/utils';

export const addCategory = asyncHandler(async (req: AuthenticatedRequest, res: Response<AddCategoryResponse>) => {
  const userId = req.user.id;
  const { name } = req.body as AddCategoryRequest;
    
  if (!name) {
    logger.warn("Add category failed: Missing name");``
    throw new ApiError(400, "Category name is required");
  }
    
  const existingCategory = await Category.findOne({ name, userId });
  if (existingCategory) {
    logger.warn(`Add category failed: Category "${name}" already exists for user ID: ${userId}`);
    throw new ApiError(400, "Category already exists");
  }
    
  const category = new Category({ name, userId });
  await category.save();
    
  logger.info(`Category added successfully for user ID: ${userId}`);
  res.status(201).json({
    success: true,
    category: category.toObject() as any
  });

});

export const getCategories = asyncHandler (async (req: AuthenticatedRequest, res: Response<GetCategoriesResponse>) => {
  const userId = req.user.id;
  const categories = await Category.find({ userId }).sort({ name: 1 });
    
  if (!categories || categories.length === 0) {
    logger.info(`No categories found for user ID: ${userId}`);
    return res.status(200).json({ success: true, categories: [] });
  }

  logger.info(`Categories fetched successfully for user ID: ${userId}`);
  res.status(200).json({
    success: true,
    categories: categories.map(c => c.toObject()) as any
  });

});

export const updateCategory = asyncHandler (async (req: AuthenticatedRequest, res: Response<UpdateCategoryResponse>) => {
  const userId = req.user.id;
  const { id } = req.params;
    const { name } = req.body as UpdateCategoryRequest;
    
  if (!name) {
    logger.warn("Update category failed: Missing name");
    throw new ApiError(400, "Category name is required");
  }

  const existingCategory = await Category.findOne({ name, userId, _id: { $ne: id } });
  if (existingCategory) {
    logger.warn(`Update category failed: Category "${name}" already exists for user ID: ${userId}`);
    throw new ApiError(400, "Category already exists");
  }
    
  const category = await Category.findOneAndUpdate(
    { _id: id, userId },
    { name, updatedAt: new Date() },
    { new: true }
  );
    
  if (!category) {
    logger.warn(`Update category failed: Category not found for ID: ${id}`);
    throw new ApiError(404, "Category not found");
  }

  logger.info(`Category updated successfully for ID: ${id}`);
  res.status(200).json({
    success: true,
    category: category.toObject() as any
  });

});

export const deleteCategory = asyncHandler (async (req: AuthenticatedRequest, res: Response<DeleteCategoryResponse>) => {
  const userId = req.user.id;
  const { id } = req.params;
  const category = await Category.findOne({ _id: id, userId });
    
  if (!category) {
    logger.warn(`Delete category failed: Category not found for ID: ${id}`);
    throw new ApiError(404, "Category not found");
  }
  
  await Category.findByIdAndDelete(id);
  logger.info(`Category deleted successfully for ID: ${id}`);
  res.status(200).json({ success: true });

}); 