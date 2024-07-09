import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slice/auth/authSlice';
import registerReducer from '../slice/registerSlice';
import dealReducer from '../slice/deal/dealSlice';
import currentDeal from '../slice/deal/currentDeal';
import rolesReducer from '../slice/role/rolesSlice';
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
  roles: rolesReducer,


});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;