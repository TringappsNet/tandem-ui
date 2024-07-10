import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  open: false,
};

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
    },
  });
  export const sendInviteReducer = sendInviteSlice.reducer;
  export const { openSendInvite, closeSendInvite } = sendInviteSlice.actions;
  
  