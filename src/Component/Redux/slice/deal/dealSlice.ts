import { createSlice, PayloadAction, Action } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import axiosInstance from '../../../AxiosInterceptor/AxiosInterceptor';
import { RootState } from '../../reducers';
import { ThunkAction } from 'redux-thunk';
import { Deal } from '../../../Interface/DealFormObject';
import { clearCurrentDeal, setCurrentDeal } from './currentDeal';

type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

interface DealState {
  activeStep: number;
  dealDetails: Deal[];
  loading: boolean;
  error: string | null;
}

const initialState: DealState = {
  activeStep: 0,
  dealDetails: [], 
  loading: false,
  error: null,
};

const dealSlice = createSlice({
  name: 'deal',
  initialState,
  reducers: {
    fetchDealDetailsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDealDetailsSuccess: (state, action: PayloadAction<Deal[]>) => {
      state.dealDetails = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchDealDetailsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setDealDetails: (state, action: PayloadAction<Deal>) => {
      if (!Array.isArray(state.dealDetails)) {
        state.dealDetails = [];
      }
      const index = state.dealDetails.findIndex(deal => deal.id === action.payload.id);
      if (index !== -1) {
        state.dealDetails[index] = action.payload;
      } else {
        state.dealDetails.push(action.payload);
      }
    },
    updateDealField: (state, action: PayloadAction<{ id: number | null; field: keyof Deal; value: string | number | boolean | null }>) => {
      const deal = state.dealDetails.find(deal => deal.id === action.payload.id);
      if (deal) {
        (deal[action.payload.field] as string | number | boolean | null) = action.payload.value;
      }
    },
    setActiveStep: (state, action: PayloadAction<number>) => {
      state.activeStep = action.payload;
    },
    deleteDealSuccess: (state, action: PayloadAction<number>) => {
      if (!Array.isArray(state.dealDetails)) {
        state.dealDetails = [];
      }
      state.dealDetails = state.dealDetails.filter(deal => deal.id !== action.payload);
      state.loading = false;
      state.error = null;
    },    
  },
});

export const {
  fetchDealDetailsStart,
  fetchDealDetailsSuccess,
  fetchDealDetailsFailure,
  setDealDetails,
  updateDealField,
  setActiveStep,
  deleteDealSuccess,
} = dealSlice.actions;

export default dealSlice.reducer;

export const fetchDealDetails = (): AppThunk<void> => async (dispatch: Dispatch) => {
  try {
    dispatch(fetchDealDetailsStart());
    const response = await axiosInstance.get(`/deals`);
    dispatch(fetchDealDetailsSuccess(response.data));
  } catch (error) {
    console.error('Error fetching deal details:', error);
    dispatch(fetchDealDetailsFailure((error as Error).message));
  }
};

export const fetchDealDetailsById = (dealId: number): AppThunk<void> => async (dispatch: Dispatch) => {
  try {
    dispatch(fetchDealDetailsStart());
    const response = await axiosInstance.get(`/deals/deal/${dealId}`);
    dispatch(fetchDealDetailsSuccess([response.data]));
  } catch (error) {
    console.error('Error fetching deal details:', error);
    dispatch(fetchDealDetailsFailure((error as Error).message));
  }
};

export const deleteDeal = (dealId: number): AppThunk<void> => async (dispatch: Dispatch) => {
  try {
    dispatch(fetchDealDetailsStart());
    await axiosInstance.delete(`/deals/deal/${dealId}`);
    dispatch(deleteDealSuccess(dealId));
  } catch (error) {
    console.error('Error deleting deal:', error);
    dispatch(fetchDealDetailsFailure((error as Error).message));
  }
};

export const createNewDeal = (dealData: Deal): AppThunk<void> => async (dispatch) => {
  try {
    dispatch(setCurrentDeal(dealData));
    const response = await axiosInstance.post('/deals/deal', dealData);
    dispatch(setDealDetails(response.data));
    dispatch(clearCurrentDeal());
  } catch (error) {
    console.error('Error creating new deal:', error);
    dispatch(fetchDealDetailsFailure((error as Error).message));
  }
};

export const updateDealDetails = (dealData: Deal): AppThunk<void> => async (dispatch) => {
  try {
    dispatch(setCurrentDeal(dealData));
    const response = await axiosInstance.put(`/deals/deal/${dealData.id}`, dealData);
    dispatch(setDealDetails(response.data));
    dispatch(clearCurrentDeal());
  } catch (error) {
    console.error('Error updating deal details:', error);
    dispatch(fetchDealDetailsFailure((error as Error).message));
  }
};