import { SOCKET_URL } from './constants';

export const SOCKET_CONFIG = {
  url: SOCKET_URL,
  reconnectionDelay: 1000, // 1 second
  reconnectionDelayMax: 5000, // 5 seconds max
  maxReconnectAttempts: 5,
};

export const SOCKET_EVENTS = {
  // Client to Server
  SUBSCRIBE: 'sensor:subscribe',
  UNSUBSCRIBE: 'sensor:unsubscribe',
  REQUEST_HISTORY: 'sensor:request-history',

  // Server to Client
  UPDATE: 'sensor:update',
  STATUS: 'sensor:status',
  ERROR: 'sensor:error',
  HISTORY: 'sensor:history',

  // Connection Events (for internal use)
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
  RECONNECT: 'reconnect',
  RECONNECT_ATTEMPT: 'reconnect_attempt',
  RECONNECT_ERROR: 'reconnect_error',
  RECONNECT_FAILED: 'reconnect_failed',
} as const;
