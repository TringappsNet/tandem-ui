import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.1.223:3008/api',
  // baseURL: 'http://localhost:3008/api',
});

// Function to get query parameters from the URL
const getQueryParam = (param: string) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

// Request interceptor to add userId, token, and resetToken to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const session = JSON.parse(localStorage.getItem('session') || '{}');
    const userId = user.id;
    const token = session.token;
    const resetToken = getQueryParam('resetToken');

    if (userId && token) {
      config.headers['userId'] = userId;
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (resetToken) {
      config.headers['resetToken'] = resetToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;