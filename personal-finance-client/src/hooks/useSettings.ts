import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../services/api';

interface UserSettings {
  enableOutcomeAlert: boolean;
  monthlyOutcomeLimit: number;
}

export const useSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading: isInitialLoading, error } = useQuery<UserSettings>({
    queryKey: ['settings'],
    queryFn: async () => {
    const { data } = await API.get<{ success: boolean; settings: UserSettings }>('/users/settings');      
    return data.settings;
    },
    placeholderData: (previousData) => previousData,
  });

  const mutation = useMutation({
    mutationFn: async (updates: Partial<UserSettings>) => {
      const { data } = await API.put('/users/settings', updates);
      return data;
    },
   
    onSuccess: (updatedSettings) => {
      console.log('updatedSettings', updatedSettings);
      queryClient.setQueryData(['settings'], updatedSettings);
    },
  });

  return {
    settings,
    isInitialLoading,
    isUpdating: mutation.isPending,
    error,
    updateSettings: mutation.mutateAsync,
    updateNotifications: (enabled: boolean) => mutation.mutateAsync({ enableOutcomeAlert: enabled }),
    updateOutcomeLimit: (limit: number | '') => 
      mutation.mutateAsync({ monthlyOutcomeLimit: limit === '' ? 0 : limit }),
  };
}; 