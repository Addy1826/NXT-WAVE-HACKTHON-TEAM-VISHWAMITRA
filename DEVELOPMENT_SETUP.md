# Mental Health Crisis Detection Chatbot - Development Setup

## Quick Start Guide

### Prerequisites
- Python 3.8+ with pip
- Node.js 18+ with npm
- Git
- Docker (optional, for full stack deployment)

### 1. Clone and Setup Environment

```bash
# Clone the repository
git clone <your-repo-url>
cd mental_health_chatbot

# Copy environment configuration
cp .env.example .env

# Edit .env file with your configuration
# nano .env  # or use your preferred editor
```

### 2. Python ML Service Setup

```bash
# Navigate to project root (if not already there)
cd .

# Activate virtual environment (already exists)
# On Windows:
mental_health_env\Scripts\activate
# On Unix/macOS:
# source mental_health_env/bin/activate

# Install/upgrade Python dependencies
pip install torch transformers scikit-learn numpy pandas fastapi uvicorn python-multipart

# Test the ML crisis detection system
python test_crisis_detection.py
```

### 3. Backend API Setup (Node.js)

```bash
# Install backend dependencies
cd backend
npm install

# Build TypeScript
npm run build

# Start development server
npm run dev
```

### 4. Frontend Setup (React/Next.js)

```bash
# Navigate to frontend directory
cd ../frontend

# Initialize Next.js project (if not exists)
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Install additional dependencies
npm install socket.io-client axios react-hot-toast @heroicons/react framer-motion

# Start development server
npm run dev
```

### 5. Test the Complete System

#### Option A: Manual Testing

1. **Test ML Service:**
```bash
# From project root
python test_crisis_detection.py
```

2. **Test Backend API:**
```bash
cd backend
npm run dev
# Visit http://localhost:3001/health
```

3. **Test Frontend:**
```bash
cd frontend
npm run dev
# Visit http://localhost:3000
```

#### Option B: Docker Deployment

```bash
# From project root
docker-compose up -d

# Check all services
docker-compose ps

# View logs
docker-compose logs -f
```

### 6. Development Workflow

#### Running in Development Mode

1. **Terminal 1 - ML Service:**
```bash
cd ml-service
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

2. **Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

3. **Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```

#### Testing Crisis Detection

```bash
# Test individual message analysis
python -c "
from essential import analyze_message
result = analyze_message('I want to hurt myself')
print(f'Crisis Level: {result[\"crisis_level\"]}/10')
print(f'Urgency: {result[\"urgency\"]}')
print(f'Escalation Required: {result[\"requires_immediate_escalation\"]}')
"
```

### 7. API Testing

#### ML Service Endpoints
```bash
# Health check
curl http://localhost:8000/health

# Analyze message (requires auth token)
curl -X POST http://localhost:8000/analyze/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test_token" \
  -d '{"text": "I feel sad today", "user_id": "test_user"}'
```

#### Backend API Endpoints
```bash
# Health check
curl http://localhost:3001/health

# WebSocket connection test (use browser or WebSocket client)
# ws://localhost:3001/socket.io/?EIO=4&transport=websocket
```

### 8. Database Setup (Optional)

#### PostgreSQL
```bash
# Using Docker
docker run --name mental_health_postgres -e POSTGRES_DB=mental_health_db -e POSTGRES_USER=mental_health_user -e POSTGRES_PASSWORD=secure_password_123 -p 5432:5432 -d postgres:15-alpine

# Or install locally and create database
createdb mental_health_db
```

#### MongoDB
```bash
# Using Docker
docker run --name mental_health_mongodb -e MONGO_INITDB_ROOT_USERNAME=mental_health_admin -e MONGO_INITDB_ROOT_PASSWORD=secure_mongo_password_123 -p 27017:27017 -d mongo:6.0

# Or install locally (default port 27017)
```

#### Redis
```bash
# Using Docker
docker run --name mental_health_redis -p 6379:6379 -d redis:7-alpine redis-server --requirepass secure_redis_password_123

# Or install locally
redis-server
```

### 9. Environment Variables

Create `.env` file in project root:

```env
# Database
DATABASE_URL=postgresql://mental_health_user:secure_password_123@localhost:5432/mental_health_db
MONGODB_URI=mongodb://localhost:27017/mental_health_chatbot
REDIS_URL=redis://localhost:6379

# ML Service
ML_SERVICE_URL=http://localhost:8000
HUGGING_FACE_API_TOKEN=your_token_here

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# Crisis Management
CRISIS_HOTLINE_NUMBER=+1-800-273-8255
EMERGENCY_CONTACT_EMAIL=crisis@mentalhealthchatbot.com

# Development
NODE_ENV=development
LOG_LEVEL=debug
FRONTEND_URL=http://localhost:3000
```

### 10. Troubleshooting

#### Python Issues
```bash
# If torch installation fails
pip install torch --index-url https://download.pytorch.org/whl/cpu

# If transformers models don't download
export TRANSFORMERS_CACHE=./models
mkdir -p models
```

#### Node.js Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Port Conflicts
```bash
# Check what's using ports
netstat -an | findstr "3000\|3001\|8000"

# Kill processes (Windows)
taskkill /PID <process_id> /F

# Kill processes (Unix/macOS)
kill -9 <process_id>
```

### 11. Testing Scenarios

#### Crisis Detection Test Cases
```python
# High-risk messages
test_messages = [
    "I want to kill myself",
    "I can't take this pain anymore",
    "Nobody would miss me if I was gone",
    "I have a plan to end it all",
    "I want to hurt myself"
]

# Run through crisis detector
for msg in test_messages:
    result = analyze_message(msg)
    print(f"'{msg}' -> Level {result['crisis_level']}/10")
```

#### Performance Testing
```bash
# Load test ML service
curl -X POST http://localhost:8000/analyze/batch \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test_token" \
  -d '{
    "requests": [
      {"text": "Test message 1"},
      {"text": "Test message 2"},
      {"text": "Test message 3"}
    ]
  }'
```

### 12. Production Deployment

#### Docker Production
```bash
# Build production images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Deploy with environment variables
export NODE_ENV=production
export DATABASE_URL=postgresql://...
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

#### Manual Production Setup
1. Set up production databases
2. Configure environment variables
3. Build all services
4. Set up reverse proxy (Nginx)
5. Configure SSL certificates
6. Set up monitoring and logging

### 13. Monitoring and Logging

#### Health Checks
```bash
# Check all service health
curl http://localhost:8000/health  # ML Service
curl http://localhost:3001/health  # Backend
curl http://localhost:3000/api/health  # Frontend (if implemented)
```

#### Logs
```bash
# Docker logs
docker-compose logs -f ml-service
docker-compose logs -f backend
docker-compose logs -f frontend

# Local logs
tail -f backend/logs/combined.log
tail -f backend/logs/audit.log
```

### 14. Security Considerations

- Change all default passwords
- Use strong JWT secrets
- Enable HTTPS in production
- Implement proper authentication
- Set up HIPAA-compliant logging
- Configure firewalls and access controls
- Regular security updates

### 15. Support and Documentation

- API Documentation: http://localhost:8000/docs (ML Service)
- Backend API: http://localhost:3001/api/docs
- Health Monitoring: http://localhost:9090 (Prometheus)
- Grafana Dashboards: http://localhost:3002

---

## Quick Command Reference

```bash
# Start everything in development
npm run dev  # From project root

# Run tests
python test_crisis_detection.py  # ML tests
npm test  # Backend tests (if implemented)

# Docker commands
docker-compose up -d  # Start all services
docker-compose down   # Stop all services
docker-compose logs -f  # View logs

# Health checks
curl localhost:8000/health  # ML Service
curl localhost:3001/health  # Backend API
```

This setup provides a complete development environment for the Mental Health Crisis Detection Chatbot with all necessary components for testing and development.