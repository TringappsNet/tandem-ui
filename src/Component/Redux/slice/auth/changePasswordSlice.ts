import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../AxiosInterceptor/AxiosInterceptor';
import { RootState } from '../../reducers';
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';

interface ChangePasswordState {
  isLoading: boolean;
  responseMessage: string;
  responseType: string;
}

const initialState: ChangePasswordState = {
  isLoading: false,
  responseMessage: '',
  responseType: '',
};

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ newPassword }: { newPassword: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('auth/change-password', { newPassword });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || 'Failed to change password. Please try again.');
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