import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ocm.alo123.net/api';

const Axios: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
Axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Only access localStorage on client-side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
Axios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Only handle client-side errors
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('currentUser');
      window.location.href = '/pos';
    }
    return Promise.reject(error);
  }
);

export default Axios;
