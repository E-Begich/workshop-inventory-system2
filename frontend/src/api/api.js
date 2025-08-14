// src/api/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Dodaj interceptor da šalje token automatski
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // token iz localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
