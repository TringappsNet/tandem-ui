import React, { useLayoutEffect, ReactNode, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SnackbarComponent from '../Snackbar/Snackbar';

const axiosInstance = axios.create({
  baseURL: 'http://portal.tandeminf.com/api',
});

const getQueryParam = (param: string): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

interface AxiosInterceptorProps {
  children: ReactNode;
}

const AxiosInterceptor: React.FC<AxiosInterceptorProps> = ({ children }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  useLayoutEffect(() => {
    let requestInterceptor: number;
    let responseInterceptor: number;

    const addInterceptors = () => {
      requestInterceptor = axiosInstance.interceptors.request.use(
        (config) => {
          try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const session = JSON.parse(localStorage.getItem('session') || '{}');
            const userId = user.id;
            const token = session.token;
            const resetToken = getQueryParam('resetToken');

            if (userId && token) {
              config.headers['user-id'] = userId;
              config.headers['access-token'] = token;
            }

            if (resetToken) {
              config.headers['resetToken'] = resetToken;
            }
          } catch (error) {
            console.error('Error in request interceptor:', error);
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );

      responseInterceptor = axiosInstance.interceptors.response.use(
        (response) => {
          return response;
        },
        (error) => {
          try {
            const config = error.config;
            const requiresAuth =
              config.headers['user-id'] && config.headers['access-token'];

            if (
              requiresAuth &&
              error.response &&
              (error.response.status === 401 || error.response.status === 403)
            ) {
              setSnackbarMessage('Your session is invalid or expired');
              localStorage.clear();
              setSnackbarOpen(true);
              navigate('/login');
            }
          } catch (interceptorError) {
            console.error('Error in response interceptor:', interceptorError);
          }
          return Promise.reject(error);
        }
      );
    };

    addInterceptors();

    // Cleanup interceptors on component unmount
    return () => {
      if (requestInterceptor) {
        axiosInstance.interceptors.request.eject(requestInterceptor);
      }
      if (responseInterceptor) {
        axiosInstance.interceptors.response.eject(responseInterceptor);
      }
    };
  }, [navigate]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <SnackbarComponent
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
        severity={'error'}
        style={{ backgroundColor: '#DE5242', color: '#FEF9FD' }}
      />
      {children}
    </>
  );
};

export { axiosInstance, AxiosInterceptor };
