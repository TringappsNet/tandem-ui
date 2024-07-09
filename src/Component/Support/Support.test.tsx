import { render, fireEvent, waitFor } from '@testing-library/react';
import Support from './Support';
import { Provider } from 'react-redux';
import store from '../Redux/store';
import axiosInstance from '../AxiosInterceptor/AxiosInterceptor';

jest.mock('../AxiosInterceptor/AxiosInterceptor', () => ({
    post: jest.fn(),
  })); 

describe('Support Component', () => {
    test('renders without crashing', () => {
        render(<Provider store={store}><Support /></Provider>);
    });

    test('handles form submission successfully', async () => {
        const { getByText, getByLabelText } = render(<Provider store={store}><Support /></Provider>);

        (axiosInstance.post as jest.Mock).mockResolvedValueOnce({ status: 200 });

        fireEvent.change(getByLabelText('Subject:'), { target: { value: 'Test Subject' } });
        fireEvent.change(getByLabelText('Description:'), { target: { value: 'Test Description' } });
        fireEvent.click(getByText('Send'));

        await (() => {
            expect(getByText('Ticket raised successfully!')).toBeInTheDocument();
        });
    });

    test('handles form submission failure', async () => {
        const { getByText, getByLabelText } = render(<Provider store={store}><Support /></Provider>);

       
        (axiosInstance.post as jest.Mock).mockRejectedValueOnce(new Error('Failed to raise ticket'));

        fireEvent.change(getByLabelText('Subject:'), { target: { value: 'Test Subject' } });
        fireEvent.change(getByLabelText('Description:'), { target: { value: 'Test Description' } });
        fireEvent.click(getByText('Send'));

        await (() => {
            expect(getByText('Failed to raise ticket. Please try again.')).toBeInTheDocument();
        });
    });

    test('handles user not logged in', async () => {
        const { getByText } =render(<Provider store={store}><Support /></Provider>);
        fireEvent.click(getByText('Send'));
        expect(getByText('User not logged in. Please log in to raise a ticket.')).toBeInTheDocument();
    });
    test('clears form fields after successful submission', async () => {
        const { getByLabelText, getByText } = render(<Provider store={store}><Support /></Provider>);
    
        (axiosInstance.post as jest.Mock).mockResolvedValueOnce({ status: 200 });
    
        fireEvent.change(getByLabelText('Subject:'), { target: { value: 'Test Subject' } });
        fireEvent.change(getByLabelText('Description:'), { target: { value: 'Test Description' } });
    
        fireEvent.click(getByText('Send'));
        await (() => {
            expect(getByText('Ticket raised successfully!')).toBeInTheDocument();
        });
    });
    

});
