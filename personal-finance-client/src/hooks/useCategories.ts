import { useState, useEffect } from 'react';
import API from '../services/api';
import { Category } from '../utils/types';
import { categories as defaultCategories } from '../utils/utils';

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await API.get<Category[]>('/categories');
        const apiCategories = response.data.map((category) => category.name);
        const combinedCategories = Array.from(new Set([...defaultCategories, ...apiCategories]));
        setCategories(combinedCategories);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const addCategory = (newCategory: string) => {
    if (!categories.includes(newCategory)) {
      setCategories((prev) => [...prev, newCategory]);
    }
  };

  return {
    categories,
    loading,
    error,
    addCategory,
  };
};