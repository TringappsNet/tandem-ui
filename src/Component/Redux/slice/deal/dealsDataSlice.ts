import { createSlice, PayloadAction, Action } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import { axiosInstance } from '../../../AxiosInterceptor/AxiosInterceptor';
import { RootState } from '../../reducers';
import { ThunkAction } from 'redux-thunk';

type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

interface Deal {
  id: number;
  totalDeals: number;
  dealsOpened: number;
  dealsInProgress: number;
  dealsClosed: number;
  totalCommission: number;
}

interface MainState {
  deal: Deal;
  loading: boolean;
  error: string | null;
}

const initialState: MainState = {
  deal: {
    id: 0,
    totalDeals: 0,
    dealsOpened: 0,
    dealsInProgress: 0,
    dealsClosed: 0,
    totalCommission: 0,
  },
  loading: false,
  error: null,
};

const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    fetchDealsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDealsSuccess: (state, action: PayloadAction<Deal>) => {
      state.deal = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchDealsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchDealsStart, fetchDealsSuccess, fetchDealsFailure } =
  mainSlice.actions;

export const fetchDeals = (): AppThunk<void> => async (dispatch: Dispatch) => {
  try {
    dispatch(fetchDealsStart());
    const response = await axiosInstance.get('/deals/dealsData');
    const deal: Deal = {
      id: response.data.id,
      totalDeals: response.data.totalDeals,
      dealsOpened: response.data.dealsOpened,
      dealsInProgress: response.data.dealsInProgress,
      dealsClosed: response.data.dealsClosed,
      totalCommission: response.data.totalCommission,
    };
    dispatch(fetchDealsSuccess(deal));
  } catch (error) {
    console.error('Error fetching deals:', error);
    dispatch(fetchDealsFailure((error as Error).message));
  }
};
export const fetchBrokerDeals = (brokerId:number): AppThunk<void> => async (dispatch: Dispatch) => {
  try {
    dispatch(fetchDealsStart());
    const response = await axiosInstance.get(`deals/assignedTo/${brokerId}`);
    const deal: Deal = {
      id: response.data.id,
      totalDeals: response.data.totalDeals,
      dealsOpened: response.data.dealsOpened,
      dealsInProgress: response.data.dealsInProgress,
      dealsClosed: response.data.dealsClosed,
      totalCommission: response.data.totalCommission,
    };
    dispatch(fetchDealsSuccess(deal));
  } catch (error) {
    console.error('Error fetching deals:', error);
    dispatch(fetchDealsFailure((error as Error).message));
  }
};

export default mainSlice.reducer;
