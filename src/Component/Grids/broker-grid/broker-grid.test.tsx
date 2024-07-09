import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axiosInstance from '../../AxiosInterceptor/AxiosInterceptor';
import BrokerGrid from './broker-grid';

jest.mock('../../AxiosInterceptor/AxiosInterceptor', () => ({
    post: jest.fn(),
    get:jest.fn(),
    put:jest.fn(),
  }));

describe('BrokerGrid Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders BrokerGrid component', () => {
    render(<BrokerGrid />);
  });
  test('displays brokers data correctly', async () => {
    const mockedResponse = {
      data: [
        {
          id: 1,
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          mobile: '1234567890',
          address: '123 Elm St',
          city: 'Springfield',
          state: 'IL',
          country: 'USA',
          zipcode: '62704',
          isActive: true,
        },
      ],
    };

    (axiosInstance.get as jest.Mock).mockResolvedValueOnce(mockedResponse);

    const { getByText } = render(<BrokerGrid />);

    await (() => {
      expect(getByText('John Doe')).toBeInTheDocument();
    });
  });
});
