export interface Category {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface AddCategoryRequest {
  name: string;
}

export interface AddCategoryResponse {
  success: boolean;
  category?: Category;
  error?: string;
}

export interface GetCategoriesResponse {
  success: boolean;
  categories?: Category[];
  error?: string;
}

export interface UpdateCategoryRequest {
  name: string;
}

export interface UpdateCategoryResponse {
  success: boolean;
  category?: Category;
  error?: string;
}

export interface DeleteCategoryResponse {
  success: boolean;
  error?: string;
} 