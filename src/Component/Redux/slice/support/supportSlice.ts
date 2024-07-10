import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../AxiosInterceptor/AxiosInterceptor';

interface TicketData {
    ticketSubject: string;
    ticketDescription: string;
    senderId: number;
}

interface SupportState {
    isLoading: boolean;
    error: string | null;
    successMessage: string | null;
    open: boolean;
}

const initialState: SupportState = {
    isLoading: false,
    error: null,
    successMessage: null,
    open: false,
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
        openSupport(state) {
            state.open = true;
        },
        closeSupport(state) {
            state.open = false;
        },
        clearMessages(state) {
            state.error = null;
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(raiseTicket.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(raiseTicket.fulfilled, (state) => {
                state.isLoading = false;
                state.successMessage = 'Ticket raised successfully!';
            })
            .addCase(raiseTicket.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { openSupport, closeSupport, clearMessages } = supportSlice.actions;
export default supportSlice.reducer;