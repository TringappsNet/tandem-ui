import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../AxiosInterceptor/AxiosInterceptor';

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
  loading: boolean;
  error: string | null;
}

const loadStateFromLocalStorage = (): AuthState => {
  try {
    const user = localStorage.getItem('user');
    const session = localStorage.getItem('session');
    if (user && session) {
      return {
        user: JSON.parse(user),
        session: JSON.parse(session),
        loading: false,
        error: null,
      };
    }
  } catch (e) {
    console.error('Failed to load state from local storage:', e);
  }
  return {
    user: null,
    session: null,
    loading: false,
    error: null,
  };
};

const initialState: AuthState = loadStateFromLocalStorage();

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const data = response.data;
      if (data.message === 'Login successful' && response.status === 200) {
        const { session, user } = data;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('session', JSON.stringify(session));
        return { user, session };
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Something went wrong. Please try again later.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state: AuthState, action: PayloadAction<{ user: User; session: Session }>) => {
      state.user = action.payload.user;
      state.session = action.payload.session;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('session', JSON.stringify(action.payload.session));
    },
    logout: (state: AuthState) => {
      state.user = null;
      state.session = null;
      localStorage.removeItem('user');
      localStorage.removeItem('session');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ user: User; session: Session }>) => {
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.loading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;