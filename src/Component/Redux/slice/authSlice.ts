import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  roleId: number;
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
  isAdmin: boolean;
}

const loadStateFromLocalStorage = (): AuthState => {
  try {
    const user = localStorage.getItem('user');
    const session = localStorage.getItem('session');
    // const roleId = localStorage.getItem('roleID');

    if (user && session) {
      const parsedUser = JSON.parse(user) as User;
      const isAdmin = parsedUser.roleId === 1;

      return {
        user: parsedUser,
        session: JSON.parse(session),
        isAdmin,
      };
    }
  } catch (e) {
    console.error('Failed to load state from local storage:', e);
  }
  return {
    user: null,
    session: null,
    isAdmin: false,
  };
};

const initialState: AuthState = loadStateFromLocalStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state: AuthState, action: PayloadAction<{ user: User; session: Session }>) => {
      state.user = action.payload.user;
      state.session = action.payload.session;
      state.isAdmin = action.payload.user.roleId === 1;

      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('session', JSON.stringify(action.payload.session));
    },
    logout: (state: AuthState) => {
      state.user = null;
      state.session = null;
      state.isAdmin = false;

      localStorage.removeItem('user');
      localStorage.removeItem('session');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

