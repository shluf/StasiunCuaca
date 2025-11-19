/**
 * Weather API Service
 * Open-Meteo API integration (Free, no API key required)
 * Reference: https://open-meteo.com/en/docs
 */

import axios from 'axios';
import { WEATHER_API_CONFIG, API_ENDPOINTS, DEFAULT_LOCATION } from '@config/apiConfig';
import { wmoCodeToCondition, getWeatherEmojiFromWMO } from '@/utils/helpers/wmoCodeHelper';

// Create separate axios instance for weather API
const weatherAPI = axios.create({
  baseURL: WEATHER_API_CONFIG.baseURL,
  timeout: WEATHER_API_CONFIG.timeout,
});

/**
 * Open-Meteo API Response Types
 */
interface OpenMeteoCurrentResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
    rain: number;
    showers: number;
    is_day: number;
  };
}

interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    cloud_cover: number[];
    weather_code: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
    precipitation_sum: number[];
  };
}

/**
 * Normalized Weather Types for Frontend
 */
export interface WeatherCurrent {
  temperature: number;
  humidity: number;
  weatherCode: number;
  weatherMain: string;
  weatherDescription: string;
  weatherIcon: string;
  rain: number;
  isDay: boolean;
  timestamp: string;
}

export interface WeatherForecastDay {
  date: string;
  weatherCode: number;
  weatherMain: string;
  weatherDescription: string;
  weatherIcon: string;
  tempMax: number;
  tempMin: number;
  precipitation: number;
  sunrise: string;
  sunset: string;
}

export interface WeatherForecast {
  daily: WeatherForecastDay[];
  hourly: {
    time: string[];
    temperature: number[];
    humidity: number[];
    cloudCover: number[];
    weatherCode: number[];
  };
}

/**
 * Get current weather data from Open-Meteo
 */
export async function getCurrentWeather(
  lat: number = DEFAULT_LOCATION.lat,
  lon: number = DEFAULT_LOCATION.lon
): Promise<WeatherCurrent> {
  try {
    const response = await weatherAPI.get<OpenMeteoCurrentResponse>(
      API_ENDPOINTS.WEATHER_CURRENT(lat, lon)
    );

    const { current } = response.data;
    const isDay = current.is_day === 1;
    const condition = wmoCodeToCondition(current.weather_code, isDay);

    return {
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      weatherCode: current.weather_code,
      weatherMain: condition.main,
      weatherDescription: condition.description,
      weatherIcon: condition.icon,
      rain: current.rain + current.showers,
      isDay,
      timestamp: current.time,
    };
  } catch (error) {
    console.error('[Weather API] Failed to fetch current weather:', error);
    throw error;
  }
}

/**
 * Get weather forecast from Open-Meteo
 */
export async function getWeatherForecast(
  lat: number = DEFAULT_LOCATION.lat,
  lon: number = DEFAULT_LOCATION.lon
): Promise<WeatherForecast> {
  try {
    const response = await weatherAPI.get<OpenMeteoForecastResponse>(
      API_ENDPOINTS.WEATHER_FORECAST(lat, lon)
    );

    const { daily, hourly } = response.data;

    // Process daily forecast
    const dailyForecast: WeatherForecastDay[] = daily.time.map((time, index) => {
      const condition = wmoCodeToCondition(daily.weather_code[index], true);

      return {
        date: time,
        weatherCode: daily.weather_code[index],
        weatherMain: condition.main,
        weatherDescription: condition.description,
        weatherIcon: condition.icon,
        tempMax: daily.temperature_2m_max[index],
        tempMin: daily.temperature_2m_min[index],
        precipitation: daily.precipitation_sum[index],
        sunrise: daily.sunrise[index],
        sunset: daily.sunset[index],
      };
    });

    return {
      daily: dailyForecast,
      hourly: {
        time: hourly.time,
        temperature: hourly.temperature_2m,
        humidity: hourly.relative_humidity_2m,
        cloudCover: hourly.cloud_cover,
        weatherCode: hourly.weather_code,
      },
    };
  } catch (error) {
    console.error('[Weather API] Failed to fetch forecast:', error);
    throw error;
  }
}

/**
 * Get weather emoji from WMO code
 */
export function getWeatherEmoji(weatherCode: number, isDay: boolean = true): string {
  return getWeatherEmojiFromWMO(weatherCode, isDay);
}

/**
 * Get weather description from WMO code
 */
export function getWeatherDescription(weatherCode: number, isDay: boolean = true): string {
  return wmoCodeToCondition(weatherCode, isDay).description;
}
