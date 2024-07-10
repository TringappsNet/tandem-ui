import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slice/auth/authSlice';
import registerReducer from '../slice/auth/registerSlice';
import dealReducer from '../slice/deal/dealSlice';
import currentDeal from '../slice/deal/currentDeal';
import rolesReducer from '../slice/role/rolesSlice';
import { dealFormReducer, profileReducer, sendInviteReducer, supportReducer, landlordReducer, siteReducer, resetPasswordReducer } from '../slice/deal/componentsSlice';
import resetReducer from '../slice/auth/resetSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  register: registerReducer,
  reset: resetReducer,
  deal: dealReducer,
  dealForm: dealFormReducer,
  currentDeal: currentDeal,
  profile: profileReducer,
  sendInvite: sendInviteReducer,
  resetPassword: resetPasswordReducer,
  support: supportReducer,
  site: siteReducer,
  landlord: landlordReducer,
  roles: rolesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;