import { render, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import axiosInstance from '../AxiosInterceptor/AxiosInterceptor';
import DealForm from './Milestone';
import store from '../Redux/store';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('../AxiosInterceptor/AxiosInterceptor', () => ({
  get: jest.fn(),
}));

describe('DealForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders DealForm ', () => {
    const { getByText } = render(<Provider store={store}><Router><DealForm /></Router></Provider>);
    expect(getByText('Save')).toBeInTheDocument();
  });

  test('go to next step on Next button click', async () => {
    const { getByText } = render(<Provider store={store}><Router><DealForm /></Router></Provider>);
    fireEvent.click(getByText('Next'));
    await waitFor(() => {
      expect(getByText('Save')).toBeInTheDocument();
    });
  });
  test('handles back button click', async () => {
    const { getByText } = render(<Provider store={store}><Router><DealForm /></Router></Provider>);
    fireEvent.click(getByText('Next'));
    fireEvent.click(getByText('Back'));
    await (() => {
      expect(getByText('Deal is Completed')).toBeInTheDocument();
    });
  });

  test('fetches broker and site options correctly', async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: [{ user: { firstName: 'John', lastName: 'Doe' } }],
    });

    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: [{ addressline1: '123 Main St', addressline2: '' }],
    });

    render(
      <Provider store={store}>
        <DealForm />
      </Provider>
    );

    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith('/brokers');
    });
  });
  test('displays completion message after finishing all steps', async () => {
    const { getByText } = render(<Provider store={store}><Router><DealForm /></Router></Provider>);
    fireEvent.click(getByText('Next'));
    fireEvent.click(getByText('Next'));
    fireEvent.click(getByText('Next'));
    fireEvent.click(getByText('Next'));
    fireEvent.click(getByText('Next'));
    fireEvent.click(getByText('Next'));

    await (() => {
    expect(getByText('Deal is Completed')).toBeInTheDocument();
    });
  });
});
