/**
 * Axios Instance Configuration
 * Centralized HTTP client with interceptors
 */

import axios, { AxiosError } from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from '@config/apiConfig';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    if (config.params) {
      config.params._t = Date.now();
    } else {
      config.params = { _t: Date.now() };
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log('[API Request]', {
        method: config.method?.toUpperCase(),
        url: config.url,
        params: config.params,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log('[API Response]', {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  (error: AxiosError) => {
    // Handle errors globally
    const errorMessage = handleAPIError(error);

    console.error('[API Response Error]', {
      url: error.config?.url,
      status: error.response?.status,
      message: errorMessage,
    });

    return Promise.reject(error);
  }
);

// Error handler
function handleAPIError(error: AxiosError): string {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const data: any = error.response.data;

    switch (status) {
      case 400:
        return data?.message || 'Bad request';
      case 401:
        return 'Unauthorized';
      case 403:
        return 'Forbidden';
      case 404:
        return 'Resource not found';
      case 500:
        return 'Internal server error';
      case 503:
        return 'Service unavailable';
      default:
        return data?.message || `Error: ${status}`;
    }
  } else if (error.request) {
    // Request made but no response
    return 'No response from server. Please check your connection.';
  } else {
    // Error in request setup
    return error.message || 'An error occurred';
  }
}

// Generic API call wrapper
export async function apiCall<T = any>(
  config: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export default axiosInstance;
