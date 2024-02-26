// axiosConfig.js interceptor

import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://43.218.87.110:8080', 
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userLogin')?.token;

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
