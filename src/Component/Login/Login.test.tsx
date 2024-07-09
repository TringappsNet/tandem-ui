import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {axiosInstance} from '../AxiosInterceptor/AxiosInterceptor';
import Login from './Login';
import { Provider } from 'react-redux';
import store from '../Redux/store';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('../AxiosInterceptor/AxiosInterceptor', () => ({
  post: jest.fn(),
}));

describe('Login Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('successful login', async () => {
    const mockData = {
      data: {
        message: 'Login successful',
        session: { token: 'mockAccessToken' },
        user: { username: 'testuser' },
      },
      status: 200,
    };
    (axiosInstance.post as jest.Mock).mockResolvedValue(mockData);
  
    render(
      <Provider store={store}>
        <Router>
          <Login />
        </Router>
      </Provider>
    );
  
    fireEvent.change(screen.getByPlaceholderText('Enter email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter password'), { target: { value: 'password123' } });
  
    fireEvent.click(screen.getByText('Sign In'));
  
    await waitFor(() => {
      expect(screen.getByText(/successfully/i)).toBeInTheDocument();
    });
  });
  
  it('unsuccessful login - invalid email', async () => {
    render(
      <Provider store={store}>
        <Router>
          <Login />
        </Router>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter email'), { target: { value: 'email' } });
    fireEvent.change(screen.getByPlaceholderText('Enter password'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
    });

    expect(screen.queryByText(/successfully/i)).toBeNull();
  });

  it('unsuccessful login - both email and password empty', async () => {
    render(
      <Provider store={store}>
        <Router>
          <Login />
        </Router>
      </Provider>
    );
    fireEvent.change(screen.getByPlaceholderText('Enter email'), { target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText('Enter password'), { target: { value: '' } });
    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(screen.getByText(/Please Enter all the field/i)).toBeInTheDocument();
    });

    expect(screen.queryByText(/successfully/i)).toBeNull();
  });

  it('unsuccessful login - empty password', async () => {
    render(
      <Provider store={store}>
        <Router>
          <Login />
        </Router>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter email'), { target: { value: 'test@email.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter password'), { target: { value: '' } });

    await (() => {
      expect(screen.getByText(/Password cannot be empty/i)).toBeInTheDocument();
    });

    expect(screen.queryByText(/successfully/i)).toBeNull();
  });
  it('unsuccessful login - empty password', async () => {
    render(
      <Provider store={store}>
        <Router>
          <Login />
        </Router>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter email'), { target: { value: 'test@email.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter password'), { target: { value: '' } });

    await (() => {
      expect(screen.getByText(/Email cannot be empty/i)).toBeInTheDocument();
    });

    expect(screen.queryByText(/successfully/i)).toBeNull();
  });
});
