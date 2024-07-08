import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slice/authSlice';
import registerReducer from '../slice/registerSlice';
import dealReducer from '../slice/deal/dealSlice';
import currentDeal from '../slice/deal/currentDeal';
import { dealFormReducer, profileReducer, sendInviteReducer, resetReducer, supportReducer, landlordReducer, siteReducer } from '../slice/deal/dealFormSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  register: registerReducer,
  deal: dealReducer,
  dealForm: dealFormReducer,
  currentDeal: currentDeal,
  profileReducer: profileReducer,
  sendInviteReducer: sendInviteReducer,
  resetReducer: resetReducer,
  supportReducer: supportReducer,
  siteReducer: siteReducer,
  landlordReducer: landlordReducer,
  
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;