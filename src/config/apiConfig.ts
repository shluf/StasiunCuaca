import { API_BASE_URL } from './constants';

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
};

// Open-Meteo API Configuration (Free, no API key required)
export const WEATHER_API_CONFIG = {
  baseURL: 'https://api.open-meteo.com/v1',
  timeout: 10000,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Sensor Endpoints
  SENSORS: '/api/sensors',
  SENSOR_BY_ID: (id: string) => `/api/sensors/${id}`,
  SENSOR_READINGS: '/api/sensors/readings',
  SENSOR_HISTORY: '/api/sensors/history',

  // Weather Endpoints (Open-Meteo API - Free)
  WEATHER_CURRENT: (lat: number, lon: number) =>
    `/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,rain,showers,is_day&timezone=auto`,

  WEATHER_FORECAST: (lat: number, lon: number) =>
    `/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,cloud_cover,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum&timezone=auto&forecast_days=7`,
} as const;

// Default coordinates (Yogyakarta, Indonesia - sesuai dengan contoh Open-Meteo)
export const DEFAULT_LOCATION = {
  lat: -7.7156,
  lon: 110.3556,
  name: 'Yogyakarta',
};
