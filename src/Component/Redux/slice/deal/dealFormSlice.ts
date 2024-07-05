import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DealFormState {
  open: boolean;
}

const initialState: DealFormState = {
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

export const { openDealForm, closeDealForm } = dealFormSlice.actions;

export default dealFormSlice.reducer;