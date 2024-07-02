// Import necessary types
import { createSlice, PayloadAction, Action } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import axiosInstance from '../../AxiosInterceptor/AxiosInterceptor';
import { RootState } from '../reducers';
import { ThunkAction } from 'redux-thunk';
import { Deal } from '../../Interface/DealFormObject';

// Define AppThunk type for Thunks
type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

// Define initial state interface
interface DealState {
  activeStep: number;
  dealDetails: Deal;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: DealState = {
  activeStep:0,
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
  loading: false,
  error: null,
};

// Create a slice for dealing with 'deal' state
const dealSlice = createSlice({
  name: 'deal',
  initialState,
  reducers: {
    fetchDealDetailsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDealDetailsSuccess: (state, action: PayloadAction<Deal>) => {
      state.dealDetails = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchDealDetailsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setDealDetails: (state, action: PayloadAction<Deal>) => {
      state.dealDetails = action.payload;
    },
    updateDealField: (state, action: PayloadAction<{ field: keyof Deal; value: any }>) => {
      state.dealDetails[action.payload.field] = action.payload.value;
    },
    setActiveStep: (state, action: PayloadAction<number>) => {
      state.activeStep = action.payload;
    },
  },
});

// Export actions from slice
export const {
  fetchDealDetailsStart,
  fetchDealDetailsSuccess,
  fetchDealDetailsFailure,
  setDealDetails,
  updateDealField,
  setActiveStep,
} = dealSlice.actions;

// Reducer function
export default dealSlice.reducer;

// Thunk for fetching deal details from API
export const fetchDealDetails = (dealId: number): AppThunk<void> => async (dispatch: Dispatch) => {
  try {
    dispatch(fetchDealDetailsStart());
    const response = await axiosInstance.get(`/deals/${dealId}`);
    dispatch(fetchDealDetailsSuccess(response.data));
  } catch (error) {
    console.error('Error fetching deal details:', error);
    dispatch(fetchDealDetailsFailure((error as Error).message));
  }
};

// Thunk for updating deal details via API
export const updateDealDetails = (dealData: Deal): AppThunk<void> => async (dispatch: Dispatch) => {
  try {
    dispatch(fetchDealDetailsStart());
    const response = await axiosInstance.put(`/deals/${dealData.id}`, dealData);
    dispatch(setDealDetails(response.data)); // Use setDealDetails to update state after update
  } catch (error) {
    console.error('Error updating deal details:', error);
    dispatch(fetchDealDetailsFailure((error as Error).message));
  }
};

// Thunk for creating a new deal via API
export const createNewDeal = (dealData: Deal): AppThunk<void> => async (dispatch: Dispatch) => {
  try {
    dispatch(fetchDealDetailsStart());
    const response = await axiosInstance.post('/deals', dealData);
    dispatch(setDealDetails(response.data)); // Use setDealDetails to update state after creation
  } catch (error) {
    console.error('Error creating new deal:', error);
    dispatch(fetchDealDetailsFailure((error as Error).message));
  }
};
