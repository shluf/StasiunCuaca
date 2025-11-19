package websocket

import (
	"EWSBE/internal/entity"
	"encoding/json"
	"log"
	"sync"
)

// Hub maintains the set of active clients and broadcasts messages to the clients
type Hub struct {
	clients    map[*Client]bool
	broadcast  chan []byte
	register   chan *Client
	unregister chan *Client
	mu         sync.RWMutex
}

// NewHub creates a new Hub instance
func NewHub() *Hub {
	return &Hub{
		broadcast:  make(chan []byte, 256),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
	}
}

// Run starts the hub's main loop
func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client] = true
			h.mu.Unlock()
			log.Printf("WebSocket client connected, total clients: %d", len(h.clients))

		case client := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
			h.mu.Unlock()
			log.Printf("WebSocket client disconnected, total clients: %d", len(h.clients))

		case message := <-h.broadcast:
			h.mu.RLock()
			for client := range h.clients {
				select {
				case client.send <- message:
				default:
					close(client.send)
					delete(h.clients, client)
				}
			}
			h.mu.RUnlock()
		}
	}
}

// BroadcastSensorData broadcasts sensor data to all connected clients
func (h *Hub) BroadcastSensorData(data *entity.SensorData) error {
	// Create Socket.io compatible event message
	event := map[string]interface{}{
		"event": "sensor:update",
		"data":  data,
	}

	message, err := json.Marshal(event)
	if err != nil {
		return err
	}

	h.broadcast <- message
	return nil
}

// BroadcastSensorStatus broadcasts sensor metadata to all connected clients
func (h *Hub) BroadcastSensorStatus(metadata *entity.SensorMetadata) error {
	event := map[string]interface{}{
		"event": "sensor:status",
		"data":  metadata,
	}

	message, err := json.Marshal(event)
	if err != nil {
		return err
	}

	h.broadcast <- message
	return nil
}

// ClientCount returns the number of connected clients
func (h *Hub) ClientCount() int {
	h.mu.RLock()
	defer h.mu.RUnlock()
	return len(h.clients)
}

// Register registers a new client
func (h *Hub) Register(client *Client) {
	h.register <- client
}

// Unregister unregisters a client
func (h *Hub) Unregister(client *Client) {
	h.unregister <- client
}
