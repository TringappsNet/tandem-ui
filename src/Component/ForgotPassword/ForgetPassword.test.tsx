import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ForgotPassword from './ForgotPassword';
import {axiosInstance} from '../AxiosInterceptor/AxiosInterceptor';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('../AxiosInterceptor/AxiosInterceptor', () => ({
    post: jest.fn(),
}));


describe('ForgotPassword ', () => {
    test('renders ForgotPassword component', () => {
        const { getByText, getByPlaceholderText } = render(<Router> <ForgotPassword /></Router>);
        expect(getByText('Forgot Password?')).toBeInTheDocument();
        expect(getByPlaceholderText('Enter email')).toBeInTheDocument();
    });

    test('validates empty email', async () => {
        const { getByText, getByPlaceholderText } = render(<Router> <ForgotPassword /></Router>);
        const emailInput = getByPlaceholderText('Enter email');
        const submitButton = getByText('Send Reset Link');
        
        fireEvent.change(emailInput, { target: { value: '' } });
        fireEvent.click(submitButton);

        await (() => {
            expect(getByText('Email cannot be empty')).toBeInTheDocument();
        });
    });

    test('validates invalid email format', async () => {
        const { getByText, getByPlaceholderText } = render(<Router> <ForgotPassword /></Router>);
        const emailInput = getByPlaceholderText('Enter email');
        const submitButton = getByText('Send Reset Link');
        
        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(getByText('Invalid email address')).toBeInTheDocument();
        });
    });

    test('displays success message on valid email', async () => {
        (axiosInstance.post as jest.Mock).mockResolvedValueOnce({ data: { message: 'Success' }, status: 200 });
        const { getByText, getByPlaceholderText } = render(<Router> <ForgotPassword /></Router>);
        const emailInput = getByPlaceholderText('Enter email');
        const submitButton = getByText('Send Reset Link');
        
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(getByText('Reset link has been sent to your mail!')).toBeInTheDocument();
        });
    });

    test('displays failure message on server error', async () => {
        (axiosInstance.post as jest.Mock).mockRejectedValueOnce({ response: { status: 500, data: {} } });
        
        const { getByText, getByPlaceholderText } =render(<Router> <ForgotPassword /></Router>);
        const emailInput = getByPlaceholderText('Enter email');
        const submitButton = getByText('Send Reset Link');
        
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(getByText('Server error, please try again later')).toBeInTheDocument();
        });
    });
});
