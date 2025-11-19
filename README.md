# EWS

## 📋 Prerequisites

- Python 3.7+
- pip (Python package manager)

## 🚀 Setup

### 1. Install Dependencies

```bash
# Install paho-mqtt library
pip install -r requirements.txt

# Atau install langsung:
pip install paho-mqtt
```

### 2. Konfigurasi (Opsional)

File `mqtt_publisher_dummy.py` sudah dikonfigurasi dengan default settings:

```python
MQTT_BROKER = "broker.hivemq.com"  # Public MQTT broker
MQTT_PORT = 1883
MQTT_TOPIC = "sensors/ewsbe"       # Topic yang sama dengan backend
```

### 3. Jalankan Backend (Golang)

```bash
cd backend
go run cmd/main.go
```

Backend akan:
- Connect ke MQTT broker
- Subscribe ke topic `sensors/ewsbe`
- Save data ke PostgreSQL
- Broadcast ke WebSocket clients

### 4. Jalankan MQTT Publisher

```bash
# Di terminal baru
python mqtt_publisher_dummy.py
```

Publisher akan mengirim data setiap 5 detik.

### 5. Jalankan Frontend (React)

```bash
cd frontend
npm run dev
```

Frontend akan:
- Connect ke backend via WebSocket
- Menerima real-time sensor data
- Display di dashboard

## 📝 Catatan

- **Interval**: Data dikirim setiap 5 detik (dapat diubah di script)
- **MQTT Broker**: Menggunakan broker.hivemq.com (public, gratis)
- **Topic**: `sensors/ewsbe` (sama dengan yang disubscribe backend)
- **QoS**: 0 (fire and forget) - cukup untuk testing