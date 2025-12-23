export const APP_NAME = 'StasiunCuaca';
export const APP_VERSION = '1.0.0';

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:3000/ws';
export const WEATHER_API_URL = import.meta.env.VITE_WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5';
export const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || '';

// Feature Flags
export const ENABLE_NOTIFICATIONS = import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true';
export const ENABLE_ONBOARDING = import.meta.env.VITE_ENABLE_ONBOARDING === 'true';
export const ENABLE_DARK_MODE = import.meta.env.VITE_ENABLE_DARK_MODE === 'true';

// Default Settings
export const DEFAULT_LANGUAGE = import.meta.env.VITE_DEFAULT_LANGUAGE || 'id';
export const DEFAULT_THEME = 'light';
export const DEFAULT_FONT_SIZE = 'medium';

// LocalStorage Keys
export const STORAGE_KEYS = {
  THEME: 'stasiun-cuaca-theme',
  LANGUAGE: 'stasiun-cuaca-language',
  FONT_SIZE: 'stasiun-cuaca-font-size',
  ONBOARDING: 'stasiun-cuaca-onboarding',
  ONBOARDING_COMPLETE: 'stasiun-cuaca-onboarding-complete',
  FEATURE_TOUR_COMPLETE: 'stasiun-cuaca-feature-tour-complete',
  SETTINGS: 'stasiun-cuaca-settings',
} as const;

// Breakpoints (matching Tailwind config)
export const BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Update Intervals (in milliseconds)
export const UPDATE_INTERVALS = {
  SENSOR_DATA: 5000,      // 5 seconds
  WEATHER_FORECAST: 300000, // 5 minutes
  HISTORY_DATA: 60000,    // 1 minute
} as const;
