import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  notifications: boolean;
  outcomeLimit: number | '';
}

const getInitialState = (): SettingsState => {
  const savedSettings = localStorage.getItem('settings');
  if (savedSettings) {
    return JSON.parse(savedSettings);
  }
  return {
    notifications: true,
    outcomeLimit: 1000,
  };
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState: getInitialState(),
  reducers: {
    setNotifications: (state, action: PayloadAction<boolean>) => {
      state.notifications = action.payload;
      localStorage.setItem('settings', JSON.stringify(state));
    },
    setOutcomeLimit: (state, action: PayloadAction<number | ''>) => {
      state.outcomeLimit = action.payload;
      localStorage.setItem('settings', JSON.stringify(state));
    },
  },
});

export const { setNotifications, setOutcomeLimit } = settingsSlice.actions;
export default settingsSlice.reducer;