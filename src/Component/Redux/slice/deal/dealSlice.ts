import { createSlice, PayloadAction, Action } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import { axiosInstance } from '../../../AxiosInterceptor/AxiosInterceptor';
import { RootState } from '../../reducers';
import { ThunkAction } from 'redux-thunk';
import { Deal } from '../../../Interface/DealFormObject';
import { clearCurrentDeal, setCurrentDeal } from './currentDeal';

type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

interface DealState {
  deals: any;
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
  deals: undefined
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
      console.log("Fetched deals:", action.payload);
      state.dealDetails = action.payload;
      state.loading = false;
      state.error = null;
      console.log("Fetched deals:", state.dealDetails);

      // console.log("Deal ID:", deal.id, "finalCommissionDate:", deal.finalCommissionDate);

    },
    fetchDealDetailsFailure: (state, action: PayloadAction<string>) => {
      state.dealDetails = []
      state.loading = false;
      state.error = action.payload;
    },
    setDealDetails: (state, action: PayloadAction<Deal>) => {
      if (!Array.isArray(state.dealDetails)) {
        state.dealDetails = [];
      }
      const index = state.dealDetails.findIndex(
        (deal) => deal.id === action.payload.id
      );
      if (index !== -1) {
        state.dealDetails[index] = action.payload;
      } else {
        state.dealDetails.push(action.payload);
      }
      console.log("Updated/Added deal:", action.payload);
    },
    updateDealField: (
      state,
      action: PayloadAction<{
        id: number | null;
        field: keyof Deal;
        value: string | number | boolean | null;
      }>
    ) => {
      const deal = state.dealDetails.find(
        (deal) => deal.id === action.payload.id
      );
      if (deal) {
        (deal[action.payload.field] as string | number | boolean | null) =
          action.payload.value;
        console.log(`Updated field ${action.payload.field} for deal ${action.payload.id}:`, deal);
      }
    },
    setActiveStep: (state, action: PayloadAction<number>) => {
      state.activeStep = action.payload;
    },
    deleteDealSuccess: (state, action: PayloadAction<number>) => {
      if (!Array.isArray(state.dealDetails)) {
        state.dealDetails = [];
      }
      state.dealDetails = state.dealDetails.filter(
        (deal) => deal.id !== action.payload
      );
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
    if (response.data && Array.isArray(response.data)) {
      dispatch(fetchDealDetailsSuccess(response.data));
    } else {
      dispatch(fetchDealDetailsFailure('No deals found.'));
    }
  } catch (error) {
    console.error('Error fetching deal details:', error);
    dispatch(fetchDealDetailsFailure('Error fetching deal details.'));
  }
};

export const fetchBrokerDealDetails = (brokerId: number): AppThunk<void> => async (dispatch: Dispatch) => {
  try {
    dispatch(fetchDealDetailsStart());
    const response = await axiosInstance.get(`deals/assignedTo/${brokerId}`);
    if (response.data && Array.isArray(response.data.deals)) {
      dispatch(fetchDealDetailsSuccess(response.data.deals));
    } 
    else if (response.status === 404 && (!response.data)){
      dispatch(fetchDealDetailsFailure('No deals found for this broker.'));
    }
    else if (response.status === 404 && response.data.response.error === 'Not Found'){
      return dispatch(fetchDealDetailsFailure('No deals found for this broker.'));
    }
    else {
      dispatch(fetchDealDetailsFailure('No deals found for this broker.'));
    }
  } catch (error :any) {
    console.error('Error fetching broker deal details:', error);
    dispatch(fetchDealDetailsFailure('Error fetching broker deal details.'));
  }
};

export const deleteDeal = (dealId: number): AppThunk<void> => async (dispatch: Dispatch) => {
  try {
    dispatch(fetchDealDetailsStart());
    const response = await axiosInstance.delete(`/deals/deal/${dealId}`);
    if (response.status === 200) {
      dispatch(deleteDealSuccess(dealId));
    } else {
      dispatch(fetchDealDetailsFailure('Error deleting deal.'));
    }
  } catch (error) {
    console.error('Error deleting deal:', error);
    dispatch(fetchDealDetailsFailure('Error deleting deal.'));
  }
};

export const createNewDeal = (dealData: Deal): AppThunk<void> => async (dispatch) => {
  try {
    dispatch(setCurrentDeal(dealData));
    const response = await axiosInstance.post('/deals/deal', dealData);
    if (response.data) {
      dispatch(setDealDetails(response.data));
      dispatch(clearCurrentDeal());
    } else {
      dispatch(fetchDealDetailsFailure('Error creating new deal.'));
    }
  } catch (error) {
    console.error('Error creating new deal:', error);
    dispatch(fetchDealDetailsFailure('Error creating new deal.'));
  }
};

export const updateDealDetails = (dealData: Deal): AppThunk<void> => async (dispatch) => {
  try {
    dispatch(setCurrentDeal(dealData));
    const response = await axiosInstance.put(`/deals/deal/${dealData.id}`, dealData);
    if (response.data) {
      dispatch(setDealDetails(response.data));
      dispatch(clearCurrentDeal());
      console.log("Updated deal details:", response.data);
    } else {
      dispatch(fetchDealDetailsFailure('Error updating deal details.'));
    }
  } catch (error) {
    console.error('Error updating deal details:', error);
    dispatch(fetchDealDetailsFailure('Error updating deal details.'));
  }
};
