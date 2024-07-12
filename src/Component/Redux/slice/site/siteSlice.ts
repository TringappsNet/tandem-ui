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

interface Site {
  id: number;
  addressline1: string;
  addressline2: string;
  state: string;
  city: string;
  zipcode: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
}

interface SiteState {
  sites: Site[];
  loading: boolean;
  error: string | null;
}

const initialState: SiteState = {
  sites: [],
  loading: false,
  error: null,
};

const siteSlice = createSlice({
  name: 'site',
  initialState,
  reducers: {
    fetchSitesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSitesSuccess: (state, action: PayloadAction<Site[]>) => {
      state.sites = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchSitesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchSitesStart, fetchSitesSuccess, fetchSitesFailure } =
  siteSlice.actions;

export default siteSlice.reducer;

export const fetchSites = (): AppThunk<void> => async (dispatch: Dispatch) => {
  try {
    dispatch(fetchSitesStart());
    const response = await axiosInstance.get('/sites');
    dispatch(fetchSitesSuccess(response.data));
  } catch (error) {
    console.error('Error fetching sites:', error);
    dispatch(fetchSitesFailure((error as Error).message));
  }
};
