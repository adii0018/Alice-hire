# AliceHire - Deployment Guide

## Pre-Deployment Checklist

### Backend Configuration

- [ ] Change `SECRET_KEY` in settings.py to a secure random string
- [ ] Set `DEBUG = False` in settings.py
- [ ] Update `ALLOWED_HOSTS` with your domain
- [ ] Configure environment variables (use .env file)
- [ ] Set up MongoDB authentication
- [ ] Set up Redis password
- [ ] Configure CORS for production domain
- [ ] Set up SSL/TLS certificates
- [ ] Configure static files serving
- [ ] Set up logging (file-based or cloud)
- [ ] Configure email backend (for password reset)

### Frontend Configuration

- [ ] Update API base URL in axios.js
- [ ] Update WebSocket URL in useSignaling.js
- [ ] Build production bundle (`npm run build`)
- [ ] Configure CDN for static assets
- [ ] Set up error tracking (Sentry)
- [ ] Configure analytics (Google Analytics)

### Infrastructure

- [ ] Set up production database (MongoDB Atlas or self-hosted)
- [ ] Set up Redis (AWS ElastiCache or self-hosted)
- [ ] Set up TURN server for WebRTC (coturn)
- [ ] Configure firewall rules
- [ ] Set up backup strategy
- [ ] Configure monitoring (Prometheus/Grafana)
- [ ] Set up CI/CD pipeline

## Environment Variables

Create `.env` file in backend directory:

```bash
# Django
SECRET_KEY=your-super-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Database
MONGODB_HOST=your-mongodb-host
MONGODB_PORT=27017
MONGODB_NAME=alicehire
MONGODB_USER=your-mongodb-user
MONGODB_PASSWORD=your-mongodb-password

# Redis
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# JWT
JWT_ACCESS_TOKEN_LIFETIME=3600  # 1 hour in seconds
JWT_REFRESH_TOKEN_LIFETIME=604800  # 7 days in seconds

# Email (optional)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-email-password
```

## Deployment Options

### Option 1: Traditional VPS (DigitalOcean, Linode, AWS EC2)

#### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python
sudo apt install python3.9 python3-pip python3-venv -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install mongodb-org -y
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Redis
sudo apt install redis-server -y
sudo systemctl start redis
sudo systemctl enable redis

# Install Nginx
sudo apt install nginx -y
```

#### 2. Deploy Backend

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/yourusername/alicehire.git
cd alicehire/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install gunicorn uvicorn

# Create .env file
sudo nano .env
# (paste environment variables)

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Create systemd service for Daphne
sudo nano /etc/systemd/system/alicehire.service
```

**alicehire.service**:
```ini
[Unit]
Description=AliceHire Daphne Server
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/alicehire/backend
Environment="PATH=/var/www/alicehire/backend/venv/bin"
ExecStart=/var/www/alicehire/backend/venv/bin/daphne -b 0.0.0.0 -p 8000 securehire.asgi:application

[Install]
WantedBy=multi-user.target
```

```bash
# Start service
sudo systemctl start alicehire
sudo systemctl enable alicehire
```

#### 3. Deploy Frontend

```bash
cd /var/www/alicehire/frontend

# Install dependencies
npm install

# Build production bundle
npm run build

# Copy build to Nginx directory
sudo cp -r dist/* /var/www/html/
```

#### 4. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/alicehire
```

**alicehire nginx config**:
```nginx
# HTTP redirect to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket
    location /ws/ {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files
    location /static/ {
        alias /var/www/alicehire/backend/staticfiles/;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/alicehire /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Option 2: Docker Deployment

#### 1. Create Dockerfile for Backend

**backend/Dockerfile**:
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "securehire.asgi:application"]
```

#### 2. Create Dockerfile for Frontend

**frontend/Dockerfile**:
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
```

#### 3. Docker Compose

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    depends_on:
      - mongodb
      - redis
    environment:
      - MONGODB_HOST=mongodb
      - REDIS_HOST=redis
    volumes:
      - ./backend:/app

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
  redis_data:
```

```bash
# Deploy with Docker Compose
docker-compose up -d
```

### Option 3: Cloud Platform (Heroku, AWS, GCP, Azure)

#### Heroku Deployment

1. Install Heroku CLI
2. Create Heroku app
3. Add MongoDB Atlas addon
4. Add Redis addon
5. Configure environment variables
6. Deploy:

```bash
heroku login
heroku create securehire-app
heroku addons:create mongolab
heroku addons:create heroku-redis
heroku config:set SECRET_KEY=your-secret-key
git push heroku main
```

## TURN Server Setup (for WebRTC)

### Install coturn

```bash
sudo apt install coturn -y
```

### Configure coturn

```bash
sudo nano /etc/turnserver.conf
```

**turnserver.conf**:
```
listening-port=3478
tls-listening-port=5349
listening-ip=YOUR_SERVER_IP
relay-ip=YOUR_SERVER_IP
external-ip=YOUR_SERVER_IP
realm=yourdomain.com
server-name=yourdomain.com
lt-cred-mech
user=username:password
no-stdout-log
log-file=/var/log/turnserver.log
```

```bash
sudo systemctl start coturn
sudo systemctl enable coturn
```

### Update Frontend WebRTC Config

```javascript
const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    {
      urls: 'turn:yourdomain.com:3478',
      username: 'username',
      credential: 'password'
    }
  ]
}
```

## Monitoring Setup

### 1. Application Monitoring

```bash
# Install Prometheus
wget https://github.com/prometheus/prometheus/releases/download/v2.40.0/prometheus-2.40.0.linux-amd64.tar.gz
tar xvfz prometheus-*.tar.gz
cd prometheus-*

# Configure prometheus.yml
# Start Prometheus
./prometheus --config.file=prometheus.yml
```

### 2. Log Monitoring

```bash
# Install ELK Stack (Elasticsearch, Logstash, Kibana)
# Or use cloud service like Papertrail, Loggly
```

### 3. Uptime Monitoring

- Use UptimeRobot, Pingdom, or StatusCake
- Monitor: API endpoints, WebSocket, frontend

## Backup Strategy

### MongoDB Backup

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
mongodump --out /backups/mongodb-$DATE
# Upload to S3 or other storage
aws s3 cp /backups/mongodb-$DATE s3://your-bucket/backups/
```

### Redis Backup

```bash
# Redis automatically saves to dump.rdb
# Copy to backup location
cp /var/lib/redis/dump.rdb /backups/redis-$(date +%Y%m%d).rdb
```

## Performance Optimization

### 1. Enable Gzip Compression (Nginx)

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
```

### 2. Enable Caching

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Database Indexing

```javascript
// MongoDB indexes
db.sessions.createIndex({ code: 1 })
db.alerts.createIndex({ session_code: 1, timestamp: -1 })
```

## Security Hardening

1. **Firewall**: Only allow ports 80, 443, 22
2. **SSH**: Disable password auth, use keys only
3. **Fail2ban**: Install to prevent brute force
4. **Updates**: Keep system and packages updated
5. **Secrets**: Never commit secrets to git
6. **HTTPS**: Force HTTPS everywhere
7. **Headers**: Add security headers (CSP, HSTS, etc.)

## Post-Deployment

- [ ] Test all features in production
- [ ] Monitor logs for errors
- [ ] Set up alerts for downtime
- [ ] Document any issues
- [ ] Create runbook for common issues
- [ ] Train team on deployment process
- [ ] Set up staging environment
- [ ] Create rollback plan

## Troubleshooting

### Backend not starting
- Check logs: `sudo journalctl -u securehire -f`
- Check MongoDB: `sudo systemctl status mongod`
- Check Redis: `sudo systemctl status redis`

### WebSocket not connecting
- Check Nginx WebSocket config
- Check firewall allows WebSocket
- Check SSL certificate

### High CPU usage
- Check face-api.js model loading
- Reduce detection frequency
- Scale horizontally

## Support

For production issues:
- Check logs first
- Review monitoring dashboards
- Contact support team
- Escalate if critical
