# SecureHire - API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <access_token>
```

---

## Authentication Endpoints

### 1. Register User

**Endpoint**: `POST /auth/register/`

**Description**: Create a new user account

**Request Body**:
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123!",
  "password2": "SecurePass123!"
}
```

**Response** (201 Created):
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "created_at": "2026-04-05T10:30:00Z"
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Errors**:
- 400: Validation error (passwords don't match, email exists, etc.)

---

### 2. Login

**Endpoint**: `POST /auth/login/`

**Description**: Login and receive JWT tokens

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200 OK):
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Errors**:
- 401: Invalid credentials

---

### 3. Refresh Token

**Endpoint**: `POST /auth/refresh/`

**Description**: Get new access token using refresh token

**Request Body**:
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response** (200 OK):
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Errors**:
- 401: Invalid or expired refresh token

---

### 4. Get Current User

**Endpoint**: `GET /auth/me/`

**Description**: Get current authenticated user info

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "created_at": "2026-04-05T10:30:00Z"
}
```

**Errors**:
- 401: Unauthorized (invalid or missing token)

---

## Session Endpoints

### 1. Create Session

**Endpoint**: `POST /sessions/create/`

**Description**: Create a new interview/meeting session

**Headers**:
```
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "mode": "interview",
  "config": {
    "eyeTracking": true,
    "faceDetection": true,
    "voiceAnalysis": true,
    "tabDetection": true,
    "copyPaste": true
  }
}
```

**Response** (201 Created):
```json
{
  "id": "507f1f77bcf86cd799439011",
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
  "created_at": "2026-04-05T10:30:00Z",
  "status": "active"
}
```

**Errors**:
- 400: Invalid mode or config
- 401: Unauthorized

---

### 2. List Sessions

**Endpoint**: `GET /sessions/`

**Description**: Get all sessions created by current user

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "code": "ABC123",
    "host": 1,
    "mode": "interview",
    "config": {...},
    "created_at": "2026-04-05T10:30:00Z",
    "status": "active"
  },
  {
    "id": "507f1f77bcf86cd799439012",
    "code": "XYZ789",
    "host": 1,
    "mode": "meeting",
    "config": {...},
    "created_at": "2026-04-05T11:00:00Z",
    "status": "active"
  }
]
```

**Errors**:
- 401: Unauthorized

---

### 3. Get Session by Code

**Endpoint**: `GET /sessions/:code/`

**Description**: Get session details by code

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
{
  "id": "507f1f77bcf86cd799439011",
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
  "created_at": "2026-04-05T10:30:00Z",
  "status": "active"
}
```

**Errors**:
- 404: Session not found
- 401: Unauthorized

---

### 4. Update Session

**Endpoint**: `PUT /sessions/:code/update/`

**Description**: Update session configuration (host only)

**Headers**:
```
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "config": {
    "eyeTracking": false,
    "faceDetection": true,
    "voiceAnalysis": true,
    "tabDetection": true,
    "copyPaste": false
  },
  "status": "active"
}
```

**Response** (200 OK):
```json
{
  "id": "507f1f77bcf86cd799439011",
  "code": "ABC123",
  "host": 1,
  "mode": "interview",
  "config": {
    "eyeTracking": false,
    "faceDetection": true,
    "voiceAnalysis": true,
    "tabDetection": true,
    "copyPaste": false
  },
  "created_at": "2026-04-05T10:30:00Z",
  "status": "active"
}
```

**Errors**:
- 403: Not the host
- 404: Session not found
- 401: Unauthorized

---

### 5. Delete Session

**Endpoint**: `DELETE /sessions/:code/delete/`

**Description**: Delete session (host only)

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (204 No Content)

**Errors**:
- 403: Not the host
- 404: Session not found
- 401: Unauthorized

---

## Alert Endpoints

### 1. Create Alert

**Endpoint**: `POST /alerts/`

**Description**: Create a proctoring alert (triggers WebSocket broadcast)

**Headers**:
```
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "session_code": "ABC123",
  "type": "tab_switch",
  "severity": "high",
  "metadata": {
    "timestamp": "2026-04-05T10:35:00Z",
    "event": "blur"
  }
}
```

**Alert Types**:
- `face_missing`: No face detected
- `multiple_faces`: Multiple faces detected
- `gaze_deviation`: Eyes looking away
- `tab_switch`: Tab switch or window blur
- `copy_paste`: Copy/paste/cut event
- `multiple_voices`: Background noise detected

**Severity Levels**:
- `low`: Minor issue
- `medium`: Moderate concern
- `high`: Serious violation

**Response** (201 Created):
```json
{
  "id": "507f1f77bcf86cd799439013",
  "session_code": "ABC123",
  "type": "tab_switch",
  "severity": "high",
  "timestamp": "2026-04-05T10:35:00Z",
  "metadata": {
    "timestamp": "2026-04-05T10:35:00Z",
    "event": "blur"
  }
}
```

**Errors**:
- 400: Invalid data
- 401: Unauthorized

---

### 2. Get Alerts for Session

**Endpoint**: `GET /alerts/:code/`

**Description**: Get all alerts for a session

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
[
  {
    "id": "507f1f77bcf86cd799439013",
    "session_code": "ABC123",
    "type": "tab_switch",
    "severity": "high",
    "timestamp": "2026-04-05T10:35:00Z",
    "metadata": {
      "timestamp": "2026-04-05T10:35:00Z",
      "event": "blur"
    }
  },
  {
    "id": "507f1f77bcf86cd799439014",
    "session_code": "ABC123",
    "type": "face_missing",
    "severity": "high",
    "timestamp": "2026-04-05T10:36:00Z",
    "metadata": {
      "faceCount": 0
    }
  }
]
```

**Errors**:
- 404: Session not found
- 401: Unauthorized

---

## WebSocket API

### Connection

**URL**: `ws://localhost:8000/ws/session/:code/?token=<jwt_token>`

**Description**: WebSocket connection for real-time signaling and alerts

**Authentication**: JWT token in query parameter

---

### Message Types

#### 1. Join (Client → Server)

```json
{
  "type": "join"
}
```

**Response** (Server → All Clients):
```json
{
  "type": "peer_joined",
  "user_id": 1
}
```

---

#### 2. Offer (Client → Server)

```json
{
  "type": "offer",
  "offer": {
    "type": "offer",
    "sdp": "v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\n..."
  }
}
```

**Response** (Server → Other Clients):
```json
{
  "type": "offer",
  "offer": {
    "type": "offer",
    "sdp": "v=0\r\no=- 123456789 2 IN IP4 127.0.0.1\r\n..."
  }
}
```

---

#### 3. Answer (Client → Server)

```json
{
  "type": "answer",
  "answer": {
    "type": "answer",
    "sdp": "v=0\r\no=- 987654321 2 IN IP4 127.0.0.1\r\n..."
  }
}
```

**Response** (Server → Other Clients):
```json
{
  "type": "answer",
  "answer": {
    "type": "answer",
    "sdp": "v=0\r\no=- 987654321 2 IN IP4 127.0.0.1\r\n..."
  }
}
```

---

#### 4. ICE Candidate (Client → Server)

```json
{
  "type": "ice",
  "candidate": {
    "candidate": "candidate:1 1 UDP 2130706431 192.168.1.100 54321 typ host",
    "sdpMLineIndex": 0,
    "sdpMid": "0"
  }
}
```

**Response** (Server → Other Clients):
```json
{
  "type": "ice",
  "candidate": {
    "candidate": "candidate:1 1 UDP 2130706431 192.168.1.100 54321 typ host",
    "sdpMLineIndex": 0,
    "sdpMid": "0"
  }
}
```

---

#### 5. Alert Update (Server → Clients)

**Triggered by**: POST /alerts/ API call

```json
{
  "type": "alert_update",
  "alert": {
    "id": "507f1f77bcf86cd799439013",
    "session_code": "ABC123",
    "type": "tab_switch",
    "severity": "high",
    "timestamp": "2026-04-05T10:35:00Z",
    "metadata": {
      "timestamp": "2026-04-05T10:35:00Z"
    }
  }
}
```

---

#### 6. Peer Left (Server → Clients)

**Triggered by**: Client disconnect

```json
{
  "type": "peer_left",
  "user_id": 1
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "detail": "Error message here"
}
```

Or for validation errors:

```json
{
  "field_name": ["Error message for this field"]
}
```

### Common HTTP Status Codes

- `200 OK`: Successful GET/PUT request
- `201 Created`: Successful POST request
- `204 No Content`: Successful DELETE request
- `400 Bad Request`: Invalid data
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Not authorized for this action
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## Rate Limiting

Currently no rate limiting implemented. For production:
- Implement rate limiting per user/IP
- Suggested: 100 requests per minute per user
- WebSocket: 1000 messages per minute per connection

---

## Pagination

Currently no pagination implemented. For production:
- Add pagination to list endpoints
- Use query parameters: `?page=1&limit=20`

---

## Example Usage (JavaScript)

### Register and Login

```javascript
// Register
const registerResponse = await fetch('http://localhost:8000/api/auth/register/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    username: 'johndoe',
    password: 'SecurePass123!',
    password2: 'SecurePass123!'
  })
})
const { access, refresh } = await registerResponse.json()
localStorage.setItem('access_token', access)
localStorage.setItem('refresh_token', refresh)

// Login
const loginResponse = await fetch('http://localhost:8000/api/auth/login/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123!'
  })
})
const tokens = await loginResponse.json()
```

### Create and Join Session

```javascript
// Create session
const token = localStorage.getItem('access_token')
const createResponse = await fetch('http://localhost:8000/api/sessions/create/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    mode: 'interview',
    config: {
      eyeTracking: true,
      faceDetection: true,
      voiceAnalysis: true,
      tabDetection: true,
      copyPaste: true
    }
  })
})
const session = await createResponse.json()
console.log('Session code:', session.code)

// Get session
const getResponse = await fetch(`http://localhost:8000/api/sessions/${session.code}/`, {
  headers: { 'Authorization': `Bearer ${token}` }
})
const sessionData = await getResponse.json()
```

### WebSocket Connection

```javascript
const token = localStorage.getItem('access_token')
const ws = new WebSocket(`ws://localhost:8000/ws/session/ABC123/?token=${token}`)

ws.onopen = () => {
  console.log('Connected')
  ws.send(JSON.stringify({ type: 'join' }))
}

ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  console.log('Received:', data)
  
  switch (data.type) {
    case 'peer_joined':
      console.log('Peer joined:', data.user_id)
      break
    case 'offer':
      console.log('Received offer:', data.offer)
      break
    case 'answer':
      console.log('Received answer:', data.answer)
      break
    case 'ice':
      console.log('Received ICE candidate:', data.candidate)
      break
    case 'alert_update':
      console.log('New alert:', data.alert)
      break
  }
}
```

---

## Testing with cURL

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","username":"test","password":"Test123!","password2":"Test123!"}'

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!"}'

# Create session (replace TOKEN)
curl -X POST http://localhost:8000/api/sessions/create/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"mode":"interview","config":{"eyeTracking":true}}'

# Get session (replace TOKEN and CODE)
curl -X GET http://localhost:8000/api/sessions/CODE/ \
  -H "Authorization: Bearer TOKEN"

# Create alert (replace TOKEN)
curl -X POST http://localhost:8000/api/alerts/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"session_code":"ABC123","type":"tab_switch","severity":"high","metadata":{}}'
```
