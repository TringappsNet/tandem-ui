// rootReducer.ts

import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../store/authSlice';
import registerReducer from '../store/registerSlice'; 
import dealReducer from '../store/dealSlice'; 

const rootReducer = combineReducers({
  auth: authReducer,
  register: registerReducer,
  deal: dealReducer, 
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
