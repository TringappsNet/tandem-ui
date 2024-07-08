import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axiosInstance from '../AxiosInterceptor/AxiosInterceptor';
import ChangePassword from './ChangePassword';

jest.mock('../AxiosInterceptor/AxiosInterceptor', () => ({
    post: jest.fn(),
}));

describe('<ChangePassword />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders ChangePassword component correctly', () => {
        const { getByText, getByLabelText } = render(<ChangePassword />);
        expect(getByText('Set a New Password')).toBeInTheDocument();
        expect(getByLabelText('New Password')).toBeInTheDocument();
        expect(getByLabelText('Confirm Password')).toBeInTheDocument();
    });

    test('submits the form with valid inputs and shows success message', async () => {
        const { getByLabelText, getByText } = render(<ChangePassword />);
        const newPasswordInput = getByLabelText('New Password');
        const confirmPasswordInput = getByLabelText('Confirm Password');
        const submitButton = getByText('Send Reset Link');

        fireEvent.change(newPasswordInput, { target: { value: 'NewPassword!123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'NewPassword!123' } });
        fireEvent.click(submitButton);

        await (() => {
            expect(axiosInstance.post).toHaveBeenCalledWith('auth/change-password', {
                newPassword: 'NewPassword!123',
            });
            expect(getByText(/sucessfully!/i)).toBeInTheDocument();
        });
    });

    test('shows error message when submitting with empty new password', async () => {
        const { getByLabelText, getByText } = render(<ChangePassword />);
        const confirmPasswordInput = getByLabelText('Confirm Password');
        const submitButton = getByText('Send Reset Link');

        fireEvent.change(confirmPasswordInput, { target: { value: 'NewPassword!123' } });
        fireEvent.click(submitButton);

        await (() => {
            expect(getByText('Password is required.')).toBeInTheDocument();
        });
    });

    test('shows error message when passwords do not match', async () => {
        const { getByLabelText, getByText } = render(<ChangePassword />);
        const newPasswordInput = getByLabelText('New Password');
        const confirmPasswordInput = getByLabelText('Confirm Password');
        const submitButton = getByText('Send Reset Link');

        fireEvent.change(newPasswordInput, { target: { value: 'NewPassword!123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'MismatchedPassword!123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(getByText('Passwords do not match.')).toBeInTheDocument();
        });
    });

    test('shows error message when new password does not have  special character', async () => {
        const { getByLabelText, getByText } = render(<ChangePassword />);
        const newPasswordInput = getByLabelText('New Password');
        const confirmPasswordInput = getByLabelText('Confirm Password');
        const submitButton = getByText('Send Reset Link');

        fireEvent.change(newPasswordInput, { target: { value: 'NewPassword123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'NewPassword123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(getByText('Password should contain at least one special character.')).toBeInTheDocument();
        });
    });

    it('handles API error on password change', async () => {
        (axiosInstance.post as jest.Mock).mockRejectedValueOnce(new Error('API error'));
        const { getByLabelText, getByText } = render(<ChangePassword />);
        const newPasswordInput = getByLabelText('New Password');
        const confirmPasswordInput = getByLabelText('Confirm Password');
        const submitButton = getByText('Send Reset Link');

        fireEvent.change(newPasswordInput, { target: { value: 'NewPassword!123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'NewPassword!123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(getByText('Failed to change password. Please try again.')).toBeInTheDocument();
        });
    });
});
