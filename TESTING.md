# AliceHire - Testing Guide

## Manual Testing Checklist

### 1. Authentication Tests

#### Register
- [ ] Navigate to http://localhost:5173/register
- [ ] Fill in email, username, password, confirm password
- [ ] Click Register
- [ ] Should redirect to dashboard
- [ ] Token should be stored in localStorage

#### Login
- [ ] Navigate to http://localhost:5173/login
- [ ] Enter email and password
- [ ] Click Login
- [ ] Should redirect to dashboard

#### Protected Routes
- [ ] Try accessing /dashboard without login
- [ ] Should redirect to /login
- [ ] Login and access /dashboard
- [ ] Should work

### 2. Session Management Tests

#### Create Session
- [ ] Login as Host
- [ ] Click "Create Session"
- [ ] Select mode (Interview/Meeting)
- [ ] Toggle proctoring features
- [ ] Click "Create Session"
- [ ] Should redirect to Monitor page
- [ ] Note the 6-character code

#### List Sessions
- [ ] Go to Dashboard
- [ ] Should see list of created sessions
- [ ] Each session shows code, mode, status

#### Join Session
- [ ] Login as different user (Participant)
- [ ] Click "Join Session"
- [ ] Enter session code
- [ ] Click "Join Session"
- [ ] Should redirect to Room page

### 3. WebRTC Video Tests

#### Local Video
- [ ] Join room as participant
- [ ] Should see local video (mirrored) in bottom-right corner
- [ ] Camera permission should be requested

#### Remote Video
- [ ] Have host and participant in same session
- [ ] Both should see each other's video
- [ ] Video should be smooth (check network)

#### Controls
- [ ] Click "Mute" button
- [ ] Audio should be muted
- [ ] Click "Hide Video" button
- [ ] Video should turn off
- [ ] Click "End Call"
- [ ] Should return to dashboard

### 4. Proctoring Tests

#### Eye Tracking
- [ ] Enable eye tracking in session config
- [ ] Join as participant
- [ ] Look away from screen for 3+ seconds
- [ ] Alert should be generated
- [ ] Check Monitor dashboard for alert

#### Face Detection
- [ ] Enable face detection
- [ ] Join as participant
- [ ] Move out of camera frame
- [ ] Alert: "face_missing" should trigger
- [ ] Have another person enter frame
- [ ] Alert: "multiple_faces" should trigger

#### Tab Detection
- [ ] Enable tab detection
- [ ] Join as participant
- [ ] Switch to another tab
- [ ] Alert: "tab_switch" should trigger
- [ ] Check Monitor for alert

#### Copy/Paste Detection
- [ ] Enable copy/paste detection
- [ ] Join as participant
- [ ] Copy text (Ctrl+C)
- [ ] Alert: "copy_paste" should trigger
- [ ] Paste text (Ctrl+V)
- [ ] Another alert should trigger

#### Voice Analysis
- [ ] Enable voice analysis
- [ ] Join as participant
- [ ] Play loud music or have background noise
- [ ] Alert: "multiple_voices" should trigger after 3s

### 5. Monitor Dashboard Tests

#### Real-time Alerts
- [ ] Host opens Monitor page
- [ ] Participant triggers alerts
- [ ] Alerts should appear in real-time on Monitor
- [ ] Each alert shows type, severity, timestamp

#### Risk Score
- [ ] Monitor should show risk score (0-100)
- [ ] Score should update as alerts come in
- [ ] Risk level should be color-coded:
  - Green: Low (0-29)
  - Orange: Medium (30-59)
  - Red: High (60+)

#### Video Feed
- [ ] Monitor should show host's video
- [ ] Video should be live and working

### 6. WebSocket Tests

#### Connection
- [ ] Open browser DevTools > Network > WS
- [ ] Join a session
- [ ] Should see WebSocket connection to ws://localhost:8000/ws/session/:code/
- [ ] Status should be 101 (Switching Protocols)

#### Messages
- [ ] Check WS messages in DevTools
- [ ] Should see: peer_joined, offer, answer, ice, alert_update
- [ ] Messages should be JSON formatted

#### Reconnection
- [ ] Join a session
- [ ] Stop backend server
- [ ] Wait 3 seconds
- [ ] Restart backend
- [ ] WebSocket should reconnect automatically

### 7. API Tests

Use curl or Postman:

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","username":"test","password":"Test123!@#","password2":"Test123!@#"}'

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!@#"}'

# Get current user (use token from login)
curl -X GET http://localhost:8000/api/auth/me/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Create session
curl -X POST http://localhost:8000/api/sessions/create/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"mode":"interview","config":{"eyeTracking":true,"faceDetection":true}}'

# List sessions
curl -X GET http://localhost:8000/api/sessions/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get session by code
curl -X GET http://localhost:8000/api/sessions/ABC123/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Create alert
curl -X POST http://localhost:8000/api/alerts/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"session_code":"ABC123","type":"tab_switch","severity":"high","metadata":{}}'

# Get alerts
curl -X GET http://localhost:8000/api/alerts/ABC123/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Browser Compatibility

Test on:
- [ ] Chrome (recommended)
- [ ] Firefox
- [ ] Edge
- [ ] Safari (may have WebRTC issues)

## Performance Tests

### Video Quality
- [ ] Check video is smooth (30fps)
- [ ] Check audio is clear
- [ ] Monitor CPU usage (should be <50%)

### Network
- [ ] Test on different network speeds
- [ ] Check WebRTC stats in chrome://webrtc-internals

### Face Detection Performance
- [ ] Should run at 1fps (every 1000ms)
- [ ] Should not lag video
- [ ] Check console for errors

## Known Issues & Limitations

1. **WebRTC on localhost**: Works fine, but needs TURN server for production
2. **Face-api.js models**: Load from CDN, requires internet
3. **MongoDB djongo**: May have compatibility issues with latest MongoDB
4. **Safari WebRTC**: Limited support, use Chrome/Firefox
5. **Mobile**: Not optimized for mobile browsers

## Debugging Tips

### Backend Issues
```bash
# Check Django logs
python manage.py runserver --verbosity 3

# Check MongoDB
mongosh
> use alicehire
> db.sessions.find()
> db.alerts.find()

# Check Redis
redis-cli
> KEYS *
> GET key_name
```

### Frontend Issues
```javascript
// Check localStorage
console.log(localStorage.getItem('access_token'))

// Check WebSocket
// Open DevTools > Network > WS tab

// Check face-api.js
console.log(faceapi.nets)
```

## Automated Testing (Future)

For production, implement:
- Unit tests (pytest for backend, Jest for frontend)
- Integration tests (Selenium/Playwright)
- Load tests (Locust for backend)
- WebRTC tests (testrtc.com)

## Security Testing

- [ ] Test JWT expiration and refresh
- [ ] Test unauthorized access to sessions
- [ ] Test XSS prevention
- [ ] Test CORS configuration
- [ ] Test WebSocket authentication
