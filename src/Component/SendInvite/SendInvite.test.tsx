import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axiosInstance from '../AxiosInterceptor/AxiosInterceptor';
import SendInvite from './SendInvite';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('../AxiosInterceptor/AxiosInterceptor', () => ({
    post: jest.fn(),
    get: jest.fn(),
}));

describe('SendInvite', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('submit form successfully', async () => {
        (axiosInstance.post as jest.Mock).mockResolvedValueOnce({ data: { message: 'Invite sent successfully.' } });

        render(
            <Router>
                <SendInvite />
            </Router>);
        const emailInput = screen.getByLabelText(/email/i);
        const roleSelect = screen.getByLabelText(/role/i);
        const submitButton = screen.getByRole('button', { name: /send invite/i });

        fireEvent.change(emailInput, 'test@example.com');
        fireEvent.change(roleSelect, { target: { value: '1' } });
        fireEvent.click(submitButton);


        await waitFor(() => {
            expect(screen.getByText(/invite sent successfully/i)).toBeInTheDocument();
        });
        expect(emailInput).toHaveValue('');
    });

    it('show error when role is not selected', async () => {

        render(
            <Router>
                <SendInvite />
            </Router>);

        const emailInput = screen.getByLabelText(/email/i);
        const submitButton = screen.getByRole('button', { name: /send invite/i });

        fireEvent.change(emailInput,'test@example.com');
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText(/please select a role/i)).toBeInTheDocument();
        });
    });

    it('handle server error', async () => {
        (axiosInstance.post as jest.Mock).mockRejectedValueOnce({ response: { data: { message: 'Server error occurred.' } } });


        render(
            <Router>
                <SendInvite />
            </Router>);

        const emailInput = screen.getByLabelText(/email/i);
        const roleSelect = screen.getByLabelText(/role/i);
        const submitButton = screen.getByRole('button', { name: /send invite/i });

        fireEvent.change(emailInput, 'test@example.com');
        fireEvent.change(roleSelect, { target: { value: '1' } });
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText(/server error occurred/i)).toBeInTheDocument();
        });
    });

    it('disable submit button', async () => {
        (axiosInstance.post as jest.Mock).mockResolvedValueOnce({ data: { message: 'Invite sent successfully.' } });
        render(
            <Router>
                <SendInvite />
            </Router>);

        const emailInput = screen.getByLabelText(/email/i);
        const roleSelect = screen.getByLabelText(/role/i);
        const submitButton = screen.getByRole('button', { name: /send invite/i });

        fireEvent.change(emailInput, 'test@example.com');
        fireEvent.change(roleSelect, { target: { value: '1' } });
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(submitButton).toBeDisabled();
        });

        await waitFor(() => {
            expect(submitButton).toBeEnabled();
        });
    });

    it('fetch roles and dropdown', async () => {
        const mockRoles = [
            { id: 1, roleName: 'Admin' },
            { id: 2, roleName: 'User' },
        ];

        (axiosInstance.get as jest.Mock).mockResolvedValueOnce({ data: mockRoles });

        render(
            <Router>
                <SendInvite />
            </Router>);

        await waitFor(() => {
            const roleOptions = screen.getAllByRole('option');
            expect(roleOptions.length).toBe(mockRoles.length + 1);
            expect(roleOptions[1]).toHaveTextContent('Admin');
            expect(roleOptions[2]).toHaveTextContent('User');
        });
    });

});

