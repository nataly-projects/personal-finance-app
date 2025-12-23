import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const API = axios.create({ baseURL: "http://localhost:5001/api" });

const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?Z$/;

function isIsoDateString(value: any): boolean {
  return value && typeof value === 'string' && isoDateFormat.test(value);
}

function handleDates(body: any) {
  if (body === null || body === undefined || typeof body !== 'object') return body;

  for (const key of Object.keys(body)) {
    const value = body[key];
    if (isIsoDateString(value)) {
      body[key] = new Date(value); 
    } else if (typeof value === 'object') {
      handleDates(value); 
    }
  }
}

interface ApiErrorResponse {
  message: string;
  stack?: string | null;
}

API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response: AxiosResponse) => {
    handleDates(response.data);
    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
    console.error(`[API Error]: ${errorMessage}`);

    return Promise.reject(error);
  }
);

export default API;
