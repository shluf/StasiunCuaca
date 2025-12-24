#!/usr/bin/env python3
"""
MQTT Publisher for Dummy Sensor Data
Sends realistic weather sensor data to MQTT broker for testing
"""

import json
import time
import random
import paho.mqtt.client as mqtt
from datetime import datetime

# MQTT Configuration
MQTT_BROKER = "localhost"
MQTT_PORT = 1883
MQTT_TOPIC = "sensors/ewsbe"
MQTT_CLIENT_ID = "stasiuncuaca-publisher-dummy"

# Sensor simulation settings
BASE_TEMPERATURE = 28.0  # °C (Yogyakarta average)
BASE_HUMIDITY = 70.0     # %
BASE_PRESSURE = 1013.0   # hPa
BASE_ALTITUDE = 200.0    # m (Yogyakarta altitude ~114m)
BASE_CO2 = 420.0         # ppm (normal atmospheric CO2)

class WeatherSimulator:
    """Simulates realistic weather sensor data"""
    
    def __init__(self):
        self.temperature = BASE_TEMPERATURE
        self.humidity = BASE_HUMIDITY
        self.pressure = BASE_PRESSURE
        self.altitude = BASE_ALTITUDE
        self.co2 = BASE_CO2
        self.wind_speed = 0.0
        self.wind_direction = 0.0
        self.rain = 0.0
        
    def update(self):
        """Update sensor values with realistic variations"""
        # Temperature varies slowly (±0.5°C per update)
        self.temperature += random.uniform(-0.5, 0.5)
        self.temperature = max(20, min(35, self.temperature))  # Clamp 20-35°C
        
        # Humidity varies with temperature (inverse relationship)
        self.humidity += random.uniform(-2, 2)
        self.humidity = max(40, min(95, self.humidity))  # Clamp 40-95%
        
        # Pressure varies slowly
        self.pressure += random.uniform(-0.5, 0.5)
        self.pressure = max(1000, min(1025, self.pressure))  # Clamp 1000-1025 hPa
        
        # Altitude is mostly stable (sensor drift)
        self.altitude = BASE_ALTITUDE + random.uniform(-5, 5)
        
        # CO2 varies based on time (higher at night)
        hour = datetime.now().hour
        if 0 <= hour < 6:  # Night
            self.co2 = 450 + random.uniform(-10, 20)
        elif 6 <= hour < 18:  # Day
            self.co2 = 420 + random.uniform(-10, 10)
        else:  # Evening
            self.co2 = 440 + random.uniform(-10, 15)
        
        # Wind speed (0-15 m/s, usually calm in tropics)
        self.wind_speed = max(0, self.wind_speed + random.uniform(-1, 1))
        self.wind_speed = min(15, self.wind_speed)
        
        # Wind direction (0-360 degrees)
        self.wind_direction = (self.wind_direction + random.uniform(-30, 30)) % 360
        
        # Rain (probability based, mm)
        # 20% chance of rain
        if random.random() < 0.2:
            self.rain = random.uniform(0.1, 5.0)  # Light to moderate rain
        else:
            self.rain = 0.0
    
    def get_sensor_data(self):
        """Get current sensor data in MQTT payload format (Indonesian field names)"""
        # Get current timestamp in milliseconds
        waktu = int(time.time() * 1000)
        
        # Simulate other sensors
        jarak = random.uniform(10, 200)  # Distance sensor (cm)
        volt_sensor = random.uniform(3.0, 5.0)  # Voltage sensor (V)
        bus_voltage = random.uniform(4.8, 5.2)  # Bus voltage (V)
        current_ma = random.uniform(50, 200)  # Current (mA)
        
        return {
            "waktu": waktu,
            "suhu": round(self.temperature, 2),
            "lembap": round(self.humidity, 2),
            "tekanan": round(self.pressure, 2),
            "ketinggian": round(self.altitude, 2),
            "co2": round(self.co2, 2),
            "jarak": round(jarak, 2),
            "angin": round(self.wind_speed, 2),
            "arahAngin": round(self.wind_direction, 2),
            "busVoltage": round(bus_voltage, 2),
            "current_mA": round(current_ma, 2),
            "voltSensor": round(volt_sensor, 2),
            "rain": round(self.rain, 2)
        }

def on_connect(client, userdata, flags, rc):
    """Callback when connected to MQTT broker"""
    if rc == 0:
        print(f"✅ Connected to MQTT Broker: {MQTT_BROKER}")
        print(f"📡 Publishing to topic: {MQTT_TOPIC}")
        print("-" * 60)
    else:
        print(f"❌ Failed to connect, return code {rc}")

def on_publish(client, userdata, mid):
    """Callback when message is published"""
    pass  # Silently handle publish success

def main():
    """Main function to publish dummy sensor data"""
    print("🌡️  Weather Station MQTT Publisher (Dummy Data)")
    print("=" * 60)
    
    # Initialize simulator
    simulator = WeatherSimulator()
    
    # Initialize MQTT client
    client = mqtt.Client(MQTT_CLIENT_ID)
    client.on_connect = on_connect
    client.on_publish = on_publish
    
    # Connect to broker
    try:
        client.connect(MQTT_BROKER, MQTT_PORT, 60)
        client.loop_start()
    except Exception as e:
        print(f"❌ Failed to connect to broker: {e}")
        return
    
    # Wait for connection
    time.sleep(2)
    
    print("\n🚀 Starting to publish sensor data...")
    print("   (Press Ctrl+C to stop)\n")
    
    try:
        iteration = 0
        while True:
            # Update sensor values
            simulator.update()
            
            # Get sensor data
            data = simulator.get_sensor_data()
            
            # Convert to JSON
            payload = json.dumps(data)
            
            # Publish to MQTT
            result = client.publish(MQTT_TOPIC, payload)
            
            # Print status
            iteration += 1
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            print(f"[{iteration:04d}] {timestamp} | "
                  f"Temp: {data['suhu']:5.1f}°C | "
                  f"Hum: {data['lembap']:5.1f}% | "
                  f"Wind: {data['angin']:4.1f}m/s | "
                  f"Rain: {data['rain']:4.1f}mm")
            
            # Wait before next update (5 seconds)
            time.sleep(5)
            
    except KeyboardInterrupt:
        print("\n\n🛑 Stopped by user")
    finally:
        client.loop_stop()
        client.disconnect()
        print("👋 Disconnected from MQTT broker")

if __name__ == "__main__":
    main()
