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

interface ResetPasswordPayload {
  oldPassword: string;
  newPassword: string;
  userId: string;
}

interface RejectValue {
  message: string;
  status: string;
}

export const resetPassword = createAsyncThunk<
  { message: string },
  ResetPasswordPayload,
  { rejectValue: RejectValue }
>(
  'reset/resetPassword',
  async ({ oldPassword, newPassword, userId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/reset-password', {
        oldPassword,
        newPassword,
        userId,
      });
      return response.data;
    } catch (error: any) {
      if(error.response.status === 404) {
        return rejectWithValue({ message: 'Old password you provided is Incorrect.', status: 'failed'});
      }
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue({ message: error.response.data.message, status: 'failed'});
      }
      return rejectWithValue({ message: 'Password reset failed.', status: 'failed' });
    }
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
      state.responseMessage = '';
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
        state.responseMessage = action.payload.message;
        state.responseType = 'success';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.responseMessage =
          action.payload?.message || 'Password reset failed.';
        state.responseType = 'error';
      });
  },
});

export const { clearResponse, resetState, openReset, closeReset } =
  resetSlice.actions;

export default resetSlice.reducer;
