// authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  userId: string | null;
  email: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('sessionToken') || null,
  userId: localStorage.getItem('userId') || null,
  email: localStorage.getItem('email') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state: AuthState, action: PayloadAction<{ token: string; userId: string; email: string }>) => {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.email = action.payload.email;

      // Store credentials in localStorage
      localStorage.setItem('sessionToken', action.payload.token);
      localStorage.setItem('userId', action.payload.userId);
      localStorage.setItem('email', action.payload.email);
    },
    logout: (state: AuthState) => {
      state.token = null;
      state.userId = null;
      state.email = null;

      // Clear localStorage on logout
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('email');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
