import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axiosInstance from '../../AxiosInterceptor/AxiosInterceptor';
import SiteGrid from './site-grid';
import userEvent from '@testing-library/user-event';

jest.mock('../../AxiosInterceptor/AxiosInterceptor', () => ({
    post: jest.fn(),
    get:jest.fn(),

  }));

describe('SiteGrid Component', () => {
  test('renders SiteGrid component', () => {
    const { getByText } = render(<SiteGrid />);
    expect(getByText('Add')).toBeInTheDocument();
  });

  test('opens dialog on add button click', () => {
    const { getByText, getByLabelText } = render(<SiteGrid />);
    fireEvent.click(getByText('Add'));
    expect(getByLabelText('addressline1')).toBeInTheDocument();
  });

  test('fetches and displays sites', async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: [
        {
          id: 1,
          addressline1: '123 Main St',
          addressline2: 'Apt 4',
          city: 'Springfield',
          state: 'IL',
          country: 'USA',
          zipcode: '62704',
          isNew: false,
          createdBy: 1,
        },
      ],
    });

    const { getByText } = render(<SiteGrid />);
    await waitFor(() => {
      expect(getByText('123 Main St')).toBeInTheDocument();
    });
  });

});
