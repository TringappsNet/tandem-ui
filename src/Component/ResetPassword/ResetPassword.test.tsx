import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Reset from './ResetPassword';
import axiosInstance from '../AxiosInterceptor/AxiosInterceptor';


jest.mock('../AxiosInterceptor/AxiosInterceptor', () => ({
    post: jest.fn(),
}));

describe('<Reset/>', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('display error on password does not match', async () => {
        const { getByText, getByLabelText, getByPlaceholderText } = render(<Reset />);

        fireEvent.change(getByLabelText('Old Password:'), { target: { value: 'oldPassword' } });
        fireEvent.change(getByLabelText('New Password:'), { target: { value: 'newPassword1!' } });
        fireEvent.change(getByLabelText('Confirm New Password:'), { target: { value: 'newPassword2!' } });

        fireEvent.submit(getByPlaceholderText('Confirm your password'));

        await waitFor(() => {
            expect(getByText('Passwords do not match.')).toBeInTheDocument();
        });
    });

    test('display error on invalid password format', async () => {
        const { getByText, getByLabelText, getByPlaceholderText } = render(<Reset />);

        fireEvent.change(getByLabelText('Old Password:'), { target: { value: 'oldPassword' } });
        fireEvent.change(getByLabelText('New Password:'), { target: { value: 'newpassword' } });
        fireEvent.change(getByLabelText('Confirm New Password:'), { target: { value: 'newpassword' } });

        fireEvent.submit(getByPlaceholderText('Confirm your password'));

        await waitFor(() => {
            expect(getByText('Password must contain at least 1 special character, 1 number, and 1 capital letter.')).toBeInTheDocument();
        });
    });

    test('display success message on successful password reset', async () => {
        const mockPost = jest.fn().mockResolvedValueOnce({ status: 200, data: { message: 'Password reset successful.' } });
        (axiosInstance.post as jest.Mock).mockImplementation(mockPost);

        const { getByLabelText, getByPlaceholderText, getByText } = render(<Reset />);

        fireEvent.change(getByLabelText('Old Password:'), { target: { value: 'oldPassword' } });
        fireEvent.change(getByLabelText('New Password:'), { target: { value: 'newPassword1!' } });
        fireEvent.change(getByLabelText('Confirm New Password:'), { target: { value: 'newPassword1!' } });

        fireEvent.submit(getByPlaceholderText('Confirm your password'));

        await waitFor(() => {
            expect(getByText('Password reset successful.')).toBeInTheDocument();
        });
    });

    test('display error on API failure', async () => {
        const mockPost = jest.fn().mockRejectedValueOnce({ response: { status: 500 } });
        (axiosInstance.post as jest.Mock).mockImplementation(mockPost);

        const { getByLabelText, getByPlaceholderText, getByText } = render(<Reset />);

        fireEvent.change(getByLabelText('Old Password:'), { target: { value: 'oldPassword' } });
        fireEvent.change(getByLabelText('New Password:'), { target: { value: 'newPassword1!' } });
        fireEvent.change(getByLabelText('Confirm New Password:'), { target: { value: 'newPassword1!' } });

        fireEvent.submit(getByPlaceholderText('Confirm your password'));

        await waitFor(() => {
            expect(getByText('An error occurred. Please try again.')).toBeInTheDocument();
        });
    });

    test('reset form after successful password reset', async () => {
        const mockPost = jest.fn().mockResolvedValueOnce({ status: 200, data: { message: 'Password reset successful.' } });
        (axiosInstance.post as jest.Mock).mockImplementation(mockPost);

        const { getByLabelText, getByPlaceholderText, queryByText } = render(<Reset />);

        fireEvent.change(getByLabelText('Old Password:'), { target: { value: 'oldPassword' } });
        fireEvent.change(getByLabelText('New Password:'), { target: { value: 'newPassword1!' } });
        fireEvent.change(getByLabelText('Confirm New Password:'), { target: { value: 'newPassword1!' } });
        fireEvent.submit(getByPlaceholderText('Confirm your password'));

        await waitFor(() => {
            expect(queryByText('Password reset successful.')).toBeInTheDocument();
        });

        expect(getByLabelText('Old Password:')).toBeInTheDocument();
        expect(getByLabelText('New Password:')).toBeInTheDocument();
        expect(getByLabelText('Confirm New Password:')).toBeInTheDocument();
    });
});
