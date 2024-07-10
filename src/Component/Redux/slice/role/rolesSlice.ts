import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axiosInstance from '../../../AxiosInterceptor/AxiosInterceptor';
import { axiosInstance } from '../../../AxiosInterceptor/AxiosInterceptor';
import { RootState } from '../../reducers';

interface Role {
    id: number;
    roleName: string;
}

interface RolesState {
    roles: Role[];
    loading: boolean;
    error: string | null;
}

const initialState: RolesState = {
    roles: [],
    loading: false,
    error: null,
};

export const fetchRoles = createAsyncThunk('roles/fetchRoles', async () => {
    const response = await axiosInstance.get('/roles');
    return response.data;
});

const rolesSlice = createSlice({
    name: 'roles',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.loading = false;
                state.roles = action.payload;
                console.log('Fetched roles:', action.payload);

            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed in fetching the role details';
            });
    },
});

export const selectRoles = (state: RootState) => state.roles.roles;
export const selectRolesLoading = (state: RootState) => state.roles.loading;
export const selectRolesError = (state: RootState) => state.roles.error;

export default rolesSlice.reducer;
