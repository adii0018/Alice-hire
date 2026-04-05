# AliceHire - Architecture Documentation

## System Overview

AliceHire is a full-stack AI-powered interview security platform built with Django backend and React frontend, featuring real-time video communication via WebRTC and AI-based proctoring capabilities.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages      │  │   WebRTC     │  │  Proctoring  │      │
│  │  Components  │  │    Hooks     │  │    Hooks     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
            HTTP/REST API      WebSocket (WS)
                    │                 │
┌───────────────────┴─────────────────┴─────────────────────────┐
│                    Backend (Django)                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │     Auth     │  │   Sessions   │  │    Alerts    │        │
│  │     API      │  │     API      │  │     API      │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                │
│  ┌──────────────────────────────────────────────────┐        │
│  │         WebSocket Consumer (Signaling)            │        │
│  └──────────────────────────────────────────────────┘        │
│                            │                                   │
└────────────────────────────┼───────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                MongoDB           Redis
            (Data Storage)   (Channel Layer)
```

## Technology Stack

### Backend
- **Framework**: Django 4.2 + Django REST Framework
- **WebSocket**: Django Channels + Daphne
- **Database**: MongoDB (via djongo)
- **Cache/Channel Layer**: Redis
- **Authentication**: JWT (djangorestframework-simplejwt)

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **AI Library**: face-api.js
- **Styling**: Inline styles (no CSS framework)

### Real-time Communication
- **Video/Audio**: WebRTC (native browser APIs)
- **Signaling**: WebSocket (Django Channels)
- **STUN Server**: Google STUN (stun.l.google.com:19302)

## Component Architecture

### Backend Components

#### 1. Authentication App
**Purpose**: User management and JWT authentication

**Models**:
- `User`: Custom user model extending AbstractUser
  - Fields: email (unique), username, password, created_at

**Endpoints**:
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login (returns JWT tokens)
- `POST /api/auth/refresh/` - Refresh access token
- `GET /api/auth/me/` - Get current user info

**Serializers**:
- `RegisterSerializer`: Validates registration data
- `UserSerializer`: User data serialization

#### 2. Sessions App
**Purpose**: Manage interview/meeting sessions

**Models**:
- `Session`: Interview session
  - Fields: code (6-char unique), host (user_id), mode, config, created_at, status

**Endpoints**:
- `POST /api/sessions/create/` - Create new session
- `GET /api/sessions/` - List user's sessions
- `GET /api/sessions/:code/` - Get session details
- `PUT /api/sessions/:code/update/` - Update session config
- `DELETE /api/sessions/:code/delete/` - Delete session

**Serializers**:
- `SessionSerializer`: Full session data
- `CreateSessionSerializer`: Session creation data

#### 3. Alerts App
**Purpose**: Store and retrieve proctoring alerts

**Models**:
- `Alert`: Proctoring alert
  - Fields: session_code, type, severity, timestamp, metadata

**Endpoints**:
- `POST /api/alerts/` - Create alert (triggers WebSocket broadcast)
- `GET /api/alerts/:code/` - Get all alerts for session

**Serializers**:
- `AlertSerializer`: Alert data serialization

#### 4. Signaling App
**Purpose**: WebSocket signaling for WebRTC

**Consumer**: `SignalingConsumer`
- Handles WebSocket connections
- Routes messages: offer, answer, ice, alert_update
- Manages peer joining/leaving

**Middleware**: `JWTAuthMiddleware`
- Authenticates WebSocket connections via JWT token in query params

**Routing**:
- `ws://localhost:8000/ws/session/:code/?token=<jwt>`

### Frontend Components

#### 1. Pages
- `Landing.jsx`: Home page with login/register links
- `Login.jsx`: User login form
- `Register.jsx`: User registration form
- `Dashboard.jsx`: User dashboard with session list
- `CreateSession.jsx`: Create new session with config
- `JoinSession.jsx`: Join session by code
- `Room.jsx`: Video call room (participant view)
- `Monitor.jsx`: Monitoring dashboard (host view)

#### 2. Context
- `AuthContext.jsx`: Global authentication state
  - Manages user, login, register, logout
  - Auto-refreshes tokens
  - Provides auth state to all components

#### 3. WebRTC Hooks

**`usePeerConnection(config)`**
- Creates and manages RTCPeerConnection
- Handles ICE candidates
- Methods:
  - `initializePeer()`: Initialize peer connection
  - `createOffer()`: Create SDP offer
  - `createAnswer()`: Create SDP answer
  - `setRemoteDesc()`: Set remote description
  - `addIceCandidate()`: Add ICE candidate
  - `addTrack()`: Add media track
  - `close()`: Close connection

**`useSignaling(sessionCode, role, handlers)`**
- Manages WebSocket connection
- Auto-reconnects on disconnect
- Methods:
  - `sendOffer()`: Send SDP offer
  - `sendAnswer()`: Send SDP answer
  - `sendIce()`: Send ICE candidate
  - `sendMessage()`: Send custom message

#### 4. Proctoring Hooks

**`useEyeTracking(videoRef, enabled, onAlert)`**
- Uses face-api.js landmark detection
- Calculates gaze direction from eye/nose positions
- Alerts on prolonged off-screen gaze (>2s)
- Runs every 500ms

**`useFaceDetection(videoRef, enabled, onAlert)`**
- Uses face-api.js SSD MobileNet
- Detects number of faces in frame
- Alerts on: no face, multiple faces
- Runs every 1000ms

**`useVoiceAnalysis(enabled, onAlert)`**
- Uses Web Audio API (AudioContext + AnalyserNode)
- Analyzes frequency data for noise level
- Alerts on suspicious audio patterns (>3s)
- Runs continuously via requestAnimationFrame

**`useTabDetection(enabled, onAlert)`**
- Listens to visibilitychange and blur events
- Counts tab switches
- Alerts immediately on each switch

**`useCopyPaste(enabled, onAlert)`**
- Listens to copy, paste, cut events
- Logs all clipboard events
- Alerts immediately on each event

**`useRiskScore(alerts)`**
- Calculates weighted risk score (0-100)
- Weights:
  - face_missing: 10pts
  - multiple_faces: 15pts
  - gaze_deviation: 5pts
  - tab_switch: 8pts
  - copy_paste: 12pts
  - multiple_voices: 7pts
- Returns: score, riskLevel (low/medium/high)

## Data Flow

### 1. User Registration/Login Flow
```
User → Frontend (Login.jsx)
     → POST /api/auth/login/
     → Backend (AuthView)
     → JWT tokens generated
     → Tokens stored in localStorage
     → User redirected to Dashboard
```

### 2. Session Creation Flow
```
Host → Frontend (CreateSession.jsx)
     → POST /api/sessions/create/
     → Backend (SessionView)
     → Session saved to MongoDB
     → 6-char code generated
     → Host redirected to Monitor
```

### 3. WebRTC Connection Flow
```
Participant → Join Room
            → WebSocket connect
            → Send "join" message
            → Host receives "peer_joined"
            → Host creates offer
            → Send offer via WebSocket
            → Participant receives offer
            → Participant creates answer
            → Send answer via WebSocket
            → Host receives answer
            → ICE candidates exchanged
            → P2P connection established
            → Video/audio streams flow
```

### 4. Proctoring Alert Flow
```
Proctoring Hook → Detects violation
                → onAlert callback
                → POST /api/alerts/
                → Backend saves to MongoDB
                → Broadcast via WebSocket
                → Monitor receives alert
                → Alert displayed in real-time
```

## Security Considerations

### Authentication
- JWT tokens with 1-hour expiration
- Refresh tokens with 7-day expiration
- Tokens stored in localStorage (consider httpOnly cookies for production)
- WebSocket authenticated via query param token

### Authorization
- Session access controlled by host user_id
- Only host can update/delete sessions
- Alerts require authentication

### CORS
- Configured for localhost:5173
- Update for production domains

### WebRTC Security
- STUN server for NAT traversal
- P2P connection (no media server)
- Consider TURN server for production
- Consider end-to-end encryption

## Performance Considerations

### Face Detection
- Runs at 1fps (every 1000ms) to reduce CPU load
- Uses lightweight SSD MobileNet model
- Models loaded from CDN (cached by browser)

### Eye Tracking
- Runs at 2fps (every 500ms)
- Uses TinyFaceDetector for speed
- Landmark detection is lightweight

### WebSocket
- Auto-reconnect on disconnect
- Message batching for efficiency
- Redis channel layer for scalability

### Database
- MongoDB for flexible schema
- Indexed on session code for fast lookups
- Consider sharding for scale

## Scalability

### Current Limitations
- P2P WebRTC (1:1 or 1:few)
- Single server deployment
- No load balancing

### Production Recommendations
1. **Media Server**: Use SFU (Selective Forwarding Unit) like Janus or Mediasoup
2. **Load Balancer**: Nginx or AWS ALB
3. **Database**: MongoDB replica set
4. **Redis**: Redis Cluster
5. **CDN**: CloudFront for static assets
6. **Monitoring**: Prometheus + Grafana
7. **Logging**: ELK stack

## Deployment Architecture (Production)

```
                    ┌─────────────┐
                    │   CloudFront│
                    │     (CDN)   │
                    └──────┬──────┘
                           │
                    ┌──────┴──────┐
                    │   Nginx     │
                    │ Load Balancer│
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────┴────┐       ┌────┴────┐       ┌────┴────┐
   │ Django  │       │ Django  │       │ Django  │
   │ Server 1│       │ Server 2│       │ Server 3│
   └────┬────┘       └────┬────┘       └────┬────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────┴────┐       ┌────┴────┐       ┌────┴────┐
   │ MongoDB │       │  Redis  │       │  Media  │
   │ Cluster │       │ Cluster │       │  Server │
   └─────────┘       └─────────┘       └─────────┘
```

## Future Enhancements

1. **Screen Sharing**: Add screen capture for code interviews
2. **Recording**: Record sessions for later review
3. **AI Analysis**: ML model for behavior analysis
4. **Mobile Support**: React Native app
5. **Whiteboard**: Collaborative drawing tool
6. **Chat**: Text chat during interview
7. **Scheduling**: Calendar integration
8. **Reports**: PDF reports with analytics
9. **Multi-language**: i18n support
10. **Accessibility**: WCAG compliance
