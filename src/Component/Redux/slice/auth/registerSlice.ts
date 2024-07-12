import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../AxiosInterceptor/AxiosInterceptor';

interface RegisterState {
  token: string | null;
  userId: string | null;
  email: string | null;
  registering: boolean;
  error: string | null;
  resettingPassword: boolean;
  resetPasswordSuccess: boolean;
  resetPasswordError: string | null;
}

const initialState: RegisterState = {
  token: null,
  userId: null,
  email: null,
  registering: false,
  error: null,
  resettingPassword: false,
  resetPasswordSuccess: false,
  resetPasswordError: null,
};

// Thunk for registration
export const registerUser = createAsyncThunk(
  'register/registerUser',
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Registration failed. Please try again.');
    }
  }
);

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setCredentials: (
      state: RegisterState,
      action: PayloadAction<{ token: string; userId: string; email: string }>
    ) => {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.registering = false;
      state.error = null;
    },
    setRegistering: (state: RegisterState, action: PayloadAction<boolean>) => {
      state.registering = action.payload;
    },
    setError: (state: RegisterState, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.registering = false;
    },
    clearError: (state: RegisterState) => {
      state.error = null;
    },
    setResettingPassword: (
      state: RegisterState,
      action: PayloadAction<boolean>
    ) => {
      state.resettingPassword = action.payload;
      state.resetPasswordSuccess = false; // Reset success flag when starting reset
      state.resetPasswordError = null; // Reset error message when starting reset
    },
    setResetPasswordSuccess: (
      state: RegisterState,
      action: PayloadAction<boolean>
    ) => {
      state.resetPasswordSuccess = action.payload;
      state.resettingPassword = false; // Resetting password is complete
    },
    setResetPasswordError: (
      state: RegisterState,
      action: PayloadAction<string>
    ) => {
      state.resetPasswordError = action.payload;
      state.resettingPassword = false; // Resetting password encountered an error
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.registering = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registering = false;
        state.token = action.payload.token;
        state.userId = action.payload.userId;
        state.email = action.payload.email;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registering = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCredentials,
  setRegistering,
  setError,
  clearError,
  setResettingPassword,
  setResetPasswordSuccess,
  setResetPasswordError,
} = registerSlice.actions;

export default registerSlice.reducer;
