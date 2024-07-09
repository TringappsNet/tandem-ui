import { render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Registration from './Registration';
import axiosInstance from '../AxiosInterceptor/AxiosInterceptor';

jest.mock('../AxiosInterceptor/AxiosInterceptor', () => ({
    post: jest.fn(),
  }));
describe('Registration', () => {
    test('render the registration form', () => {
        render(
            <Router>
                <Registration />
            </Router>
        );

        expect(screen.getByPlaceholderText('Enter your first name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your last name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your address')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your mobile number')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your city')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your state')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your country')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your zipcode')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument();
        expect(screen.getByText('Register')).toBeInTheDocument();
    });

    test('should update state on input change', () => {
        render(
            <Router>
                <Registration />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText('Enter your first name'), { target: { value: 'Fname' } });
        expect(screen.getByPlaceholderText('Enter your first name')).toHaveValue('Fname');

        fireEvent.change(screen.getByPlaceholderText('Enter your last name'), { target: { value: 'Lname' } });
        expect(screen.getByPlaceholderText('Enter your last name')).toHaveValue('Lname');

    });

    test('should show validation error messages', () => {
        render(
            <Router>
                <Registration />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText('Enter your first name'), { target: { value: '' } });
        fireEvent.change(screen.getByPlaceholderText('Enter your last name'), { target: { value: '' } });

        fireEvent.click(screen.getByText('Register'));

        expect(screen.getByPlaceholderText('Enter your first name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your last name')).toBeInTheDocument();
    });

    test('should handle successful form submission', async () => {
        (axiosInstance.post as jest.Mock).mockResolvedValue({ data: { message: 'Registration successful!' } });

        render(
            <Router>
                <Registration />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText('Enter your first name'), { target: { value: 'Fname' } });
        fireEvent.change(screen.getByPlaceholderText('Enter your last name'), { target: { value: 'Lname' } });
        fireEvent.change(screen.getByPlaceholderText('Enter your address'), { target: { value: '7,Street' } });
        fireEvent.change(screen.getByPlaceholderText('Enter your mobile number'), { target: { value: '1234567890' } });
        fireEvent.change(screen.getByPlaceholderText('Enter your city'), { target: { value: 'Chennai' } });
        fireEvent.change(screen.getByPlaceholderText('Enter your state'), { target: { value: 'State' } });
        fireEvent.change(screen.getByPlaceholderText('Enter your country'), { target: { value: 'Country' } });
        fireEvent.change(screen.getByPlaceholderText('Enter your zipcode'), { target: { value: '600000' } });
        fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'Password' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { target: { value: 'Password' } });

        fireEvent.click(screen.getByText('Register'));

        await (() => {
            expect(screen.getByText('Registration successful!')).toBeInTheDocument();
        });
    });

    test('should handle form submission failure due to invalid invite token', async () => {
        (axiosInstance.post as jest.Mock).mockRejectedValue({
            response: {
                status: 400,
                data: { message: 'Invalid invite token. Please check and try again.' }
            }
        });

        render(
            <Router>
                <Registration />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText('Enter your first name'), { target: { value: 'Fname' } });
        fireEvent.change(screen.getByPlaceholderText('Enter your last name'), { target: { value: 'Lname' } });
        fireEvent.change(screen.getByPlaceholderText('Enter your address'), { target: { value: '7,Street' } });
        fireEvent.change(screen.getByPlaceholderText('Enter your mobile number'), { target: { value: '1234567890' } });
        fireEvent.change(screen.getByPlaceholderText('Enter your city'), { target: { value: 'Chennai' } });
        fireEvent.change(screen.getByPlaceholderText('Enter your state'), { target: { value: 'State' } });
        fireEvent.change(screen.getByPlaceholderText('Enter your country'), { target: { value: 'Country' } });
        fireEvent.change(screen.getByPlaceholderText('Enter your zipcode'), { target: { value: '600000' } });
        fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'Password' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { target: { value: 'Password' } });

        fireEvent.click(screen.getByText('Register'));

        await(() => {
            expect(screen.getByText(/Invalid invite token. Please check and try again./i)).toBeInTheDocument();
        });
    });
});
