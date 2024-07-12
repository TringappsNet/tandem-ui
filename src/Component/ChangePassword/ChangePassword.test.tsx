import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChangePassword from './ChangePassword';
import { axiosInstance } from '../AxiosInterceptor/AxiosInterceptor';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../AxiosInterceptor/AxiosInterceptor', () => ({
  axiosInstance: {
    post: jest.fn(),
  },
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('ChangePassword', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <ChangePassword />
      </BrowserRouter>
    );
  });
  test('validates password correctly', async () => {
    render(<ChangePassword />);

    const passwordInputs = screen.queryAllByPlaceholderText(
      'Enter your password'
    );
    const passwordInput = passwordInputs[0];

    fireEvent.change(passwordInput, { target: { value: '' } });

    await (() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    fireEvent.change(passwordInput, { target: { value: 'short' } });
    await waitFor(() => {
      expect(
        screen.getByText(/password should be at least 8 characters long/i)
      ).toBeInTheDocument();
    });

    fireEvent.change(passwordInput, { target: { value: 'longenough' } });
    await waitFor(() => {
      expect(
        screen.getByText(
          /password should contain at least one special character/i
        )
      ).toBeInTheDocument();
    });

    fireEvent.change(passwordInput, { target: { value: 'LongEnough1' } });
    await waitFor(() => {
      expect(
        screen.getByText(
          /password should contain at least one special character/i
        )
      ).toBeInTheDocument();
    });

    fireEvent.change(passwordInput, { target: { value: 'LongEnough1!' } });
    await waitFor(() => {
      expect(
        screen.queryByText(
          /password should contain at least one special character/i
        )
      ).not.toBeInTheDocument();
      expect(
        screen.getByText(
          /password should contain at least two numerical digits/i
        )
      ).toBeInTheDocument();
    });

    fireEvent.change(passwordInput, { target: { value: 'LongEnough12!' } });
    await waitFor(() => {
      expect(
        screen.queryByText(
          /password should contain at least two numerical digits/i
        )
      ).not.toBeInTheDocument();
    });
  });
  test('validates confirm password correctly', async () => {
    render(<ChangePassword />);
    const confirmPasswordInputs = screen.queryAllByPlaceholderText(
      'Confirm your password'
    );

    confirmPasswordInputs.forEach((confirmPasswordInput) => {
      fireEvent.change(confirmPasswordInput, { target: { value: '' } });
      waitFor(() => {
        expect(
          screen.getByText(/password field cannot be empty/i)
        ).toBeInTheDocument();
      });

      fireEvent.change(confirmPasswordInput, {
        target: { value: 'DifferentPassword12!' },
      });
      waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
      fireEvent.change(confirmPasswordInput, {
        target: { value: 'ValidPassword12!' },
      });
      waitFor(() => {
        expect(
          screen.queryByText(/passwords do not match/i)
        ).toBeInTheDocument();
      });
    });
  });

  test('handles validation correctly', () => {
    fireEvent.submit(screen.getByRole('button', { name: /Reset Password/i }));

    expect(
      screen.getByText('Please enter values in all fields.')
    ).toBeInTheDocument();

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const confirmPasswordInput = screen.getByPlaceholderText(
      'Confirm your password'
    );

    fireEvent.change(passwordInput, { target: { value: 'ValidPassword12!' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'ValidPassword12!' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /Reset Password/i }));
    expect(
      screen.queryByText('Please enter values in all fields.')
    ).not.toBeInTheDocument();
  });

  test('submits form successfully', async () => {
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const confirmPasswordInput = screen.getByPlaceholderText(
      'Confirm your password'
    );

    fireEvent.change(passwordInput, { target: { value: 'ValidPassword12!' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'ValidPassword12!' },
    });

    (axiosInstance.post as jest.Mock).mockResolvedValue({ data: {} });

    fireEvent.submit(screen.getByRole('button', { name: /Reset Password/i }));

    await waitFor(() =>
      expect(axiosInstance.post).toHaveBeenCalledWith('auth/change-password', {
        newPassword: 'ValidPassword12!',
      })
    );
    expect(
      screen.getByText('Password changed successfully!')
    ).toBeInTheDocument();
  });

  test('handles submit failure', async () => {
    render(<ChangePassword />);

    const passwordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');

    fireEvent.change(passwordInput, { target: { value: 'ValidPassword12!' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'ValidPassword12!' },
    });

    (axiosInstance.post as jest.Mock).mockRejectedValue(
      new Error('Failed to change password.')
    );

    const resetPasswordButtons = screen.queryAllByRole('button', {
      name: /Reset Password/i,
    });
    expect(resetPasswordButtons.length).toBeGreaterThan(0);
    fireEvent.click(resetPasswordButtons[0]);

    await waitFor(() =>
      expect(axiosInstance.post).toHaveBeenCalledWith('auth/change-password', {
        newPassword: 'ValidPassword12!',
      })
    );
    await waitFor(() => {
      expect(
        screen.getByText('Failed to change password. Please try again.')
      ).toBeInTheDocument();
    });
  });
});
