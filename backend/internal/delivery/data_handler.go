package http

import (
	"EWSBE/internal/entity"
	"EWSBE/internal/usecase"
	ws "EWSBE/internal/websocket"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type Handler struct {
	uc  *usecase.DataUsecase
	hub *ws.Hub
	r   *gin.Engine
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		// Allow connections from frontend (in production, restrict this)
		return true
	},
}

func NewHandler(uc *usecase.DataUsecase, hub *ws.Hub) *Handler {
	r := gin.Default()

	// CORS middleware for frontend connection
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:5173", "http://localhost:3000"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	config.AllowCredentials = true
	r.Use(cors.New(config))

	h := &Handler{uc: uc, hub: hub, r: r}
	h.routes()

	return h
}

func (h *Handler) routes() {
	// REST API routes
	api := h.r.Group("/api")
	{
		// Sensor data endpoints
		api.POST("/data", h.CreateData)
		api.GET("/data", h.GetAllData)
		api.GET("/data/latest", h.GetLatestData)
		api.GET("/data/history", h.GetDataHistory)
		
		// Health check
		api.GET("/health", h.HealthCheck)
	}

	// WebSocket endpoint
	h.r.GET("/ws", h.HandleWebSocket)
}

func (h *Handler) Router() http.Handler {
	return h.r
}

// HealthCheck returns server status
func (h *Handler) HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":     "ok",
		"wsClients":  h.hub.ClientCount(),
		"timestamp":  time.Now().Format(time.RFC3339),
	})
}

// HandleWebSocket upgrades HTTP connection to WebSocket
func (h *Handler) HandleWebSocket(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to upgrade to WebSocket"})
		return
	}

	client := ws.NewClient(h.hub, conn)
	h.hub.Register(client)

	// Start client read/write pumps
	go client.WritePump()
	go client.ReadPump()
}

// CreateData creates new sensor data
func (h *Handler) CreateData(c *gin.Context) {
	var d entity.SensorData
	if err := c.ShouldBindJSON(&d); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.uc.Create(&d); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Broadcast to WebSocket clients
	if h.hub != nil {
		h.hub.BroadcastSensorData(&d)
	}

	c.JSON(http.StatusCreated, d)
}

// GetAllData returns all sensor data
func (h *Handler) GetAllData(c *gin.Context) {
	// Optional limit query parameter
	limitStr := c.DefaultQuery("limit", "100")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		limit = 100
	}

	data, err := h.uc.GetDataByLimit(limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, data)
}

// GetLatestData returns the latest sensor reading
func (h *Handler) GetLatestData(c *gin.Context) {
	data, err := h.uc.GetLatestData()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if data == nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "No data available"})
		return
	}

	c.JSON(http.StatusOK, data)
}

// GetDataHistory returns sensor data within time range
func (h *Handler) GetDataHistory(c *gin.Context) {
	// Query parameters: start, end (ISO 8601 format)
	startStr := c.Query("start")
	endStr := c.Query("end")

	var start, end time.Time
	var err error

	if startStr == "" {
		// Default: last 24 hours
		start = time.Now().Add(-24 * time.Hour)
	} else {
		start, err = time.Parse(time.RFC3339, startStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start time format (use RFC3339)"})
			return
		}
	}

	if endStr == "" {
		end = time.Now()
	} else {
		end, err = time.Parse(time.RFC3339, endStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end time format (use RFC3339)"})
			return
		}
	}

	data, err := h.uc.GetDataByTimeRange(start, end)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"start": start.Format(time.RFC3339),
		"end":   end.Format(time.RFC3339),
		"count": len(data),
		"data":  data,
	})
}
