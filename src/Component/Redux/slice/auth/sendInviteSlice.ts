import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../AxiosInterceptor/AxiosInterceptor';

const initialState = {
  open: false,
  isLoading: false,
  responseMessage: '',
  responseType: '',
};

export const sendInvite = createAsyncThunk(
  'sendInvite/sendInvite',
  async ({ email, roleId }: { email: string; roleId: number }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/invite', { email, roleId });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || 'An error occurred. Please try again.');
    }
  }
);

// Create the slice
const sendInviteSlice = createSlice({
  name: 'sendInvite',
  initialState,
  reducers: {
    openSendInvite(state) {
      state.open = true;
    },
    closeSendInvite(state) {
      state.open = false;
    },
    resetResponse(state) {
      state.responseMessage = '';
      state.responseType = '';
    },
    clearResponse(state) {
      state.responseMessage = '';
      state.responseType = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendInvite.pending, (state) => {
        state.isLoading = true;
        state.responseMessage = '';
        state.responseType = '';
      })
      .addCase(sendInvite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.responseMessage = action.payload.message;
        state.responseType = 'success';
      })
      .addCase(sendInvite.rejected, (state, action) => {
        state.isLoading = false;
        state.responseMessage = action.payload as string;
        state.responseType = 'error';
      });
  },
});

export const { openSendInvite, closeSendInvite, resetResponse, clearResponse } = sendInviteSlice.actions;
export const sendInviteReducer = sendInviteSlice.reducer;