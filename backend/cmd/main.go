package main

import (
	"EWSBE/internal/config"
	"EWSBE/internal/db"
	deliver "EWSBE/internal/delivery"
	"EWSBE/internal/entity"
	"EWSBE/internal/model"
	"EWSBE/internal/mqtt"
	"EWSBE/internal/usecase"
	ws "EWSBE/internal/websocket"
	"context"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: Error loading .env file: %s (using defaults)", err)
	}

	cfg := config.LoadConfig()

	// Initialize Cloudinary
	config.InitCloudinary()

	// Open database connection
	gormDB, err := db.InitDB(cfg)
	if err != nil {
		log.Fatalf("failed to connect db: %v", err)
	}

	// Auto migrate
	if err := gormDB.AutoMigrate(&entity.SensorData{}, &entity.User{}, &entity.News{}); err != nil {
		log.Fatalf("automigrate: %v", err)
	}
	log.Println("Database migration completed")

	// Initialize WebSocket hub
	hub := ws.NewHub()
	go hub.Run()
	log.Println("WebSocket hub started")

	// Wire up repository -> usecase -> handler
	repo := model.NewDataRepo(gormDB)
	uc := usecase.NewDataUsecase(repo)

	// Auth components
	userRepo := model.NewUserRepo(gormDB)
	authUc := usecase.NewAuthUsecase(userRepo)

	// News components
	newsRepo := model.NewNewsRepo(gormDB)
	newsUc := usecase.NewNewsUsecase(newsRepo)

	// Unified Handler
	handler := deliver.NewHandler(uc, authUc, newsUc, hub)

	// Initialize MQTT client
	broker := os.Getenv("MQTT_BROKER")
	clientID := os.Getenv("MQTT_CLIENT_ID")
	topic := os.Getenv("MQTT_TOPIC")

	if broker == "" {
		log.Println("Warning: MQTT_BROKER not set, skipping MQTT connection")
	} else {
		mqttClient, err := mqtt.Connect(broker, clientID)
		if err != nil {
			log.Printf("mqtt connect error: %v (continuing without MQTT)", err)
		} else {
			// Subscribe to sensor topic with WebSocket hub for broadcasting
			if err := mqtt.SubscribeSensorTopic(mqttClient, topic, 0, uc, hub); err != nil {
				log.Printf("mqtt subscribe error: %v", err)
			} else {
				log.Printf("MQTT subscribed to topic: %s", topic)
			}

			// Graceful MQTT disconnect on shutdown
			defer func() {
				if mqttClient != nil && mqttClient.IsConnected() {
					mqttClient.Disconnect(250)
					log.Println("MQTT client disconnected")
				}
			}()
		}
	}

	// HTTP server
	addr := normalizeAddr(cfg.Port)
	srv := &http.Server{
		Addr:    addr,
		Handler: handler.Router(),
	}

	ln, err := net.Listen("tcp", addr)
	if err != nil {
		log.Fatalf("listen: %v", err)
	}

	go func() {
		log.Printf("Server listening on %s", addr)
		log.Printf("WebSocket endpoint: ws://localhost%s/ws", addr)
		log.Printf("REST API endpoint: http://localhost%s/api", addr)
		if err := srv.Serve(ln); err != nil && err != http.ErrServerClosed {
			log.Fatalf("server error: %v", err)
		}
	}()

	// Graceful shutdown
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop

	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Printf("shutdown error: %v", err)
	} else {
		log.Println("Server gracefully stopped")
	}
}

func normalizeAddr(port string) string {
	if port == "" {
		return ":8080"
	}
	if port[0] == ':' {
		return port
	}
	return ":" + port
}
