// brokerSlice.ts
import { createSlice, PayloadAction, Action } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import { axiosInstance } from '../../../AxiosInterceptor/AxiosInterceptor';
import { RootState } from '../../reducers';
import { ThunkAction } from 'redux-thunk';

type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

interface Broker {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  lastModifiedBy: number;
  name: string;
}

interface BrokerState {
  brokers: Broker[];
  loading: boolean;
  error: string | null;
}

const initialState: BrokerState = {
  brokers: [],
  loading: false,
  error: null,
};

const brokerSlice = createSlice({
  name: 'broker',
  initialState,
  reducers: {
    fetchBrokersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBrokersSuccess: (state, action: PayloadAction<Broker[]>) => {
      state.brokers = action.payload.map(broker => ({
        ...broker,
        name: `${broker.firstName} ${broker.lastName}`
      }));
      state.loading = false;
      state.error = null;
    },
    fetchBrokersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchBrokersStart,
  fetchBrokersSuccess,
  fetchBrokersFailure,
} = brokerSlice.actions;

export default brokerSlice.reducer;

export const fetchBrokers = (): AppThunk<void> => async (dispatch: Dispatch) => {
  try {
    dispatch(fetchBrokersStart());
    const response = await axiosInstance.get('/brokers/all-users');
    dispatch(fetchBrokersSuccess(response.data));
  } catch (error) {
    console.error('Error fetching brokers:', error);
    dispatch(fetchBrokersFailure((error as Error).message));
  }
};