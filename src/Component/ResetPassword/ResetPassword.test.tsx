import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { axiosInstance } from '../AxiosInterceptor/AxiosInterceptor';
import Reset from './ResetPassword';

jest.mock('../AxiosInterceptor/AxiosInterceptor');

describe('Reset', () => {
  beforeEach(() => {
    (axiosInstance.post as jest.Mock).mockClear();
    localStorage.setItem('user', JSON.stringify({ id: 'testUserId' }));
  });

  test('displays error message on password mismatch', async () => {
    render(<Reset onCloseDialog={() => {}} />);

    fireEvent.change(screen.getByLabelText('New Password:'), {
      target: { value: 'NewPassword123!' },
    });
    fireEvent.change(screen.getByLabelText('Confirm New Password:'), {
      target: { value: 'MismatchedPassword' },
    });

    fireEvent.submit(screen.getByRole('button', { name: 'Reset Password' }));

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
      expect(axiosInstance.post).not.toHaveBeenCalled();
    });
  });

  test('displays error message on invalid password', async () => {
    render(<Reset onCloseDialog={() => {}} />);

    fireEvent.change(screen.getByLabelText('New Password:'), {
      target: { value: 'weakpassword' },
    });
    fireEvent.change(screen.getByLabelText('Confirm New Password:'), {
      target: { value: 'weakpassword' },
    });

    fireEvent.submit(screen.getByRole('button', { name: 'Reset Password' }));

    await waitFor(() => {
      expect(
        screen.getByText(
          'Password must contain at least 1 special character, 1 number, and 1 capital letter.'
        )
      ).toBeInTheDocument();
      expect(axiosInstance.post).not.toHaveBeenCalled();
    });
  });

  test('displays appropriate error message on API failure', async () => {
    (axiosInstance.post as jest.Mock).mockRejectedValueOnce({
      message: 'Internal Server Error',
    });

    render(<Reset onCloseDialog={() => {}} />);

    fireEvent.change(screen.getByLabelText('Old Password:'), {
      target: { value: 'oldPassword123' },
    });
    fireEvent.change(screen.getByLabelText('New Password:'), {
      target: { value: 'NewPassword123!' },
    });
    fireEvent.change(screen.getByLabelText('Confirm New Password:'), {
      target: { value: 'NewPassword123!' },
    });

    fireEvent.submit(screen.getByRole('button', { name: 'Reset Password' }));

    await waitFor(() => {
      expect(
        screen.getByText('An error occurred. Please try again.')
      ).toBeInTheDocument();
    });
  });

  test('resets form and closes dialog on successful password reset', async () => {
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({
      status: 200,
      data: { message: 'Password reset successful.' },
    });

    const onCloseDialogMock = jest.fn();

    render(<Reset onCloseDialog={onCloseDialogMock} />);

    fireEvent.change(screen.getByLabelText('Old Password:'), {
      target: { value: 'oldPassword123' },
    });
    fireEvent.change(screen.getByLabelText('New Password:'), {
      target: { value: 'NewPassword123!' },
    });
    fireEvent.change(screen.getByLabelText('Confirm New Password:'), {
      target: { value: 'NewPassword123!' },
    });

    fireEvent.submit(screen.getByRole('button', { name: 'Reset Password' }));

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('/auth/reset-password', {
        oldPassword: 'oldPassword123',
        newPassword: 'NewPassword123!',
        userId: 'testUserId',
      });

      expect(
        screen.getByText('Password reset successful.')
      ).toBeInTheDocument();
      setTimeout(() => {
        expect(screen.queryByLabelText('Old Password:')).toBe('');
        expect(screen.queryByLabelText('New Password:')).toBe('');
        expect(screen.queryByLabelText('Confirm New Pasword:')).toBe('');
        expect(
          screen.queryByText('Password reset successful.')
        ).not.toBeInTheDocument();
        expect(onCloseDialogMock).toHaveBeenCalled();
      }, 1000);
    });
  });
});
