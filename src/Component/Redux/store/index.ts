import { Action, ThunkDispatch, configureStore } from '@reduxjs/toolkit';
import { useDispatch as useReduxDispatch } from 'react-redux';
import rootReducer, { RootState } from '../reducers/index';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {},
      },
    }),
});

export type AppDispatch = typeof store.dispatch;
export type AppThunkDispatch = ThunkDispatch<RootState, void, Action>;

export const useDispatch = () => useReduxDispatch<AppDispatch>();

export default store;