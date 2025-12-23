/**
 * useSensorData Hook
 * Real-time sensor data management
 */

import { useState, useEffect } from 'react';
import { useSocket } from './useSocket';
import socketService from '@/services/socket/socketClient';
import type { SensorReading, SensorMetadata } from '@/types/sensor.types';

interface UseSensorDataReturn {
  data: SensorReading | null;
  metadata: SensorMetadata | null;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
}

export function useSensorData(): UseSensorDataReturn {
  const { isConnected, connectionState } = useSocket();
  const [data, setData] = useState<SensorReading | null>(null);
  const [metadata, setMetadata] = useState<SensorMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isConnected) {
      setIsLoading(false);
      return;
    }

    // Subscribe to sensor updates when connected
    socketService.subscribeToSensors();
    setIsLoading(true);

    // Listen for sensor data updates
    const handleUpdate = (newData: SensorReading) => {
      setData(newData);
      setIsLoading(false);
    };

    // Listen for sensor status/metadata
    const handleStatus = (status: SensorMetadata) => {
      setMetadata(status);
    };

    // Listen for errors
    const handleError = (error: { message: string }) => {
      console.error('[useSensorData] Error:', error.message);
      setIsLoading(false);
    };

    socketService.on('sensor:update', handleUpdate);
    socketService.on('sensor:status', handleStatus);
    socketService.on('sensor:error', handleError);

    // Cleanup
    return () => {
      socketService.off('sensor:update', handleUpdate);
      socketService.off('sensor:status', handleStatus);
      socketService.off('sensor:error', handleError);
      socketService.unsubscribeFromSensors();
    };
  }, [isConnected]);

  return {
    data,
    metadata,
    isLoading: isLoading || (!isConnected && !connectionState.error),
    error: connectionState.error,
    isConnected,
  };
}

// Hook for historical sensor data
// Hook for historical sensor data
import axios from 'axios';

// Hook for historical sensor data
export function useSensorHistory(startDate?: string, endDate?: string, interval: string = 'raw') {
  const [history, setHistory] = useState<SensorReading[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If no dates provided, don't fetch (or fetch default inside effect if needed, but logic seems to rely on props)
    // Actually WeatherHistory provides defaults, so we should be good.
    // However, to prevent initial double fetch or invalid fetch, check if dates are valid strings
    if (!startDate || !endDate) return;

    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Construct URL with query params
        // Backend expects ISO 8601 strings
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/data/history`, {
          params: {
            start: startDate,
            end: endDate,
            interval: interval,
          },
        });

        // Backend returns { start, end, count, data: [...] }
        if (response.data && Array.isArray(response.data.data)) {
          setHistory(response.data.data);
        } else {
          setHistory([]);
          console.warn('Unexpected history data format:', response.data);
        }
      } catch (err: any) {
        console.error('Failed to fetch history:', err);
        setError(err.response?.data?.error || err.message || 'Failed to fetch history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [startDate, endDate, interval]);

  return {
    history,
    isLoading,
    error,
  };
}

// Hook for sensor insights
import type { DataInsights } from '@/types/sensor.types';

export function useSensorInsights() {
  const [insights, setInsights] = useState<DataInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/data/insights`);
      setInsights(response.data);
    } catch (err: any) {
      console.error('Failed to fetch insights:', err);
      setError(err.response?.data?.error || err.message || 'Failed to fetch insights');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return { insights, isLoading, error, refetch: fetchInsights };
}
