import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axiosInstance from '../../AxiosInterceptor/AxiosInterceptor';
import SiteGrid from './site-grid';

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
    axiosInstance.get.mockResolvedValueOnce({
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

  test('adds a new site', async () => {
    axiosInstance.post.mockResolvedValueOnce({
      data: {
        id: 2,
        addressline1: '456 Elm St',
        addressline2: '',
        city: 'Springfield',
        state: 'IL',
        country: 'USA',
        zipcode: '62705',
        isNew: true,
        createdBy: 1,
      },
    });

    const { getByText, getByLabelText } = render(<SiteGrid />);
    fireEvent.click(getByText('Add'));
    fireEvent.change(getByLabelText('addressline1'), { target: { value: '456 Elm St' } });
    fireEvent.change(getByLabelText('city'), { target: { value: 'Springfield' } });
    fireEvent.change(getByLabelText('state'), { target: { value: 'IL' } });
    fireEvent.change(getByLabelText('country'), { target: { value: 'USA' } });
    fireEvent.change(getByLabelText('zipcode'), { target: { value: '62705' } });
    fireEvent.click(getByText('Add'));

    await waitFor(() => {
      expect(getByText('456 Elm St')).toBeInTheDocument();
    });
  });

  test('edits an existing site', async () => {
    axiosInstance.get.mockResolvedValueOnce({
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

    const { getByText, getByLabelText } = render(<SiteGrid />);
    await waitFor(() => {
      expect(getByText('123 Main St')).toBeInTheDocument();
    });

    fireEvent.click(getByText('Edit'));
    fireEvent.change(getByLabelText('addressline1'), { target: { value: '789 Oak St' } });
    fireEvent.click(getByText('Update'));

    await waitFor(() => {
      expect(getByText('789 Oak St')).toBeInTheDocument();
    });
  });

  test('deletes a site', async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: [
        {
          id: 1,
          addressline1: 'Address 1',
          addressline2: 'Address 2',
          city: 'Chennai',
          state: 'TN',
          country: 'INDIA',
          zipcode: '62704',
          isNew: false,
          createdBy: 1,
        },
      ],
    });

    axiosInstance.delete.mockResolvedValueOnce({});

    const { getByText, getByLabelText, queryByText } = render(<SiteGrid />);
    await waitFor(() => {
      expect(getByText('address')).toBeInTheDocument();
    });

    fireEvent.click(getByText('Delete'));

    await waitFor(() => {
      expect(queryByText('address')).not.toBeInTheDocument();
    });
  });
});
