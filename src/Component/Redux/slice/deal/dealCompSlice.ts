import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  open: false,
};


const dealFormSlice = createSlice({
  name: 'dealForm',
  initialState,
  reducers: {
    openDealForm(state) {
      state.open = true;
    },
    closeDealForm(state) {
      state.open = false;
    },
  },
});


export const dealFormReducer = dealFormSlice.reducer;
export const { openDealForm, closeDealForm } = dealFormSlice.actions;



