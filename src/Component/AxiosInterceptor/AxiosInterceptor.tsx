import React, { useLayoutEffect, ReactNode, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SnackbarComponent from '../Snackbar/Snackbar';
import styles from './AxiosInterceptor.module.css';

const axiosInstance = axios.create({

  baseURL: "http://localhost:3008/api",
  // baseURL: 'http://192.168.1.47:3008/api',
  // baseURL: 'http://43.205.44.92/api',

});

const getQueryParam = (param: string): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

interface AxiosInterceptorProps {
  children: ReactNode;
}

const AxiosInterceptor: React.FC<AxiosInterceptorProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  useLayoutEffect(() => {
    let requestInterceptor: number;
    let responseInterceptor: number;

    const addInterceptors = () => {
      requestInterceptor = axiosInstance.interceptors.request.use(
        (config) => {
          setIsLoading(true);
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

          return config;
        },
        (error) => {
          setIsLoading(false);
          return Promise.reject(error);
        }
      );
      responseInterceptor = axiosInstance.interceptors.response.use(
        (response) => {
          setIsLoading(false);
          return response;
        },
        (error) => {
          setIsLoading(false);

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
            setTimeout(() => {
              navigate('/login');
            }, 3000);
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
      {isLoading && (
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
        </div>
      )}
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
