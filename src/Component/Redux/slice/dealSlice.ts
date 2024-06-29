// dealSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Deal } from '../../Interface/DealFormObject';

interface DealState {
  dealDetails: Deal;
}

const initialState: DealState = {
  dealDetails: {
    id: null,
    brokerName: '',
    propertyName: '',
    dealStartDate: '',
    proposalDate: '',
    loiExecuteDate: '',
    leaseSignedDate: '',
    noticeToProceedDate: '',
    commercialOperationDate: '',
    potentialcommissiondate: '',
    potentialCommission: null,
    status: '',
    activeStep: 0,
  },
};

const dealSlice = createSlice({
  name: 'deal',
  initialState,
  reducers: {
    setDealDetails: (state: DealState, action: PayloadAction<Deal>) => {
      state.dealDetails = action.payload;
    },
    updateDealField: (state: DealState, action: PayloadAction<{ field: keyof Deal; value: any }>) => {
      state.dealDetails[action.payload.field] = action.payload.value;
    },
    setActiveStep: (state: DealState, action: PayloadAction<number>) => {
      state.dealDetails.activeStep = action.payload;
    },
  },
});

export const { setDealDetails, updateDealField, setActiveStep } = dealSlice.actions;
export default dealSlice.reducer;
