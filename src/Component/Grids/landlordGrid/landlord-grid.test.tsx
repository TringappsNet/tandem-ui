import { render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import LandlordGrid from './Landlord';
import {axiosInstance} from '../../AxiosInterceptor/AxiosInterceptor';


jest.mock('../../AxiosInterceptor/AxiosInterceptor', () => ({
    post: jest.fn(),
    get:jest.fn(),
    delete:jest.fn(),
  }));

describe('LandlordGrid ', () => {
  test('renders LandlordGrid and fetches landlord', async () => {
    const landlords = [
      { id: 1, name: 'name', phoneNumber: '1234567890', email: 'name@gmail.com', address1: '123 Main St', address2: '', city: 'City', state: 'State', country: 'Country', zipcode: '12345' },
    ];

   (axiosInstance.get as jest.Mock).mockResolvedValueOnce({ data: landlords });

    render(<LandlordGrid />);
  });

  test('displays a message when no landlords are fetched', async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({ data: [] });

    render(<LandlordGrid />);

    await (() => {
      expect(screen.getByText('No landlords found')).toBeInTheDocument();
    });
  });

  test('deletes a landlord when delete button is clicked', async () => {
    const landlords = [
      { id: 1, name: 'name', phoneNumber: '1234567890', email: 'name@example.com', address1: '123 Main St', address2: '', city: 'City', state: 'State', country: 'Country', zipcode: '12345' },
    ];

    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({ data: landlords });
    (axiosInstance.delete as jest.Mock).mockResolvedValueOnce({ status: 200 });

    render(<LandlordGrid />);

    await(() => {
      expect(screen.getByText('name')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('delete-landlord-1'));

      expect(screen.getByText('Are you sure you want to delete John Doe?')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Confirm'));

      expect(screen.queryByText('name')).not.toBeInTheDocument();
    });
  });

  test('displays an error message when failed to fetch landlords', async () => {
    (axiosInstance.get as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch landlords'));

    render(<LandlordGrid />);

    await (() => {
      expect(screen.getByText(/Failed/i)).toBeInTheDocument();
    });
  });
});
