import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import DealForm from './dealForm';
import userEvent from '@testing-library/user-event';

jest.mock('../AxiosInterceptor/AxiosInterceptor');

const mockStore = configureStore([]);

describe('DealForm component', () => {
    let store: any;

    beforeEach(() => {
        store = mockStore({
            currentDeal: {
                currentDeal: {
                },
            },
            dealForm: {
                open: true,
            },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders DealForm ', () => {
        const { getByText, getByLabelText } = render(
            <Provider store={store}>
                <DealForm />
            </Provider>
        );

        expect(getByText('Deal Form')).toBeInTheDocument();
        expect(getByLabelText('propertyName')).toBeInTheDocument();
    });

    test('handles form interactions and validations', async () => {
        const { getByLabelText, getByText } = render(
            <Provider store={store}>
                <DealForm />
            </Provider>
        );

        const propertyNameField = getByLabelText('propertyName');
        userEvent.type(propertyNameField, 'Sample Property');

        const dealStartDateField = getByLabelText('dealStartDate');
        fireEvent.change(dealStartDateField, { target: { value: '2024-07-10' } });

        const nextButton = getByText('Next');
        fireEvent.click(nextButton);
        await waitFor(() => {
            expect(getByText('Proposal')).toBeInTheDocument();
        });
    });
    test('handles error in fetchBrokers', async () => {
        const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
        render(
            <Provider store={store}>
                <DealForm />
            </Provider>
        );

        await waitFor(() => {
            const error = new Error('Failed to fetch brokers');
            store.dispatch({ type: 'FETCH_BROKERS_FAILURE', error });
        });

        await waitFor(() => {
            expect(mockConsoleError).toHaveBeenCalledWith('Error fetching broker names:', expect.any(Error));
        });

        mockConsoleError.mockRestore();
    });
});
