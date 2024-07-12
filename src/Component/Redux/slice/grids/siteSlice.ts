import { createSlice, PayloadAction, Action } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import { axiosInstance } from '../../../AxiosInterceptor/AxiosInterceptor';
import { RootState } from '../../reducers';
import { ThunkAction } from 'redux-thunk';

interface Site {
  id: number;
  addressline1: string;
  addressline2: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  isNew: boolean;
  createdBy: number;
  updatedBy?: number; // Add updatedBy field
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
    addSiteSuccess: (state, action: PayloadAction<Site>) => {
      state.sites.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    updateSiteSuccess: (state, action: PayloadAction<Site>) => {
      const index = state.sites.findIndex(
        (site) => site.id === action.payload.id
      );
      if (index !== -1) {
        state.sites[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    deleteSiteSuccess: (state, action: PayloadAction<number>) => {
      state.sites = state.sites.filter((site) => site.id !== action.payload);
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  fetchSitesStart,
  fetchSitesSuccess,
  fetchSitesFailure,
  addSiteSuccess,
  updateSiteSuccess,
  deleteSiteSuccess,
} = siteSlice.actions;

export default siteSlice.reducer;

export const fetchSites =
  (): ThunkAction<void, RootState, unknown, Action<string>> =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(fetchSitesStart());
      const response = await axiosInstance.get('/sites');
      dispatch(fetchSitesSuccess(response.data));
    } catch (error) {
      dispatch(fetchSitesFailure((error as Error).message));
    }
  };

export const addSite =
  (site: Site): ThunkAction<void, RootState, unknown, Action<string>> =>
  async (dispatch: Dispatch) => {
    try {
      const response = await axiosInstance.post('/sites/site/', site);
      dispatch(addSiteSuccess(response.data));
    } catch (error) {
      dispatch(fetchSitesFailure((error as Error).message));
    }
  };

export const updateSite =
  (site: Site): ThunkAction<void, RootState, unknown, Action<string>> =>
  async (dispatch: Dispatch) => {
    try {
      const response = await axiosInstance.put(`/sites/site/${site.id}`, site);
      dispatch(updateSiteSuccess(response.data));
    } catch (error) {
      dispatch(fetchSitesFailure((error as Error).message));
    }
  };

export const deleteSite =
  (id: number): ThunkAction<void, RootState, unknown, Action<string>> =>
  async (dispatch: Dispatch) => {
    try {
      await axiosInstance.delete(`/sites/site/${id}`);
      dispatch(deleteSiteSuccess(id));
    } catch (error) {
      dispatch(fetchSitesFailure((error as Error).message));
    }
  };
