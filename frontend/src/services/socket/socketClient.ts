/**
 * Native WebSocket Client Service
 * Real-time sensor data communication
 */

import { SOCKET_CONFIG, SOCKET_EVENTS } from '@config/socketConfig';
import type { SensorReading, SensorMetadata } from '@/types/sensor.types';
import type { SocketError, HistoryRequest, SocketConnectionState } from '@/types/socket.types';

class SocketService {
  private socket: WebSocket | null = null;
  private connectionState: SocketConnectionState = {
    connected: false,
    error: null,
    reconnecting: false,
  };
  private listeners: Map<string, Function[]> = new Map();
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  /**
   * Initialize WebSocket connection
   */
  connect(): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      console.log('[WebSocket] Already connected');
      return;
    }

    try {
      const wsUrl = SOCKET_CONFIG.url.replace(/^http/, 'ws');
      console.log('[WebSocket] Connecting to:', wsUrl);

      this.socket = new WebSocket(wsUrl);
      this.setupEventListeners();
    } catch (error) {
      console.error('[WebSocket] Connection error:', error);
      this.connectionState.error = 'Failed to initialize connection';
      this.scheduleReconnect();
    }
  }

  /**
   * Disconnect WebSocket
   */
  disconnect(): void {
    this.clearTimers();

    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.connectionState.connected = false;
      console.log('[WebSocket] Disconnected');
    }
  }

  /**
   * Setup WebSocket event listeners
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.onopen = () => {
      console.log('[WebSocket] Connected');
      this.connectionState.connected = true;
      this.connectionState.error = null;
      this.connectionState.reconnecting = false;
      this.reconnectAttempts = 0;

      this.notifyListeners('connection', { connected: true });
      this.startHeartbeat();
    };

    this.socket.onclose = (event) => {
      console.log('[WebSocket] Disconnected:', event.reason || 'Connection closed');
      this.connectionState.connected = false;
      this.clearTimers();

      this.notifyListeners('connection', { connected: false, reason: event.reason });

      // Auto-reconnect if not a normal closure
      if (event.code !== 1000) {
        this.scheduleReconnect();
      }
    };

    this.socket.onerror = (error) => {
      console.error('[WebSocket] Error:', error);
      this.connectionState.error = 'WebSocket connection error';
      this.notifyListeners('error', { message: 'WebSocket connection error' });
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('[WebSocket] Failed to parse message:', error);
      }
    };
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(message: any): void {
    // Backend sends { "event": "sensor:update", "data": {...} }
    const { event, data } = message;

    switch (event) {
      case 'sensor:update':
        this.notifyListeners('sensor:update', data as SensorReading);
        break;

      case 'sensor:status':
        this.notifyListeners('sensor:status', data as SensorMetadata);
        break;

      case 'sensor:error':
        this.notifyListeners('sensor:error', data as SocketError);
        break;

      case 'sensor:history':
        this.notifyListeners('sensor:history', data);
        break;

      case 'pong':
        // Heartbeat response
        break;

      default:
        // Assume it's a sensor update if no event specified
        if (data && typeof data === 'object') {
          this.notifyListeners('sensor:update', data as SensorReading);
        }
    }
  }

  /**
   * Send message to server
   */
  private send(type: string, data?: any): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      const message = { type, data };
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('[WebSocket] Cannot send - not connected');
    }
  }

  /**
   * Subscribe to sensor updates
   */
  subscribeToSensors(): void {
    this.send('sensor:subscribe');
    console.log('[WebSocket] Subscribed to sensor updates');
  }

  /**
   * Unsubscribe from sensor updates
   */
  unsubscribeFromSensors(): void {
    this.send('sensor:unsubscribe');
    console.log('[WebSocket] Unsubscribed from sensor updates');
  }

  /**
   * Request sensor history
   */
  requestHistory(params: HistoryRequest): void {
    this.send('sensor:request-history', params);
    console.log('[WebSocket] Requested history:', params);
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.clearTimers();

    this.heartbeatInterval = setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.send('ping');
      }
    }, 30000); // Every 30 seconds
  }

  /**
   * Schedule reconnection
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= SOCKET_CONFIG.maxReconnectAttempts) {
      console.error('[WebSocket] Max reconnection attempts reached');
      this.connectionState.error = 'Failed to reconnect after multiple attempts';
      return;
    }

    this.connectionState.reconnecting = true;
    this.reconnectAttempts++;

    const delay = Math.min(
      SOCKET_CONFIG.reconnectionDelay * Math.pow(2, this.reconnectAttempts - 1),
      SOCKET_CONFIG.reconnectionDelayMax
    );

    console.log(`[WebSocket] Reconnecting in ${delay}ms... (attempt ${this.reconnectAttempts})`);
    this.notifyListeners('reconnecting', { attemptNumber: this.reconnectAttempts });

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * Clear all timers
   */
  private clearTimers(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Add event listener
   */
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  /**
   * Remove event listener
   */
  off(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Notify all listeners of an event
   */
  private notifyListeners(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  /**
   * Get connection state
   */
  getConnectionState(): SocketConnectionState {
    return { ...this.connectionState };
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

// Export singleton instance
export const socketService = new SocketService();
export default socketService;
