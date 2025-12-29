import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import tasksReducer from './tasksSlice';
import themeReducer from './themeSlice';
import settingsReducer from './settingsSlice';
import transactionsReducer from './transactionsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    settings: settingsReducer,
    transactions: transactionsReducer,
    tasks: tasksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // זה ישתיק את השגיאה שראית בקונסול
  }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;