import { useQuery } from '@tanstack/react-query';
import API from '../services/api';

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await API.get('/users/dashboard');
      return response.data.data;
    }
  });
};