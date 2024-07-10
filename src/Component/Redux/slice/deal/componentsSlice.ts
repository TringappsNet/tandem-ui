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

const sendInviteSlice = createSlice({
  name: 'sendInvite',
  initialState,
  reducers: {
    openSendInvite(state) {
      state.open = true;
    },
    closeSendInvite(state) {
      state.open = false;
    },
  },
});


const resetPasswordSlice = createSlice({
  name: 'reset',
  initialState,
  reducers: {
    openReset(state) {
      state.open = true;
    },
    closeReset(state) {
      state.open = true;
    },
  },
});

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

export const { openProfile, closeProfile } = profileSlice.actions;
export const { openSendInvite, closeSendInvite } = sendInviteSlice.actions;
export const { openReset, closeReset } = resetPasswordSlice.actions;
export const { openSupport, closeSupport } = supportSlice.actions;
export const { openLandlord, closeLandlord } = landlordSlice.actions;
export const { openSite, closeSite } = siteSlice.actions;
export const { openDealForm, closeDealForm } = dealFormSlice.actions;

export const dealFormReducer = dealFormSlice.reducer;
export const profileReducer = profileSlice.reducer;
export const sendInviteReducer = sendInviteSlice.reducer;
export const resetPasswordReducer = resetPasswordSlice.reducer;
export const supportReducer = supportSlice.reducer;
export const landlordReducer = landlordSlice.reducer;
export const siteReducer = siteSlice.reducer;

