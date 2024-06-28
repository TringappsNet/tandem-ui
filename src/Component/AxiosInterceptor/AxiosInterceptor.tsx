import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.1.77:3008/api', 
});


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
