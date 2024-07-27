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

interface Broker {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  isAdmin: boolean;
  isActive: boolean;
  lastModifiedBy: number;
  name: string;
  fullName: string;
  totalDeals: number;
  dealsOpened: number;
  dealsInProgress: number;
  dealsClosed: number;
  totalCommission: number;
  roleName: string;
}

interface BrokerState {
  brokers: Broker[];
  loading: boolean;
  error: string | null;
}

const initialState: BrokerState = {
  brokers: [],
  loading: false,
  error: null,
};

const brokerSlice = createSlice({
  name: 'broker',
  initialState,
  reducers: {
    fetchBrokersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBrokersSuccess: (state, action: PayloadAction<Broker[]>) => {
      state.brokers = action.payload.map((broker) => ({
        ...broker,
        name: `${broker.firstName} ${broker.lastName}`,
      }));
      state.loading = false;
      state.error = null;
    },
    fetchBrokerSuccess: (state, action: PayloadAction<Broker[]>) => {
      state.brokers = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchBrokersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchBrokersStart, fetchBrokersSuccess, fetchBrokersFailure, fetchBrokerSuccess } =
  brokerSlice.actions;

export default brokerSlice.reducer;

export const fetchBrokers = (): AppThunk<void> => async (dispatch: Dispatch) => {
  try {
    dispatch(fetchBrokersStart());
    const response = await axiosInstance.get('/brokers');
    const brokers = response.data.map((broker: any) => {
      const fullName = `${broker.user.firstName} ${broker.user.lastName}`;
      const roleName = broker.roleId === 1 ? 'Admin' : 'Broker';
      return {
        id: broker.user.id,
        email: broker.user.email,
        fullName: fullName,
        firstName: broker.user.firstName,
        lastName: broker.user.lastName,
        mobile: broker.user.mobile,
        address: broker.user.address,
        city: broker.user.city,
        state: broker.user.state,
        country: broker.user.country,
        zipcode: broker.user.zipcode,
        isActive: broker.user.isActive,
        isAdmin: broker.user.isAdmin,
        totalDeals: broker.totalDeals,
        dealsOpened: broker.dealsOpened,
        dealsInProgress: broker.dealsInProgress,
        dealsClosed: broker.dealsClosed,
        totalCommission: broker.totalCommission,
        roleName: roleName,
      };
    });
    dispatch(fetchBrokersSuccess(brokers));
  } catch (error) {
    console.error('Error fetching brokers:', error);
    dispatch(fetchBrokersFailure((error as Error).message));
  }
};

export const fetchBrokerUserDetails = (brokerId: number): AppThunk<void> => async (dispatch: Dispatch) => {
  try {
    dispatch(fetchBrokersStart());
    const response = await axiosInstance.get(`brokers/brokerwithdeals/${brokerId}`);
    
    if (response.status === 200 && response.data) {
      const broker = response.data;
      const roleName = broker.roleId === 1 ? 'Admin' : 'Broker';
      const userDetails: any = {
        id: broker.user.id,
        email: broker.user.email,
        firstName: broker.user.firstName,
        lastName: broker.user.lastName,
        mobile: broker.user.mobile,
        address: broker.user.address,
        city: broker.user.city,
        state: broker.user.state,
        country: broker.user.country,
        zipcode: broker.user.zipcode,
        isActive: broker.user.isActive,
        isAdmin: broker.user.isAdmin,
        totalDeals: broker.totalDeals,
        dealsOpened: broker.dealsOpened,
        dealsInProgress: broker.dealsInProgress,
        dealsClosed: broker.dealsClosed,
        totalCommission: broker.totalCommission,
        roleName: roleName,
      };

      dispatch(fetchBrokerSuccess(userDetails));
    } else if (response.status === 404 && response.data?.response?.error === 'Not Found') {
      dispatch(fetchBrokersFailure('No deals found for this broker.'));
    } else {
      dispatch(fetchBrokersFailure('No deals found for this broker.'));
    }
  } catch (error: any) {
    console.error('Error fetching broker deal details:', error);
    dispatch(fetchBrokersFailure('Error fetching broker deal details.'));
  }
};