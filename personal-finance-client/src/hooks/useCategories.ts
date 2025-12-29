// import { useState, useEffect } from 'react';
// import API from '../services/api';
// import { Category } from '../utils/types';
// import { categories as defaultCategories } from '../utils/utils';

// interface CategoryResponse {
//   categories: Category[];
//   success: boolean;
// }

// export const useCategories = () => {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         setLoading(true);
//         const response = await API.get<CategoryResponse>('/categories');
//         const defaultCategoryObjects = defaultCategories.map(name => ({
//           _id: name,
//           userId: '', 
//           name,
//           type: 'expense' as const,
//           createdAt: new Date(),
//           updatedAt: new Date()
//         }));
        
//         const serverCategories = response.data.categories || [];
//         const combinedCategories = [...defaultCategoryObjects, ...serverCategories];
//         setCategories(combinedCategories);
//         setError(null);
//       } catch (err) {
//         console.error('Error fetching categories:', err);
//         setError('Failed to load categories. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategories();
//   }, []);

//   const isDuplicateName = (name: string, excludeId?: string): boolean => {
//     return categories.some(cat => 
//       cat.name.toLowerCase() === name.toLowerCase() && 
//       (!excludeId || cat._id !== excludeId)
//     );
//   };

//   const addCategory = async (newCategory: Omit<Category, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
//     try {
//       if (isDuplicateName(newCategory.name)) {
//         throw new Error('A category with this name already exists');
//       }
//       const response = await API.post<Category>('/categories', newCategory);
//       setCategories(prev => [...prev, response.data]);
//     } catch (err) {
//       console.error('Error adding category:', err);
//       throw err;
//     }
//   };

//   const updateCategory = async (categoryId: string, updatedData: Partial<Category>) => {
//     try {
//       if (updatedData.name && isDuplicateName(updatedData.name, categoryId)) {
//         throw new Error('A category with this name already exists');
//       }
//       const response = await API.put<Category>(`/categories/${categoryId}`, updatedData);
//       setCategories(prev => prev.map(cat => 
//         cat._id === categoryId ? response.data : cat
//       ));
//     } catch (err) {
//       console.error('Error updating category:', err);
//       throw err;
//     }
//   };

//   const deleteCategory = async (categoryId: string) => {
//     try {
//       await API.delete(`/categories/${categoryId}`);
//       setCategories(prev => prev.filter(cat => cat._id !== categoryId));
//     } catch (err) {
//       console.error('Error deleting category:', err);
//       throw new Error('Failed to delete category');
//     }
//   };

//   return {
//     categories,
//     loading,
//     error,
//     addCategory,
//     updateCategory,
//     deleteCategory
//   };
// };

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../services/api';
import { Category } from '../utils/types';
import { categories as defaultCategories } from '../utils/utils';

interface CategoryResponse {
  categories: Category[];
  success: boolean;
}

export const useCategories = () => {
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await API.get<CategoryResponse>('/categories');
      const serverCategories = response.data.categories || [];

      const defaultCategoryObjects: Category[] = defaultCategories.map(name => ({
        _id: `default-${name}`,   
        userId: 'system',
        name,
        type: 'expense',
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      return [...defaultCategoryObjects, ...serverCategories];
    },
  });

  const isDuplicateName = (name: string, excludeId?: string): boolean => {
    return categories.some(cat => 
      cat.name.toLowerCase() === name.toLowerCase() && 
      (!excludeId || cat._id !== excludeId)
    );
  };

  const addMutation = useMutation({
    mutationFn: async (newCategory: Omit<Category, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      if (isDuplicateName(newCategory.name)) {
        throw new Error('A category with this name already exists');
      }
      const response = await API.post<Category>('/categories', newCategory);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updatedData }: { id: string, updatedData: Partial<Category> }) => {
      if (updatedData.name && isDuplicateName(updatedData.name, id)) {
        throw new Error('A category with this name already exists');
      }
      const response = await API.put<Category>(`/categories/${id}`, updatedData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => API.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  return {
    categories,
    loading: isLoading,
    error,
    addCategory: addMutation.mutateAsync,
    addError: addMutation.error,
    isAdding: addMutation.isPending,

    updateCategory: updateMutation.mutateAsync,
    updateError: updateMutation.error,
    isUpdating: updateMutation.isPending,

    deleteCategory: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending
  };
};