import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  open: false,
};

const dealFormSlice = createSlice({
  name: 'dealForm',
  initialState,
  reducers: {
    openDealForm(state) {
      state.open = true;
    },
    closeDealForm(state) {
      state.open = false;
    },
  },
});


export const dealFormReducer = dealFormSlice.reducer;
export const { openDealForm, closeDealForm } = dealFormSlice.actions;


const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    openProfile(state) {
      state.open = true;
    },
    closeProfile(state) {
      state.open = false;
    },
  },
});
export const profileReducer = profileSlice.reducer;
export const { openProfile, closeProfile } = profileSlice.actions;




const supportSlice = createSlice({
  name: 'support',
  initialState,
  reducers: {
    openSupport(state) {
      state.open = true;
    },
    closeSupport(state) {
      state.open = false;
    },
  },
});

export const supportReducer = supportSlice.reducer;
export const { openSupport, closeSupport } = supportSlice.actions;

const landlordSlice = createSlice({
  name: 'landlord',
  initialState,
  reducers: {
    openLandlord(state) {
      state.open = true;
    },
    closeLandlord(state) {
      state.open = false;
    },
  },
});

export const landlordReducer = landlordSlice.reducer;
export const { openLandlord, closeLandlord } = landlordSlice.actions;

const siteSlice = createSlice({
  name: 'site',
  initialState,
  reducers: {
    openSite(state) {
      state.open = true;
    },
    closeSite(state) {
      state.open = false;
    },
  },
});

export const siteReducer = siteSlice.reducer;

