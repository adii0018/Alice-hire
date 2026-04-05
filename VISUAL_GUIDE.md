# AliceHire - Visual Guide

## User Journey Map

```
┌─────────────────────────────────────────────────────────────────┐
│                         LANDING PAGE                             │
│                    "AliceHire Platform"                          │
│                                                                  │
│                  [Login]    [Register]                           │
└────────────────────┬────────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────┐          ┌──────────────┐
│    LOGIN     │          │   REGISTER   │
│              │          │              │
│ Email: _____ │          │ Email: _____ │
│ Pass:  _____ │          │ User:  _____ │
│              │          │ Pass:  _____ │
│   [Submit]   │          │ Pass2: _____ │
└──────┬───────┘          │   [Submit]   │
       │                  └──────┬───────┘
       │                         │
       └────────────┬────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │     DASHBOARD         │
        │                       │
        │  Welcome, [User]      │
        │                       │
        │  [Create Session]     │
        │  [Join Session]       │
        │                       │
        │  Your Sessions:       │
        │  ┌─────────────────┐  │
        │  │ ABC123 - Active │  │
        │  │ [Monitor]       │  │
        │  └─────────────────┘  │
        └───────┬───────────────┘
                │
        ┌───────┴────────┐
        │                │
        ▼                ▼
┌──────────────┐  ┌──────────────┐
│CREATE SESSION│  │ JOIN SESSION │
│              │  │              │
│ Mode: [v]    │  │ Code: ______ │
│ □ Eye Track  │  │              │
│ □ Face Det   │  │   [Join]     │
│ □ Voice      │  │              │
│ □ Tab Det    │  └──────┬───────┘
│ □ Copy/Paste │         │
│              │         │
│  [Create]    │         │
└──────┬───────┘         │
       │                 │
       │                 │
       ▼                 ▼
┌──────────────┐  ┌──────────────┐
│   MONITOR    │  │     ROOM     │
│   (Host)     │  │ (Participant)│
└──────────────┘  └──────────────┘
```

## Screen Layouts

### Landing Page
```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║                      AliceHire                            ║
║           AI-Powered Interview Security Platform          ║
║                                                           ║
║                  ┌────────┐  ┌────────┐                  ║
║                  │ Login  │  │Register│                  ║
║                  └────────┘  └────────┘                  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

### Dashboard
```
╔═══════════════════════════════════════════════════════════╗
║ AliceHire           Welcome, John Doe          [Logout]  ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  ┌──────────────────┐  ┌──────────────────┐             ║
║  │ Create Session   │  │  Join Session    │             ║
║  └──────────────────┘  └──────────────────┘             ║
║                                                           ║
║  Your Sessions                                            ║
║  ┌─────────────────────────────────────────────────┐    ║
║  │ Code: ABC123  │  Mode: Interview  │  [Monitor]  │    ║
║  ├─────────────────────────────────────────────────┤    ║
║  │ Code: XYZ789  │  Mode: Meeting    │  [Monitor]  │    ║
║  └─────────────────────────────────────────────────┘    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

### Room Page (Participant View)
```
╔═══════════════════════════════════════════════════════════╗
║ Session: ABC123                    🔴 Proctoring Active  ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║                                                           ║
║              REMOTE VIDEO (Interviewer)                   ║
║                  [Full Screen]                            ║
║                                                           ║
║                                          ┌──────────┐    ║
║                                          │  LOCAL   │    ║
║                                          │  VIDEO   │    ║
║                                          │(Mirrored)│    ║
║                                          └──────────┘    ║
╠═══════════════════════════════════════════════════════════╣
║     [🎤 Mute]    [📹 Hide Video]    [❌ End Call]        ║
╚═══════════════════════════════════════════════════════════╝
```

### Monitor Dashboard (Host View)
```
╔═══════════════════════════════════════════════════════════════════╗
║ Monitor Dashboard - ABC123                    [Back to Dashboard] ║
╠═══════════════════════════════════════════╦═══════════════════════╣
║                                           ║  Live Alerts (5)      ║
║  ┌─────────────────────────────────┐     ║                       ║
║  │      HOST VIDEO                 │     ║ ┌───────────────────┐ ║
║  │                                 │     ║ │ TAB_SWITCH        │ ║
║  │                                 │     ║ │ Severity: HIGH    │ ║
║  │                                 │     ║ │ 10:35:00          │ ║
║  └─────────────────────────────────┘     ║ └───────────────────┘ ║
║                                           ║                       ║
║  ┌─────────────────────────────────┐     ║ ┌───────────────────┐ ║
║  │      RISK SCORE                 │     ║ │ FACE_MISSING      │ ║
║  │                                 │     ║ │ Severity: HIGH    │ ║
║  │         45                      │     ║ │ 10:36:00          │ ║
║  │       MEDIUM                    │     ║ └───────────────────┘ ║
║  │                                 │     ║                       ║
║  └─────────────────────────────────┘     ║ ┌───────────────────┐ ║
║                                           ║ │ GAZE_DEVIATION    │ ║
║                                           ║ │ Severity: MEDIUM  │ ║
║                                           ║ │ 10:37:00          │ ║
║                                           ║ └───────────────────┘ ║
╚═══════════════════════════════════════════╩═══════════════════════╝
```

## Data Flow Diagrams

### Authentication Flow
```
┌─────────┐         ┌─────────┐         ┌──────────┐
│ Browser │         │ Frontend│         │  Backend │
└────┬────┘         └────┬────┘         └────┬─────┘
     │                   │                   │
     │ 1. Enter creds    │                   │
     ├──────────────────>│                   │
     │                   │ 2. POST /login    │
     │                   ├──────────────────>│
     │                   │                   │
     │                   │ 3. JWT tokens     │
     │                   │<──────────────────┤
     │ 4. Store tokens   │                   │
     │<──────────────────┤                   │
     │                   │                   │
     │ 5. Redirect       │                   │
     │<──────────────────┤                   │
     │                   │                   │
```

### WebRTC Connection Flow
```
┌──────────┐         ┌──────────┐         ┌──────────┐
│   Host   │         │WebSocket │         │Participant│
└────┬─────┘         └────┬─────┘         └────┬─────┘
     │                    │                     │
     │ 1. Connect         │                     │
     ├───────────────────>│                     │
     │                    │ 2. Connect          │
     │                    │<────────────────────┤
     │                    │                     │
     │                    │ 3. peer_joined      │
     │<───────────────────┤                     │
     │                    │                     │
     │ 4. Create offer    │                     │
     ├───────────────────>│                     │
     │                    │ 5. Forward offer    │
     │                    ├────────────────────>│
     │                    │                     │
     │                    │ 6. Create answer    │
     │                    │<────────────────────┤
     │ 7. Forward answer  │                     │
     │<───────────────────┤                     │
     │                    │                     │
     │ 8. ICE candidates  │                     │
     │<──────────────────>│<───────────────────>│
     │                    │                     │
     │ 9. P2P Connection Established            │
     │<────────────────────────────────────────>│
     │          Video/Audio Streams             │
```

### Proctoring Alert Flow
```
┌──────────┐    ┌──────────┐    ┌─────────┐    ┌─────────┐
│Proctoring│    │ Frontend │    │ Backend │    │ Monitor │
│   Hook   │    │          │    │         │    │         │
└────┬─────┘    └────┬─────┘    └────┬────┘    └────┬────┘
     │               │               │              │
     │ 1. Detect     │               │              │
     │   violation   │               │              │
     ├──────────────>│               │              │
     │               │ 2. POST alert │              │
     │               ├──────────────>│              │
     │               │               │              │
     │               │               │ 3. Save DB   │
     │               │               ├─────────┐    │
     │               │               │<────────┘    │
     │               │               │              │
     │               │               │ 4. Broadcast │
     │               │               ├─────────────>│
     │               │               │              │
     │               │ 5. 201 OK     │              │
     │               │<──────────────┤              │
     │               │               │              │
```

## Component Hierarchy

### Frontend Component Tree
```
App
├── AuthProvider
│   ├── Landing
│   ├── Login
│   ├── Register
│   └── ProtectedRoute
│       ├── Dashboard
│       ├── CreateSession
│       ├── JoinSession
│       ├── Room
│       │   ├── usePeerConnection
│       │   ├── useSignaling
│       │   ├── useEyeTracking
│       │   ├── useFaceDetection
│       │   ├── useVoiceAnalysis
│       │   ├── useTabDetection
│       │   └── useCopyPaste
│       └── Monitor
│           ├── useSignaling
│           └── useRiskScore
```

### Backend App Structure
```
Django Project
├── authentication
│   ├── models (User)
│   ├── serializers
│   ├── views (Register, Login, Me)
│   └── urls
├── sessions
│   ├── models (Session)
│   ├── serializers
│   ├── views (CRUD operations)
│   └── urls
├── alerts
│   ├── models (Alert)
│   ├── serializers
│   ├── views (Create, List)
│   └── urls
└── signaling
    ├── consumer (WebSocket)
    ├── middleware (JWT Auth)
    └── routing
```

## Proctoring Features Visual

### Eye Tracking
```
     ┌─────────────────┐
     │   Camera View   │
     │                 │
     │    ●     ●      │  ← Eyes detected
     │      ▼          │  ← Nose position
     │                 │
     │   Gaze: LEFT    │  ← Direction calculated
     └─────────────────┘
     
Alert if gaze != CENTER for >2s
```

### Face Detection
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  1 Face ✓       │     │  0 Faces ✗      │     │  2 Faces ✗      │
│                 │     │                 │     │                 │
│    ┌─────┐     │     │                 │     │  ┌───┐  ┌───┐  │
│    │ 😊  │     │     │                 │     │  │😊 │  │😊 │  │
│    └─────┘     │     │                 │     │  └───┘  └───┘  │
│                 │     │                 │     │                 │
│   Status: OK    │     │  Alert: MISSING │     │ Alert: MULTIPLE │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Risk Score Calculation
```
Alert Type          Weight    Count    Score
─────────────────────────────────────────────
face_missing          10    ×   2   =   20
multiple_faces        15    ×   1   =   15
gaze_deviation         5    ×   3   =   15
tab_switch             8    ×   2   =   16
copy_paste            12    ×   1   =   12
multiple_voices        7    ×   0   =    0
                                    ─────────
                              TOTAL =   78

Risk Level: HIGH (60-100)
Color: 🔴 Red
```

## Database Schema

### MongoDB Collections

#### users
```json
{
  "_id": ObjectId("..."),
  "email": "user@example.com",
  "username": "johndoe",
  "password": "hashed_password",
  "created_at": ISODate("2026-04-05T10:30:00Z")
}
```

#### sessions
```json
{
  "_id": ObjectId("..."),
  "code": "ABC123",
  "host": 1,
  "mode": "interview",
  "config": {
    "eyeTracking": true,
    "faceDetection": true,
    "voiceAnalysis": true,
    "tabDetection": true,
    "copyPaste": true
  },
  "created_at": ISODate("2026-04-05T10:30:00Z"),
  "status": "active"
}
```

#### alerts
```json
{
  "_id": ObjectId("..."),
  "session_code": "ABC123",
  "type": "tab_switch",
  "severity": "high",
  "timestamp": ISODate("2026-04-05T10:35:00Z"),
  "metadata": {
    "event": "blur"
  }
}
```

## Network Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Internet                              │
└────────────────────────┬────────────────────────────────┘
                         │
                         │ HTTPS/WSS
                         │
┌────────────────────────┴────────────────────────────────┐
│                  Load Balancer                           │
│                    (Nginx)                               │
└────────────────────────┬────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Django     │  │   Django     │  │   Django     │
│  Server 1    │  │  Server 2    │  │  Server 3    │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └─────────────────┼─────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   MongoDB    │  │    Redis     │  │   Static     │
│   Cluster    │  │   Cluster    │  │     CDN      │
└──────────────┘  └──────────────┘  └──────────────┘
```

## Color Coding

### Risk Levels
```
┌─────────────┬─────────┬────────────┐
│ Risk Level  │  Score  │   Color    │
├─────────────┼─────────┼────────────┤
│ LOW         │  0-29   │ 🟢 Green   │
│ MEDIUM      │ 30-59   │ 🟠 Orange  │
│ HIGH        │ 60-100  │ 🔴 Red     │
└─────────────┴─────────┴────────────┘
```

### Alert Severity
```
┌──────────┬────────────┐
│ Severity │   Color    │
├──────────┼────────────┤
│ LOW      │ 🟢 Green   │
│ MEDIUM   │ 🟠 Orange  │
│ HIGH     │ 🔴 Red     │
└──────────┴────────────┘
```

## File Size Distribution

```
Backend Files:  ~30 files  (~3,000 lines)
Frontend Files: ~25 files  (~2,500 lines)
Docs Files:     ~8 files   (~2,000 lines)
Config Files:   ~5 files   (~200 lines)
────────────────────────────────────────
Total:          ~68 files  (~7,700 lines)
```

## Technology Logos

```
Frontend:
[React] + [Vite] + [Router] + [Axios] + [face-api.js]

Backend:
[Django] + [DRF] + [Channels] + [MongoDB] + [Redis]

Real-time:
[WebRTC] + [WebSocket] + [STUN]

AI:
[face-api.js] + [TensorFlow.js]
```

## Quick Reference

### Ports
- Frontend: 5173
- Backend: 8000
- MongoDB: 27017
- Redis: 6379

### URLs
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api
- WebSocket: ws://localhost:8000/ws

### Default Credentials
- Create your own during registration
- No default admin account

### Session Codes
- Format: 6 uppercase alphanumeric characters
- Example: ABC123, XYZ789

This visual guide provides a comprehensive overview of the AliceHire platform's user interface, data flows, and architecture!
