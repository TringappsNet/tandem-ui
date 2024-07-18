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
  snackbarMessage: string | null;
  snackbarOpen: boolean;
}

const initialState: InviteBrokerState = {
  brokers: [],
  loading: false,
  error: null,
  snackbarMessage: null,
  snackbarOpen: false,
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
      const index = state.brokers.findIndex(
        (broker) => broker.id === action.payload.id
      );
      if (index !== -1) {
        state.brokers[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    deleteBrokerSuccess: (state, action: PayloadAction<number>) => {
      state.brokers = state.brokers.filter(
        (broker) => broker.id !== action.payload
      );
      state.loading = false;
      state.error = null;
    },
    setSnackbarMessage: (state, action: PayloadAction<string>) => {
      state.snackbarMessage = action.payload;
    },
    setSnackbarOpen: (state, action: PayloadAction<boolean>) => {
      state.snackbarOpen = action.payload;
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
  setSnackbarMessage,
  setSnackbarOpen,
} = inviteBrokerSlice.actions;

export default inviteBrokerSlice.reducer;

export const fetchBrokers =
  (): ThunkAction<void, RootState, unknown, Action<string>> =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(fetchBrokersStart());
      const response = await axiosInstance.get('/brokers/all-users');
      dispatch(fetchBrokersSuccess(response.data));
    } catch (error) {
      const errorMessage =
        (error as any).response?.data?.message || (error as Error).message;
      dispatch(fetchBrokersFailure(errorMessage));
      dispatch(setSnackbarMessage(errorMessage));
      dispatch(setSnackbarOpen(true));
    }
  };

export const addBroker =
  (broker: Site): ThunkAction<void, RootState, unknown, Action<string>> =>
  async (dispatch: Dispatch) => {
    try {
      const response = await axiosInstance.post('/brokers/all-users/', broker);
      dispatch(addBrokerSuccess(response.data));
      dispatch(setSnackbarMessage('Broker added successfully'));
      dispatch(setSnackbarOpen(true));
    } catch (error) {
      const errorMessage =
        (error as any).response?.data?.message || (error as Error).message;
      dispatch(fetchBrokersFailure(errorMessage));
      dispatch(setSnackbarMessage(errorMessage));
      dispatch(setSnackbarOpen(true));
    }
  };

export const updateBroker =
  (broker: Site): ThunkAction<void, RootState, unknown, Action<string>> =>
  async (dispatch: Dispatch) => {
    try {
      const response = await axiosInstance.put(
        `/brokers/broker/${broker.id}`,
        broker
      );
      dispatch(updateBrokerSuccess(response.data));
      dispatch(setSnackbarMessage('Broker updated successfully'));
      dispatch(setSnackbarOpen(true));
    } catch (error) {
      const errorMessage =
        (error as any).response?.data?.message || (error as Error).message;
      dispatch(fetchBrokersFailure(errorMessage));
      dispatch(setSnackbarMessage(errorMessage));
      dispatch(setSnackbarOpen(true));
    }
  };

export const deleteBroker =
  (id: number): ThunkAction<void, RootState, unknown, Action<string>> =>
  async (dispatch: Dispatch) => {
    try {
      await axiosInstance.delete(`/brokers/broker/${id}`);
      dispatch(deleteBrokerSuccess(id));
      dispatch(setSnackbarMessage('Broker deleted successfully'));
      dispatch(setSnackbarOpen(true));
    } catch (error) {
      const errorMessage =
        (error as any).response?.data?.message || (error as Error).message;
      dispatch(fetchBrokersFailure(errorMessage));
      dispatch(setSnackbarMessage(errorMessage));
      dispatch(setSnackbarOpen(true));
    }
  };
