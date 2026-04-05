# AliceHire - Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Python 3.9+ installed
- ✅ Node.js 18+ installed
- ✅ MongoDB running on localhost:27017
- ✅ Redis running on localhost:6379

### Install MongoDB (if not installed)
**Windows**: Download from https://www.mongodb.com/try/download/community
**Mac**: `brew install mongodb-community`
**Linux**: `sudo apt-get install mongodb`

Start MongoDB: `mongod` or `brew services start mongodb-community`

### Install Redis (if not installed)
**Windows**: Download from https://github.com/microsoftarchive/redis/releases
**Mac**: `brew install redis`
**Linux**: `sudo apt-get install redis-server`

Start Redis: `redis-server`

## Quick Setup (5 minutes)

### Terminal 1 - Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
daphne -b 0.0.0.0 -p 8000 securehire.asgi:application
```

### Terminal 2 - Frontend

```bash
cd frontend
npm install
npm run dev
```

### Terminal 3 - Test MongoDB & Redis

```bash
# Test MongoDB
mongosh  # or mongo
> show dbs
> exit

# Test Redis
redis-cli
> ping
> exit
```

## Access the Application

Open browser: http://localhost:5173

## First Time Usage

1. Click "Register" and create an account
2. Login with your credentials
3. Click "Create Session"
4. Configure proctoring features
5. Share the 6-character code with participants
6. Click "Monitor" to view the monitoring dashboard

## Testing WebRTC

To test video calling:
1. Open two browser windows (or use incognito mode)
2. Login with different accounts in each
3. Create session in window 1 (Host)
4. Join session in window 2 (Participant) using the code
5. Both should see each other's video

## Troubleshooting

### Backend won't start
- Check MongoDB is running: `mongosh` or `mongo`
- Check Redis is running: `redis-cli ping`
- Check port 8000 is free: `netstat -an | grep 8000`

### Frontend won't start
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Check port 5173 is free

### WebRTC not connecting
- Allow camera/microphone permissions in browser
- Use Chrome or Firefox (best WebRTC support)
- Check browser console for errors

### Face detection not working
- Ensure camera is working
- Check browser console for face-api.js model loading
- Models load from CDN, ensure internet connection

## Default Ports

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- MongoDB: localhost:27017
- Redis: localhost:6379

## API Testing

You can test the API using curl or Postman:

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","username":"testuser","password":"testpass123","password2":"testpass123"}'

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"testpass123"}'
```

## Production Deployment Notes

For production deployment:
1. Change SECRET_KEY in settings.py
2. Set DEBUG=False
3. Configure proper ALLOWED_HOSTS
4. Use environment variables for sensitive data
5. Set up proper TURN server for WebRTC
6. Use production-grade ASGI server (uvicorn/hypercorn)
7. Set up SSL/TLS certificates
8. Configure MongoDB authentication
9. Configure Redis password

## Support

For issues or questions:
- Check browser console for errors
- Check Django logs in terminal
- Verify all services are running
- Ensure camera/microphone permissions granted
