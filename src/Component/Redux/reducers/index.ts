import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slice/auth/authSlice';
import registerReducer from '../slice/auth/registerSlice';
import dealReducer from '../slice/deal/dealSlice';
import currentDeal from '../slice/deal/currentDeal';
import rolesReducer from '../slice/role/rolesSlice';
import contactReducer from '../slice/support/supportSlice';
import { dealFormReducer } from '../slice/deal/dealFormSlice';
import resetReducer from '../slice/auth/resetSlice';
import { sendInviteReducer } from '../slice/auth/sendInviteSlice';
import { profileReducer } from '../slice/profile/profileSlice';
import changePasswordReducer from '../slice/auth/changePasswordSlice';
import brokerReducer from '../slice/broker/brokerSlice';
import forgotPasswordReducer from '../slice/auth/forgotPasswordSlice';
import inviteBrokerReducer from '../slice/user/userSlice';
import landlordReducer from '../slice/landlord/landlordSlice';
import siteReducer from '../slice/site/siteSlice';
import dealDataReducer from '../slice/deal/dealsDataSlice';
import { LOGOUT } from '../actionTypes';

const appReducer = combineReducers({
  auth: authReducer,
  register: registerReducer,
  reset: resetReducer,
  deal: dealReducer,
  dealForm: dealFormReducer,
  currentDeal: currentDeal,
  profile: profileReducer,
  sendInvite: sendInviteReducer,
  roles: rolesReducer,
  contact: contactReducer,
  changePassword: changePasswordReducer,
  broker: brokerReducer,
  forgotPassword: forgotPasswordReducer,
  inviteBroker: inviteBrokerReducer,
  landlord: landlordReducer,
  site: siteReducer,
  dealData: dealDataReducer,
});

const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: any) => {
  if (action.type === LOGOUT) {
    state = undefined;
  }
  return appReducer(state, action);
};

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;