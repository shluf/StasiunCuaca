package entity

import (
	"time"
)

// SensorData represents sensor readings from IoT device
// Field names match frontend TypeScript interface for consistency
type SensorData struct {
	ID            uint      `json:"id" gorm:"primaryKey"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
	Timestamp     time.Time `json:"timestamp" gorm:"index"` // When sensor reading was taken
	Temperature   float64   `json:"temperature"`            // °C (from suhu)
	Humidity      float64   `json:"humidity"`               // % (from lembap)
	Pressure      float64   `json:"pressure"`               // hPa (from tekanan)
	Altitude      float64   `json:"altitude"`               // meters (from ketinggian)
	Co2           float64   `json:"co2"`                    // ppm (from co2)
	Distance      float64   `json:"distance"`               // cm (from jarak)
	WindSpeed     float64   `json:"windSpeed"`              // m/s (from angin)
	WindDirection float64   `json:"windDirection"`          // degrees 0-360 (from arahAngin)
	Rainfall      float64   `json:"rainfall"`               // mm (from rain)
	Voltage       float64   `json:"voltage"`                // V (from voltSensor)
	BusVoltage    float64   `json:"busVoltage"`             // V (from busVoltage)
	Current       float64   `json:"current"`                // mA (from current_mA)
}

// AggregatedData represents grouped sensor data (e.g., hourly, daily)
type AggregatedData struct {
	Timestamp     time.Time `json:"timestamp"`
	Temperature   float64   `json:"temperature"`
	Humidity      float64   `json:"humidity"`
	Pressure      float64   `json:"pressure"`
	WindSpeed     float64   `json:"windSpeed"`
	Rainfall      float64   `json:"rainfall"`
	Co2           float64   `json:"co2"`
	Altitude      float64   `json:"altitude"`
	WindDirection float64   `json:"windDirection"`
}

// DataInsights represents analytics for a specific period
type DataInsights struct {
	MinTemp        float64 `json:"minTemp"`
	MaxTemp        float64 `json:"maxTemp"`
	AvgTemp        float64 `json:"avgTemp"`
	MinHum         float64 `json:"minHum"`
	MaxHum         float64 `json:"maxHum"`
	AvgHum         float64 `json:"avgHum"`
	PrevMonthDiff  float64 `json:"prevMonthDiff"` // Difference in average temp vs previous month
	PeakHour       int     `json:"peakHour"`      // Hour of day with highest average temp
	PeakHourAvg    float64 `json:"peakHourAvg"`   // Avg temp at peak hour
}

// SensorMetadata represents sensor device metadata
type SensorMetadata struct {
	SensorID        string    `json:"sensorId"`
	Location        string    `json:"location"`
	CalibrationDate string    `json:"calibrationDate"`
	Status          string    `json:"status"` // online, offline, error
	LastUpdate      time.Time `json:"lastUpdate"`
}

// MQTTSensorPayload represents incoming data from MQTT (Indonesian field names)
type MQTTSensorPayload struct {
	Waktu      int64   `json:"waktu"`       // Unix timestamp milliseconds
	Suhu       float64 `json:"suhu"`        // Temperature
	Lembap     float64 `json:"lembap"`      // Humidity
	Tekanan    float64 `json:"tekanan"`     // Pressure
	Ketinggian float64 `json:"ketinggian"`  // Altitude
	Co2        float64 `json:"co2"`         // CO2
	Jarak      float64 `json:"jarak"`       // Distance
	Angin      float64 `json:"angin"`       // Wind speed
	ArahAngin  float64 `json:"arahAngin"`   // Wind direction
	BusVoltage float64 `json:"busVoltage"`  // Bus voltage
	CurrentMA  float64 `json:"current_mA"`  // Current
	VoltSensor float64 `json:"voltSensor"`  // Voltage sensor
	Rain       float64 `json:"rain"`        // Rainfall
}

// ToSensorData converts MQTT payload to SensorData entity
func (m *MQTTSensorPayload) ToSensorData() *SensorData {
	// Convert Unix milliseconds to time.Time
	timestamp := time.Unix(0, m.Waktu*int64(time.Millisecond))

	return &SensorData{
		Timestamp:     timestamp,
		Temperature:   m.Suhu,
		Humidity:      m.Lembap,
		Pressure:      m.Tekanan,
		Altitude:      m.Ketinggian,
		Co2:           m.Co2,
		Distance:      m.Jarak,
		WindSpeed:     m.Angin,
		WindDirection: m.ArahAngin,
		Rainfall:      m.Rain,
		Voltage:       m.VoltSensor,
		BusVoltage:    m.BusVoltage,
		Current:       m.CurrentMA,
	}
}
