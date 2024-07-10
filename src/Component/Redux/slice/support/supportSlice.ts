import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../AxiosInterceptor/AxiosInterceptor';
// import { RootState } from '../../reducers';

interface TicketData {
    ticketSubject: string;
    ticketDescription: string;
    senderId: number;
}

interface SupportState {
    Message: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: SupportState = {
    isLoading: false,
    error: null,
    Message: null,
};

export const raiseTicket = createAsyncThunk(
    'support/raiseTicket',
    async (ticketData: TicketData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/support/raise-ticket', ticketData);
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to raise ticket. Please try again.');
        }
    }
);

const supportSlice = createSlice({
    name: 'support',
    initialState,
    reducers: {
        clearMessages: (state) => {
            state.error = null;
            state.Message = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(raiseTicket.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.Message = null;
            })
            .addCase(raiseTicket.fulfilled, (state) => {
                state.isLoading = false;
                state.Message = 'Ticket raised successfully!';
            })
            .addCase(raiseTicket.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearMessages } = supportSlice.actions;
export default supportSlice.reducer;