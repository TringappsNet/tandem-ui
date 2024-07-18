import { createSlice, PayloadAction, Action } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import { axiosInstance } from '../../../AxiosInterceptor/AxiosInterceptor';
import { RootState } from '../../reducers';
import { ThunkAction } from 'redux-thunk';

interface Landlord {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  isNew: boolean;
}

interface LandlordState {
  landlords: Landlord[];
  loading: boolean;
  error: string | null;
  snackbarMessage: string | null;
  snackbarOpen: boolean;
}

const initialState: LandlordState = {
  landlords: [],
  loading: false,
  error: null,
  snackbarMessage: null,
  snackbarOpen: false,
};

const landlordSlice = createSlice({
  name: 'landlord',
  initialState,
  reducers: {
    fetchLandlordsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchLandlordsSuccess: (state, action: PayloadAction<Landlord[]>) => {
      state.landlords = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchLandlordsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addLandlordSuccess: (state, action: PayloadAction<Landlord>) => {
      state.landlords.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    updateLandlordSuccess: (state, action: PayloadAction<Landlord>) => {
      const index = state.landlords.findIndex(
        (landlord) => landlord.id === action.payload.id
      );
      if (index !== -1) {
        state.landlords[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    deleteLandlordSuccess: (state, action: PayloadAction<number>) => {
      state.landlords = state.landlords.filter(
        (landlord) => landlord.id !== action.payload
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
  fetchLandlordsStart,
  fetchLandlordsSuccess,
  fetchLandlordsFailure,
  addLandlordSuccess,
  updateLandlordSuccess,
  deleteLandlordSuccess,
  setSnackbarMessage,
  setSnackbarOpen,
} = landlordSlice.actions;

export default landlordSlice.reducer;

export const fetchLandlords =
  (): ThunkAction<void, RootState, unknown, Action<string>> =>
    async (dispatch: Dispatch) => {
      try {
        dispatch(fetchLandlordsStart());
        const response = await axiosInstance.get('/landlords');
        dispatch(fetchLandlordsSuccess(response.data));
      } catch (error) {
        const errorMessage = (error as any).response?.data?.message || (error as Error).message;
        dispatch(fetchLandlordsFailure(errorMessage));
        // dispatch(setSnackbarMessage(errorMessage));
        // dispatch(setSnackbarOpen(true));
      }
    };

export const addLandlord =
  (landlord: Landlord): ThunkAction<void, RootState, unknown, Action<string>> =>
    async (dispatch: Dispatch) => {
      try {
        const response = await axiosInstance.post(
          '/landlords/landlord/',
          landlord
        );
        dispatch(addLandlordSuccess(response.data));
        dispatch(setSnackbarMessage('Landlord added successfully'));
        dispatch(setSnackbarOpen(true));
      } catch (error) {
        const errorMessage = (error as any).response?.data?.message || (error as Error).message;
        dispatch(fetchLandlordsFailure(errorMessage));
        dispatch(setSnackbarMessage(errorMessage));
        dispatch(setSnackbarOpen(true));
      }
    };

export const updateLandlord =
  (landlord: Landlord): ThunkAction<void, RootState, unknown, Action<string>> =>
    async (dispatch: Dispatch) => {
      try {
        const response = await axiosInstance.patch(
          `/landlords/landlord/${landlord.id}`,
          landlord
        );
        dispatch(updateLandlordSuccess(response.data));
        dispatch(setSnackbarMessage('Landlord updated successfully'));
        dispatch(setSnackbarOpen(true));
      } catch (error) {
        const errorMessage = (error as any).response?.data?.message || (error as Error).message;
        dispatch(fetchLandlordsFailure(errorMessage));
        dispatch(setSnackbarMessage(errorMessage));
        dispatch(setSnackbarOpen(true));
      }
    };

export const deleteLandlord =
  (id: number): ThunkAction<void, RootState, unknown, Action<string>> =>
    async (dispatch: Dispatch) => {
      try {
        await axiosInstance.delete(`/landlords/landlord/${id}`);
        dispatch(deleteLandlordSuccess(id));
        dispatch(setSnackbarMessage('Landlord deleted successfully'));
        dispatch(setSnackbarOpen(true));
      } catch (error) {
        const errorMessage = (error as any).response?.data?.message || (error as Error).message;
        dispatch(fetchLandlordsFailure(errorMessage));
        dispatch(setSnackbarMessage(errorMessage));
        dispatch(setSnackbarOpen(true));
      }
    };