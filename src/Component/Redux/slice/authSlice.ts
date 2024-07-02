import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
}

interface Session {
  token: string;
  expiresAt: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
}

const initialState: AuthState = {
  user: null,
  session: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state: AuthState, action: PayloadAction<{ user: User; session: Session }>) => {
      state.user = action.payload.user;
      state.session = action.payload.session;
    },

    logout: (state: AuthState) => {
      state.user = null;
      state.session = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
