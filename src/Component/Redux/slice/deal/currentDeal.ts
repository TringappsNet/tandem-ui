import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Deal } from '../../../Interface/DealFormObject';

interface CurrentDealState {
  currentDeal: Deal | null;
}

const initialState: CurrentDealState = {
  currentDeal: null,
};

const currentDealSlice = createSlice({
  name: 'currentDeal',
  initialState,
  reducers: {
    setCurrentDeal(state, action: PayloadAction<Deal>) {
      state.currentDeal = action.payload;
    },
    clearCurrentDeal(state) {
      state.currentDeal = null;
    },
  },
});

export const { setCurrentDeal, clearCurrentDeal } = currentDealSlice.actions;

export default currentDealSlice.reducer;
