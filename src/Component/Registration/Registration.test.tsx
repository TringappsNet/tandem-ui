import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axiosInstance from '../AxiosInterceptor/AxiosInterceptor';
import Registration from './Registration';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('../AxiosInterceptor/AxiosInterceptor');

describe('Registration Component', () => {
    beforeEach(() => {
        render(<Router><Registration /></Router>);
    });
    test('validate function', () => {
        const { getByLabelText, getByText } = screen;
        fireEvent.change(getByLabelText('First Name'), { target: { value: 'John' } });
        fireEvent.click(getByText('Register'));
        expect(screen.queryByText('First Name is required.')).toBeNull();
    });
    test('handles form submission with valid data', async () => {
        (axiosInstance.post as jest.Mock).mockResolvedValueOnce({ data: { message: 'Registration successful!' } });

        const { getByLabelText, getByText } = screen;
        fireEvent.change(getByLabelText('First Name'), { target: { value: 'John' } });
        fireEvent.click(getByText('Register'));

        await (() => {
            expect(screen.getByText('Registration successful!')).toBeInTheDocument();
        });
    });


    test('handles form submission with invalid data', async () => {
        (axiosInstance.post as jest.Mock).mockRejectedValueOnce({ response: { status: 400, data: { message: 'Invalid invite token.' } } });

        const { getByText } = screen;
        fireEvent.click(getByText('Register'));

        await waitFor(() => {
            expect(screen.getByText('First Name is required.')).toBeInTheDocument();
        });
    });
    test('renders form fields', () => {
        expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    });

    test('displays validation errors correctly', async () => {
        const { getByText } = screen;
        fireEvent.click(getByText('Register'));

        await waitFor(() => {
            expect(screen.getByText('First Name is required.')).toBeInTheDocument();
        });
    });
});
