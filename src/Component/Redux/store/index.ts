import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { useDispatch as useReduxDispatch } from 'react-redux';
import rootReducer, { RootState } from '../reducers';

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {},
      },
    }),
});

export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const useDispatch = () => useReduxDispatch<AppDispatch>();

export default store;