import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'http://192.168.1.223:3008/api',
  baseURL: 'http://localhost:3008/api',

});

// Request interceptor to add userId and token to headers

axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const session = JSON.parse(localStorage.getItem('session') || '{}');
    const userId = user.id;
    const token = session.token;

    if (userId && token) {
      config.headers['userId'] = userId;
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
