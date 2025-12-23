/**
 * useSocket Hook
 * Socket.io connection and event management
 */

import { useEffect, useState, useCallback } from 'react';
import socketService from '@/services/socket/socketClient';
import type { SensorReading, SensorMetadata } from '@/types/sensor.types';
import type { SocketConnectionState } from '@/types/socket.types';

export function useSocket() {
  const [connectionState, setConnectionState] = useState<SocketConnectionState>({
    connected: false,
    error: null,
    reconnecting: false,
  });

  useEffect(() => {
    // Connect on mount
    socketService.connect();

    // Listen for connection state changes
    const handleConnection = (data: { connected: boolean; reason?: string }) => {
      setConnectionState(prev => ({
        ...prev,
        connected: data.connected,
        error: data.connected ? null : data.reason || null,
      }));
    };

    const handleError = (data: { message: string }) => {
      setConnectionState(prev => ({
        ...prev,
        error: data.message,
      }));
    };

    const handleReconnecting = (_data: { attemptNumber: number }) => {
      setConnectionState(prev => ({
        ...prev,
        reconnecting: true,
      }));
    };

    socketService.on('connection', handleConnection);
    socketService.on('error', handleError);
    socketService.on('reconnecting', handleReconnecting);

    // Cleanup on unmount
    return () => {
      socketService.off('connection', handleConnection);
      socketService.off('error', handleError);
      socketService.off('reconnecting', handleReconnecting);
      // Do not disconnect on unmount to separate page lifecycle from socket lifecycle
      // socketService.disconnect();
    };
  }, []);

  const subscribe = useCallback(() => {
    socketService.subscribeToSensors();
  }, []);

  const unsubscribe = useCallback(() => {
    socketService.unsubscribeFromSensors();
  }, []);

  return {
    connectionState,
    isConnected: connectionState.connected,
    subscribe,
    unsubscribe,
    socketService,
  };
}

// Hook for listening to sensor updates
export function useSensorUpdates(
  onUpdate?: (data: SensorReading) => void
) {
  const { isConnected } = useSocket();

  useEffect(() => {
    if (!isConnected || !onUpdate) return;

    const handleUpdate = (data: SensorReading) => {
      onUpdate(data);
    };

    socketService.on('sensor:update', handleUpdate);

    return () => {
      socketService.off('sensor:update', handleUpdate);
    };
  }, [isConnected, onUpdate]);
}

// Hook for listening to sensor status
export function useSensorStatus(
  onStatus?: (status: SensorMetadata) => void
) {
  const { isConnected } = useSocket();

  useEffect(() => {
    if (!isConnected || !onStatus) return;

    const handleStatus = (status: SensorMetadata) => {
      onStatus(status);
    };

    socketService.on('sensor:status', handleStatus);

    return () => {
      socketService.off('sensor:status', handleStatus);
    };
  }, [isConnected, onStatus]);
}
