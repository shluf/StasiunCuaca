/**
 * useForecast Hook
 * Fetches and manages weather forecast data from Open Meteo API
 */

import { useState, useEffect } from 'react';
import { fetchForecast, type ForecastData } from '@/services/api/openMeteoAPI';

interface UseForecastOptions {
  latitude?: number;
  longitude?: number;
  enabled?: boolean;
  refreshInterval?: number; // in milliseconds
}

interface UseForecastReturn {
  data: ForecastData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useForecast(options: UseForecastOptions = {}): UseForecastReturn {
  const {
    latitude = -6.2088, // Default: Jakarta
    longitude = 106.8456,
    enabled = true,
    refreshInterval = 1800000, // 30 minutes
  } = options;

  const [data, setData] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!enabled) return;

    try {
      setIsLoading(true);
      setError(null);
      const forecastData = await fetchForecast(latitude, longitude);
      setData(forecastData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch forecast');
      console.error('Forecast fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up refresh interval
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [latitude, longitude, enabled, refreshInterval]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
}
