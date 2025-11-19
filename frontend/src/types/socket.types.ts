/**
 * Socket.io Event Types
 */

import type { SensorReading, SensorMetadata } from './sensor.types';

export interface SocketEvents {
  // Server to Client Events
  'sensor:update': (data: SensorReading) => void;
  'sensor:status': (status: SensorMetadata) => void;
  'sensor:error': (error: SocketError) => void;
  'sensor:history': (data: { readings: SensorReading[] }) => void;

  // Client to Server Events
  'sensor:subscribe': () => void;
  'sensor:unsubscribe': () => void;
  'sensor:request-history': (params: HistoryRequest) => void;
}

export interface SocketError {
  message: string;
  code: string;
  timestamp: string;
}

export interface HistoryRequest {
  start: string; // ISO 8601 format
  end: string;   // ISO 8601 format
  interval?: number; // in minutes
}

export interface SocketConnectionState {
  connected: boolean;
  error: string | null;
  reconnecting: boolean;
}
