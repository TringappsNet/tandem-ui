// rootReducer.ts

import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slice/authSlice';
import registerReducer from '../slice/registerSlice'; 
import dealReducer from '../slice/dealSlice'; 

const rootReducer = combineReducers({
  auth: authReducer,
  register: registerReducer,
  deal: dealReducer, 
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;