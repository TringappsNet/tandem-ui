import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../AxiosInterceptor/AxiosInterceptor';

interface ChangePasswordState {
  isLoading: boolean;
  responseMessage: string;
  responseType: string;
  isTokenValid: boolean | null;
}

const initialState: ChangePasswordState = {
  isLoading: false,
  responseMessage: '',
  responseType: '',
  isTokenValid: null,
};

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ newPassword }: { newPassword: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('auth/change-password', {
        newPassword,
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message ||
        'Failed to change password. Please try again.'
      );
    }
  }
);

export const validateResetToken = createAsyncThunk(
  'changePassword/validateResetToken',
  async ({ resetToken }: { resetToken: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/validateResetToken', { resetToken });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message);
    }
  }
);


const changePasswordSlice = createSlice({
  name: 'changePassword',
  initialState,
  reducers: {
    clearResponse(state) {
      state.responseMessage = '';
      state.responseType = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.responseMessage = '';
        state.responseType = '';
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.responseMessage = 'Password changed successfully!';
        state.responseType = 'success';
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.responseMessage = action.payload as string;
        state.responseType = 'error';
      });
  },
});

export const { clearResponse } = changePasswordSlice.actions;
export default changePasswordSlice.reducer;
