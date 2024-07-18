import { createSlice, PayloadAction, Action } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import { axiosInstance } from '../../../AxiosInterceptor/AxiosInterceptor';
import { RootState } from '../../reducers';
import { ThunkAction } from 'redux-thunk';

type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

interface ForgotPasswordState {
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
}

const initialState: ForgotPasswordState = {
  loading: false,
  successMessage: null,
  errorMessage: null,
};

const forgotPasswordSlice = createSlice({
  name: 'forgotPassword',
  initialState,
  reducers: {
    forgotPasswordStart: (state) => {
      state.loading = true;
      state.successMessage = null;
      state.errorMessage = null;
    },
    forgotPasswordSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.successMessage = action.payload;
      state.errorMessage = null;
    },
    forgotPasswordFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.successMessage = null;
      state.errorMessage = action.payload;
    },
    clearState: (state) => {
      state.loading = false;
      state.successMessage = null;
      state.errorMessage = null;
    },
  },
});

export const {
  forgotPasswordStart,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  clearState,
} = forgotPasswordSlice.actions;

export default forgotPasswordSlice.reducer;

export const forgotPassword =
  (email: string): AppThunk<void> =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(forgotPasswordStart());
      const response = await axiosInstance.post('/auth/forgot-password', {
        email,
      });
      const data = response.data;

      if (data.message && response.status === 200) {
        dispatch(
          forgotPasswordSuccess('Reset link has been sent to your mail!')
        );
      } else {
        dispatch(forgotPasswordFailure('Failed to send reset link.'));
      }
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 500) {
          dispatch(
            forgotPasswordFailure('Server error, please try again later.')
          );
        } else if (status === 401 && data.message === 'Incorrect Email') {
          dispatch(
            forgotPasswordFailure(
              'Incorrect Email! Please enter correct email.'
            )
          );
        } else if (
          status === 401 &&
          data.message === 'You are not a registered user'
        ) {
          dispatch(
            forgotPasswordFailure(
              'You are not a registered user. Please register.'
            )
          );
        } else if (status === 404 && data.message === 'User not found') {
          dispatch(forgotPasswordFailure(data.message));
        } else {
          dispatch(
            forgotPasswordFailure(error.response.data.message)
          );
        }
      } else {
        dispatch(forgotPasswordFailure(error.response.data.message));
      }
    }
  };
