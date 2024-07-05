import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slice/authSlice';
import registerReducer from '../slice/registerSlice';
import dealReducer from '../slice/deal/dealSlice';
import dealFormSlice from '../slice/deal/dealFormSlice';
const rootReducer = combineReducers({
  auth: authReducer,
  register: registerReducer,
  deal: dealReducer,
  dealForm: dealFormSlice,

});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;