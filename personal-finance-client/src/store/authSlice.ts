import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../utils/types';
import { safeJSONParse } from '../utils/utils';
interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: safeJSONParse<User>(localStorage.getItem('user')),
  token: localStorage.getItem('token') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer; 