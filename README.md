# Mental Health Crisis Detection Chatbot

## 🎯 Mission
An AI-powered mental health chatbot that detects crisis levels in real-time through advanced sentiment analysis and routes high-risk users immediately to licensed mental health professionals.

## 🏗️ Architecture
```
Frontend (React/Next.js) ↔ Backend (Node.js/Express) ↔ ML Service (Python/FastAPI)
                                    ↕
                     Crisis Management System ↔ Professional Network
                                    ↕
                        Database (MongoDB/PostgreSQL) + Redis Cache
```

## 🚀 Key Features
- **Real-time Crisis Detection**: Advanced AI models (RoBERTa, MentalBERT) with <200ms response time
- **Multi-language Support**: English, Spanish, French, German, Hindi, Arabic
- **Escalation Protocol**: 10-level severity scoring with automated professional routing
- **HIPAA Compliance**: End-to-end encryption, audit logging, secure data storage
- **24/7 Availability**: WebSocket-based real-time chat with professional network integration
- **Accessibility**: WCAG 2.1 AA compliance, voice input/output, PWA capabilities

## 📁 Project Structure
```
├── frontend/                 # React/Next.js client application
├── backend/                  # Node.js/Express API server
├── ml-service/              # Python/FastAPI ML pipeline
├── shared/                  # Common types, utilities, configs
├── database/                # Database schemas and migrations
├── infrastructure/          # Docker, K8s, deployment configs
├── docs/                    # API documentation, architecture
└── tests/                   # End-to-end and integration tests
```

## 🛠️ Tech Stack
- **Frontend**: React 18, Next.js 14, TypeScript, Tailwind CSS, PWA
- **Backend**: Node.js, Express, Socket.io, JWT, bcrypt
- **ML Service**: Python, FastAPI, PyTorch, Transformers, spaCy
- **Database**: PostgreSQL, MongoDB, Redis
- **Cloud**: AWS/Azure, Docker, Kubernetes
- **Security**: HIPAA compliance, end-to-end encryption

## 🚦 Getting Started
1. Clone the repository
2. Install dependencies: `npm run install:all`
3. Set up environment variables
4. Run development servers: `npm run dev`
5. Access the application at `http://localhost:3000`

## 📋 Crisis Detection Levels
- **Level 1-3 (LOW)**: Peer support, self-help resources
- **Level 4-6 (MODERATE)**: Qualified counselor assignment
- **Level 7-8 (HIGH)**: Immediate professional intervention
- **Level 9-10 (CRITICAL)**: Emergency services + crisis team alert

## 🔒 Security & Compliance
- HIPAA-compliant data handling
- End-to-end encryption
- Audit logging for all interactions
- Secure authentication and authorization
- Data retention and deletion policies

## 📞 Professional Network Integration
- Real-time video calling (ZEGOCLOUD/Daily.co)
- Licensed therapist matching
- 24/7 crisis hotline integration
- Automated appointment scheduling

## 🌍 Multi-language Support
Supported languages: English, Spanish, French, German, Hindi, Arabic
- Automatic language detection
- Real-time translation capabilities
- Culturally sensitive crisis detection

## 🧪 Testing
- Unit tests: `npm run test`
- Integration tests: `npm run test:integration`
- E2E tests: `npm run test:e2e`
- ML model validation: `python -m pytest ml-service/tests/`

## 📊 Monitoring & Analytics
- Real-time crisis detection metrics
- Professional response times
- User engagement analytics
- System performance monitoring

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer
This chatbot is designed to assist with mental health support but should not replace professional medical advice, diagnosis, or treatment. In case of emergency, please contact emergency services immediately.