import { createSlice, PayloadAction, Action } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import { axiosInstance } from '../../../AxiosInterceptor/AxiosInterceptor';
import { RootState } from '../../reducers';
import { ThunkAction } from 'redux-thunk';

interface Site {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  isNew: boolean;
  createdBy: number;
}

interface InviteBrokerState {
  brokers: Site[];
  loading: boolean;
  error: string | null;
}

const initialState: InviteBrokerState = {
  brokers: [],
  loading: false,
  error: null,
};

const inviteBrokerSlice = createSlice({
  name: 'inviteBroker',
  initialState,
  reducers: {
    fetchBrokersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBrokersSuccess: (state, action: PayloadAction<Site[]>) => {
      state.brokers = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchBrokersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addBrokerSuccess: (state, action: PayloadAction<Site>) => {
      state.brokers.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    updateBrokerSuccess: (state, action: PayloadAction<Site>) => {
      const index = state.brokers.findIndex(broker => broker.id === action.payload.id);
      if (index !== -1) {
        state.brokers[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    deleteBrokerSuccess: (state, action: PayloadAction<number>) => {
      state.brokers = state.brokers.filter(broker => broker.id !== action.payload);
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  fetchBrokersStart,
  fetchBrokersSuccess,
  fetchBrokersFailure,
  addBrokerSuccess,
  updateBrokerSuccess,
  deleteBrokerSuccess,
} = inviteBrokerSlice.actions;

export default inviteBrokerSlice.reducer;

export const fetchBrokers = (): ThunkAction<void, RootState, unknown, Action<string>> => async (dispatch: Dispatch) => {
  try {
    dispatch(fetchBrokersStart());
    const response = await axiosInstance.get('/brokers/all-users');
    dispatch(fetchBrokersSuccess(response.data));
  } catch (error) {
    dispatch(fetchBrokersFailure((error as Error).message));
  }
};

export const addBroker = (broker: Site): ThunkAction<void, RootState, unknown, Action<string>> => async (dispatch: Dispatch) => {
  try {
    const response = await axiosInstance.post('/brokers/all-users/', broker);
    dispatch(addBrokerSuccess(response.data));
  } catch (error) {
    dispatch(fetchBrokersFailure((error as Error).message));
  }
};

export const updateBroker = (broker: Site): ThunkAction<void, RootState, unknown, Action<string>> => async (dispatch: Dispatch) => {
  try {
    const response = await axiosInstance.put(`/brokers/broker/${broker.id}`, broker);
    dispatch(updateBrokerSuccess(response.data));
  } catch (error) {
    dispatch(fetchBrokersFailure((error as Error).message));
  }
};

export const deleteBroker = (id: number): ThunkAction<void, RootState, unknown, Action<string>> => async (dispatch: Dispatch) => {
  try {
    await axiosInstance.delete(`/brokers/broker/${id}`);
    dispatch(deleteBrokerSuccess(id));
  } catch (error) {
    dispatch(fetchBrokersFailure((error as Error).message));
  }
};