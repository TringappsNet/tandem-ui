import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slice/auth/authSlice';
import registerReducer from '../slice/auth/registerSlice';
import dealReducer from '../slice/deal/dealSlice';
import currentDeal from '../slice/deal/currentDeal';
import rolesReducer from '../slice/role/rolesSlice';
import { dealFormReducer, profileReducer, sendInviteReducer, supportReducer, landlordReducer, siteReducer, resetPasswordReducer } from '../slice/componentsState/componentsSlice';
import contactReducer from '../slice/support/supportSlice';
import resetReducer from '../slice/auth/resetSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  register: registerReducer,
  deal: dealReducer,
  dealForm: dealFormReducer,
  currentDeal: currentDeal,
  profileReducer: profileReducer,
  sendInviteReducer: sendInviteReducer,
  reset: resetReducer,
  resetPassword: resetPasswordReducer,
  supportReducer: supportReducer,
  siteReducer: siteReducer,
  landlordReducer: landlordReducer,
  roles: rolesReducer,
  support: contactReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;