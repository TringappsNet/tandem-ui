import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  open: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    openProfile(state) {
      state.open = true;
    },
    closeProfile(state) {
      state.open = false;
    },
  },
});
export const profileReducer = profileSlice.reducer;
export const { openProfile, closeProfile } = profileSlice.actions;
