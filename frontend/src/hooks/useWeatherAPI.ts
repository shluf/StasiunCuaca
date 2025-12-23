/**
 * useWeatherAPI Hook
 * External weather forecast API integration
 */

import { useState, useEffect } from 'react';
import { getCurrentWeather, getWeatherForecast } from '@/services/api/weatherAPI';
import type { WeatherCurrent, WeatherForecast } from '@/services/api/weatherAPI';
import { DEFAULT_LOCATION } from '@/config/apiConfig';
import { UPDATE_INTERVALS } from '@/config/constants';

interface UseWeatherAPIReturn {
  current: WeatherCurrent | null;
  forecast: WeatherForecast | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useWeatherAPI(
  lat: number = DEFAULT_LOCATION.lat,
  lon: number = DEFAULT_LOCATION.lon
): UseWeatherAPIReturn {
  const [current, setCurrent] = useState<WeatherCurrent | null>(null);
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [currentData, forecastData] = await Promise.all([
        getCurrentWeather(lat, lon),
        getWeatherForecast(lat, lon),
      ]);

      setCurrent(currentData);
      setForecast(forecastData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
      console.error('[useWeatherAPI] Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();

    // Auto-refresh weather data every 5 minutes
    const interval = setInterval(() => {
      fetchWeatherData();
    }, UPDATE_INTERVALS.WEATHER_FORECAST);

    return () => clearInterval(interval);
  }, [lat, lon]);

  return {
    current,
    forecast,
    isLoading,
    error,
    refetch: fetchWeatherData,
  };
}

// Hook for just current weather (lighter)
export function useCurrentWeather(
  lat: number = DEFAULT_LOCATION.lat,
  lon: number = DEFAULT_LOCATION.lon
) {
  const [current, setCurrent] = useState<WeatherCurrent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchCurrent = async () => {
      try {
        setIsLoading(true);
        const data = await getCurrentWeather(lat, lon);
        if (mounted) {
          setCurrent(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch weather');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCurrent();

    return () => {
      mounted = false;
    };
  }, [lat, lon]);

  return { current, isLoading, error };
}
