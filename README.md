# StasiunCuaca - Weather Station Frontend

Frontend aplikasi monitoring cuaca realtime berbasis React + TypeScript + Vite.

## ✨ Fitur

- 📊 Dashboard monitoring cuaca realtime
- 📈 Visualisasi data dengan grafik interaktif (Recharts)
- 📰 Modul berita cuaca
- 📤 Export data ke Excel
- 🔗 WebSocket untuk data realtime

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **HTTP Client:** Axios
- **i18n:** i18next
- **Routing:** React Router DOM v7

## 🚀 Getting Started

### Prerequisites

- Node.js >= 22
- npm atau yarn

### Installation

```bash
# Clone repository
git clone https://github.com/shluf/StasiunCuaca.git
cd StasiunCuaca

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

### Environment Variables

Buat file `.env` dengan konfigurasi berikut:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_SOCKET_URL=ws://localhost:8080/ws
```

### Development

```bash
# Start development server
npm run dev

# Linting
npm run lint

# Build production
npm run build

# Preview production build
npm run preview
```

## 🐳 Docker

### Build Image

```bash
docker build \
  --build-arg VITE_API_BASE_URL=https://api.example.com \
  --build-arg VITE_SOCKET_URL=wss://api.example.com/ws \
  -t stasiuncuaca-fe .
```

### Run Container

```bash
docker run -d -p 80:80 stasiuncuaca-fe
```

## 📁 Project Structure

```
src/
├── app/              # App providers & configuration
├── assets/           # Static assets (images, icons)
├── components/       # Reusable UI components
├── config/           # App configuration
├── contexts/         # React contexts
├── features/         # Feature modules
│   ├── auth/         # Authentication
│   ├── dashboard/    # Main dashboard
│   ├── history/      # Historical data
│   ├── insights/     # Data insights
│   ├── news/         # News module
│   ├── notifications/# Notifications
│   └── settings/     # User settings
├── hooks/            # Custom React hooks
├── i18n/             # Internationalization
├── services/         # API services
├── types/            # TypeScript types
└── utils/            # Utility functions
```

## 📝 License

MIT License
