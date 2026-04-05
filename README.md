# AliceHire - AI-Powered Interview Security Platform

A complete MVP of an interview security platform with WebRTC video calling and AI-powered proctoring features.

## Tech Stack

### Backend
- Django 4 + Django REST Framework
- Django Channels (WebSocket)
- Redis (channel layer)
- MongoDB (djongo)
- JWT Authentication

### Frontend
- React 18 + Vite
- React Router v6
- Axios
- face-api.js
- Pure WebRTC (no wrappers)

## Features

### 1. Authentication System
- JWT-based auth (access + refresh tokens)
- Register/Login
- Protected routes

### 2. Session Management
- Create sessions with unique 6-character codes
- Two modes: Interview (1:1) and Meeting (1:many)
- Configurable proctoring features

### 3. WebRTC Video Calling
- Peer-to-peer video/audio
- Custom hooks for peer connection and signaling
- WebSocket-based signaling server

### 4. AI Proctoring Engine
- **Eye Tracking**: Detects gaze direction, alerts on prolonged off-screen looking
- **Face Detection**: Alerts on missing face or multiple faces
- **Voice Analysis**: Detects background noise and multiple voices
- **Tab Detection**: Tracks tab switches and window blur events
- **Copy/Paste Detection**: Monitors clipboard events
- **Risk Scoring**: Weighted scoring system (0-100) with low/medium/high levels

### 5. Monitor Dashboard
- Real-time alert feed
- Risk score visualization
- Live video monitoring

## Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+
- MongoDB (running on localhost:27017)
- Redis (running on localhost:6379)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Update settings.py AUTH_USER_MODEL:
Add this line to settings.py:
```python
AUTH_USER_MODEL = 'authentication.User'
```

5. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

6. Create superuser (optional):
```bash
python manage.py createsuperuser
```

7. Run the server:
```bash
daphne -b 0.0.0.0 -p 8000 securehire.asgi:application
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The app will be available at http://localhost:5173

## Usage

1. **Register/Login**: Create an account or login
2. **Create Session**: Host creates a session with proctoring config
3. **Join Session**: Participant enters the 6-character code
4. **Monitor**: Host monitors participants with real-time alerts
5. **Room**: Participants join video call with proctoring running

## API Endpoints

### Authentication
- POST `/api/auth/register/` - Register new user
- POST `/api/auth/login/` - Login
- POST `/api/auth/refresh/` - Refresh token
- GET `/api/auth/me/` - Get current user

### Sessions
- POST `/api/sessions/create/` - Create session
- GET `/api/sessions/` - List user's sessions
- GET `/api/sessions/:code/` - Get session by code
- PUT `/api/sessions/:code/update/` - Update session
- DELETE `/api/sessions/:code/delete/` - Delete session

### Alerts
- POST `/api/alerts/` - Create alert
- GET `/api/alerts/:code/` - Get alerts for session

### WebSocket
- `ws://localhost:8000/ws/session/:code/?token=<jwt_token>`

## Project Structure

```
alicehire/
├── backend/
│   ├── authentication/      # User auth
│   ├── sessions/           # Session management
│   ├── alerts/             # Alert system
│   ├── signaling/          # WebSocket consumer
│   └── securehire/         # Django settings
└── frontend/
    ├── src/
    │   ├── pages/          # React pages
    │   ├── webrtc/         # WebRTC hooks
    │   ├── proctoring/     # Proctoring hooks
    │   ├── context/        # Auth context
    │   ├── api/            # Axios config
    │   └── components/     # React components
    └── package.json
```

## Notes

- MongoDB must be running on localhost:27017
- Redis must be running on localhost:6379
- WebRTC works on localhost without TURN server
- face-api.js models load from CDN
- CORS configured for http://localhost:5173
