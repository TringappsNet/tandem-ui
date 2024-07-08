import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axiosInstance from '../AxiosInterceptor/AxiosInterceptor';
import Main from './Main';


jest.mock('../AxiosInterceptor/AxiosInterceptor', () => ({
  get: jest.fn()
})); 

const mockedAxiosInstance = axiosInstance.get as jest.MockedFunction<typeof axiosInstance.get>;


jest.mock('../Grids/broker-grid/broker-grid', () => () => <div>BrokerGrid</div>);

describe('Main', () => {
  const mockDealData = {
    totalDeals: 100,
    dealsOpened: 25,
    dealsInProgress: 50,
    dealsClosed: 25,
    totalCommission: 5000,
  };

  beforeEach(() => {
    mockedAxiosInstance.mockResolvedValue({ data: mockDealData });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('fetches deal data', async () => {
    render(<Main />);

    expect(screen.getByText('Brokers')).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText('Total Deals: 100')).toBeInTheDocument());

    expect(screen.getByText('Deals Opened: 25')).toBeInTheDocument();
    expect(screen.getByText('Deals In Progress: 50')).toBeInTheDocument();
    expect(screen.getByText('Deals Closed: 25')).toBeInTheDocument();
    expect(screen.getByText('Total Commission: 5000')).toBeInTheDocument();
  });

  test('handles API error gracefully', async () => {
    mockedAxiosInstance.mockRejectedValue(new Error('Error fetching deals'));

    render(<Main />);

    await waitFor(() => expect(mockedAxiosInstance).toHaveBeenCalledTimes(1));

    expect(screen.getByText('Brokers')).toBeInTheDocument();
    expect(screen.queryByText('Total Deals:')).not.toBeInTheDocument();
  });
});
