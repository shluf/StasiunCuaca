/**
 * Open Meteo API Service
 * Fetches weather forecast data from Open Meteo API
 * Free API, no key required
 */

import axios from 'axios';

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1';

export interface HourlyForecast {
  time: string;
  temperature: number;
  humidity: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
}

export interface DailyForecast {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  precipitation: number;
  weatherCode: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  windSpeedMax: number;
}

export interface ForecastData {
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  current: {
    temperature: number;
    weatherCode: number;
    windSpeed: number;
    windDirection: number;
  };
}

/**
 * Fetch weather forecast from Open Meteo API
 * @param latitude - Location latitude
 * @param longitude - Location longitude
 * @returns Promise with forecast data
 */
export async function fetchForecast(
  latitude: number = -6.2088, // Default: Jakarta
  longitude: number = 106.8456
): Promise<ForecastData> {
  try {
    const response = await axios.get(`${OPEN_METEO_BASE_URL}/forecast`, {
      params: {
        latitude,
        longitude,
        hourly: 'temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset,uv_index_max,wind_speed_10m_max',
        current: 'temperature_2m,weather_code,wind_speed_10m,wind_direction_10m',
        timezone: 'auto',
        forecast_days: 7,
      },
    });

    const { hourly, daily, current } = response.data;

    // Parse hourly forecast (next 24 hours)
    const hourlyForecast: HourlyForecast[] = hourly.time.slice(0, 24).map((time: string, index: number) => ({
      time,
      temperature: hourly.temperature_2m[index],
      humidity: hourly.relative_humidity_2m[index],
      precipitation: hourly.precipitation[index],
      weatherCode: hourly.weather_code[index],
      windSpeed: hourly.wind_speed_10m[index],
      windDirection: hourly.wind_direction_10m[index],
    }));

    // Parse daily forecast
    const dailyForecast: DailyForecast[] = daily.time.map((date: string, index: number) => ({
      date,
      temperatureMax: daily.temperature_2m_max[index],
      temperatureMin: daily.temperature_2m_min[index],
      precipitation: daily.precipitation_sum[index],
      weatherCode: daily.weather_code[index],
      sunrise: daily.sunrise[index],
      sunset: daily.sunset[index],
      uvIndexMax: daily.uv_index_max[index],
      windSpeedMax: daily.wind_speed_10m_max[index],
    }));

    return {
      hourly: hourlyForecast,
      daily: dailyForecast,
      current: {
        temperature: current.temperature_2m,
        weatherCode: current.weather_code,
        windSpeed: current.wind_speed_10m,
        windDirection: current.wind_direction_10m,
      },
    };
  } catch (error) {
    console.error('Error fetching Open Meteo forecast:', error);
    throw new Error('Failed to fetch weather forecast');
  }
}

/**
 * Get weather condition description from WMO weather code
 * https://open-meteo.com/en/docs
 */
export function getWeatherCondition(code: number): string {
  const conditions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };

  return conditions[code] || 'Unknown';
}

/**
 * Get icon type from weather code
 */
export function getWeatherIcon(code: number): 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'stormy' {
  if (code === 0 || code === 1) return 'sunny';
  if (code === 2) return 'partly-cloudy';
  if (code === 3 || code === 45 || code === 48) return 'cloudy';
  if (code >= 51 && code <= 82) return 'rainy';
  if (code >= 95) return 'stormy';
  return 'cloudy';
}
