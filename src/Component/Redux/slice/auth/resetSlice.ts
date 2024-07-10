import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../AxiosInterceptor/AxiosInterceptor';

interface ResetState {
  responseMessage: string;
  responseType: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  open: boolean;
}

const initialState: ResetState = {
  responseMessage: '',
  responseType: '',
  status: 'idle',
  open: false,
};

export const resetPassword = createAsyncThunk(
  'reset/resetPassword',
  async ({ oldPassword, newPassword, userId }: { oldPassword: string; newPassword: string; userId: string }) => {
    const response = await axiosInstance.post('/auth/reset-password', {
      oldPassword,
      newPassword,
      userId,
    });
    return response.data;
  }
);

const resetSlice = createSlice({
  name: 'reset',
  initialState,
  reducers: {
    clearResponse: (state) => {
      state.responseMessage = '';
      state.responseType = '';
    },
    resetState: () => initialState,
    openReset: (state) => {
      state.open = true;
    },
    closeReset: (state) => {
      state.open = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetPassword.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.responseMessage = 'Password reset successful.';
        state.responseType = 'success';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.responseMessage = action.error.message || 'Password reset failed.';
        state.responseType = 'error';
      });
  },
});

export const { clearResponse, resetState, openReset, closeReset } = resetSlice.actions;

export default resetSlice.reducer;