import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setNotifications, setOutcomeLimit } from '../store/settingsSlice';
import API from '../services/api';

export const useSettings = () => {
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.settings);

  const updateNotifications = async (enabled: boolean) => {
    try {
      await API.put('/users/settings', { notifications: enabled });
      dispatch(setNotifications(enabled));
    } catch (error) {
      console.error('Error updating notifications settings:', error);
      throw error;
    }
  };

  const updateOutcomeLimit = async (limit: number | '') => {
    try {
      await API.put('/users/settings', { outcomeLimit: limit });
      dispatch(setOutcomeLimit(limit));
    } catch (error) {
      console.error('Error updating outcome limit:', error);
      throw error;
    }
  };

  return {
    settings,
    updateNotifications,
    updateOutcomeLimit,
  };
}; 