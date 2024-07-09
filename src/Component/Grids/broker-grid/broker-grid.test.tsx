import { render} from '@testing-library/react';
import '@testing-library/jest-dom';
import {axiosInstance} from '../../AxiosInterceptor/AxiosInterceptor';
import BrokerGrid from './BrokerGrid';

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
          firstName: 'fname',
          lastName: 'lname',
        },
      ],
    };

    (axiosInstance.get as jest.Mock).mockResolvedValueOnce(mockedResponse);

    const { getByText } = render(<BrokerGrid />);

    await (() => {
      expect(getByText('fname lname')).toBeInTheDocument();
    });
  });
});
