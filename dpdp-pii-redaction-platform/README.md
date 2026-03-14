# DPDP-Compliant Multilingual PII Discovery & Redaction Platform

A production-style, enterprise-grade full-stack platform for detecting, classifying, and redacting Personally Identifiable Information (PII) from documents, specifically designed for the Indian regulatory context (DPDP Act).

## 🚀 Key Features

- **Hybrid PII Discovery**: Combines Regex (Aadhaar, PAN, Passport) with NLP/NER (Names, Locations, Orgs).
- **Indian Language Support**: Advanced support for Hindi, Tamil, Telugu, and other regional languages.
- **Dynamic Redaction**: Multiple modes (Full Masking, Partial Masking, Entity Labeling).
- **DPDP Risk Scoring**: Automated risk level assessment and compliance tracking.
- **Enterprise Dashboard**: Real-time analytics, discovery trends, and audit logs.
- **Scalable Architecture**: FastAPI async backend with Celery/Redis for intensive ML tasks.

## 🛠 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Recharts, Framer Motion.
- **Backend**: Python FastAPI, SQLAlchemy, Alembic, Pydantic.
- **Database**: PostgreSQL (Structured data), Redis (Cache/Broker).
- **AI/ML**: Spacy, Regex rules, Custom Confidence Scorer.
- **Infrastructure**: Docker, Docker Compose, Nginx.

## 📂 Project Structure

```text
dpdp-pii-redaction-platform/
├── backend/            # FastAPI Backend
├── frontend/           # React + Vite Frontend
├── infra/              # Docker & K8s config
├── ai_models/          # ML Model abstractions
└── data/               # Persistent file storage
```

## 🏁 Quick Start

### 1. Prerequisite
- Python 3.10+
- Node.js 18+
- Docker & Docker Compose

### 2. Running with Docker (Recommended)
```bash
docker-compose -f infra/docker/docker-compose.yml up --build
```

### 3. Local Manual Setup
**Backend API:**
```bash
cd backend
# 1. Start Infrastructure (Redis)
# docker run --name dpdp-redis -p 6379:6379 -d redis
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8002
```

**Celery Worker:**
```bash
cd backend
celery -A app.worker worker --loglevel=info -P solo
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 🛡 Security & Compliance

This platform is designed to help organizations comply with the **Digital Personal Data Protection (DPDP) Act, 2023**. 
- Audit logs for every discovery action.
- AES-256 encryption for data at rest.
- Role-Based Access Control (RBAC).

## 📄 License
MIT License - See [LICENSE](LICENSE) for details.
