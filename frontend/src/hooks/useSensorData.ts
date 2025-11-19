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
    isLoading: isLoading && isConnected,
    error: connectionState.error,
    isConnected,
  };
}

// Hook for historical sensor data
export function useSensorHistory(startDate?: string, endDate?: string) {
  const { isConnected } = useSocket();
  const [history, setHistory] = useState<SensorReading[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnected || !startDate || !endDate) return;

    setIsLoading(true);
    setError(null);

    // Request historical data
    socketService.requestHistory({
      start: startDate,
      end: endDate,
    });

    // Listen for history response
    const handleHistory = (data: { readings: SensorReading[] }) => {
      setHistory(data.readings);
      setIsLoading(false);
    };

    const handleError = (err: { message: string }) => {
      setError(err.message);
      setIsLoading(false);
    };

    socketService.on('sensor:history', handleHistory);
    socketService.on('sensor:error', handleError);

    return () => {
      socketService.off('sensor:history', handleHistory);
      socketService.off('sensor:error', handleError);
    };
  }, [isConnected, startDate, endDate]);

  return {
    history,
    isLoading,
    error,
  };
}
