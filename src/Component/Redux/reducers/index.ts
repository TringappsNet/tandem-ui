import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slice/auth/authSlice';
import registerReducer from '../slice/auth/registerSlice';
import dealReducer from '../slice/deal/dealSlice';
import currentDeal from '../slice/deal/currentDeal';
import rolesReducer from '../slice/role/rolesSlice';
import contactReducer from '../slice/support/supportSlice';
import { dealFormReducer } from '../slice/deal/dealCompSlice';
import resetReducer from '../slice/auth/resetSlice';
import { sendInviteReducer } from '../slice/auth/sendInviteSlice';
import { profileReducer } from '../slice/profile/profileSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  register: registerReducer,
  reset: resetReducer,
  deal: dealReducer,
  dealForm: dealFormReducer,
  currentDeal: currentDeal,
  profile: profileReducer,
  sendInvite: sendInviteReducer,
  roles: rolesReducer,
  contact: contactReducer

});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;