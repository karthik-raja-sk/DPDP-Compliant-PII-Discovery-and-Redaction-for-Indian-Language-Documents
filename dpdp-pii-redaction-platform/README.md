# DPDP-Compliant Multilingual PII Discovery & Redaction Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.5-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

An enterprise-grade, production-ready solution for automated PII (Personally Identifiable Information) discovery, classification, and redaction. Specifically engineered to address the regulatory requirements of India's **Digital Personal Data Protection (DPDP) Act, 2023**.

---

## 🌟 Key Features

- 🔍 **Hybrid Multi-modal Discovery**: Leverage high-precision Regex patterns (Aadhaar, PAN, Passport) combined with advanced NLP/NER (Names, Locations, Organizations).
- 🇮🇳 **Multilingual Support**: Specialized models for major Indian languages including Hindi, Tamil, Telugu, and more.
- 🛡️ **Dynamic Redaction Engine**: Flexible output modes including **Full Masking**, **Partial Masking**, and **Entity Labeling**.
- 📈 **DPDP Risk Scoring**: Automated compliance assessment and risk-level categorization for all discovered entities.
- 📊 **Executive Dashboard**: Real-time analytics, trend visualization, and comprehensive audit logging.
- ⚡ **Scalable Architecture**: High-performance FastAPI backend with asynchronous processing via Celery and Redis.

---

## 🏗 System Architecture

The platform follows a modern microservices-inspired monolithic architecture, designed for scalability and maintainability.

- **Frontend**: Single Page Application (SPA) built with React and Vite, utilizing Tailwind CSS for a premium UI/UX.
- **Backend API**: Asynchronous RESTful API powered by FastAPI.
- **Task Queue**: Celery with Redis for background ML processing and file handling.
- **Data Layer**: PostgreSQL for structured metadata and SQLite fallbacks for localized environments.
- **AI/ML**: Integration with SpaCy, Microsoft Presidio, and custom rule-based scanners.

---

## 📂 Project Structure

```text
dpdp-pii-redaction-platform/
├── backend/            # FastAPI Backend & ML Workers
│   ├── app/            # Core Application Logic
│   └── data/           # Metadata Storage (Ignored in Git)
├── frontend/           # React + Vite Frontend
├── infra/              # Deployment Configuration (Docker, K8s)
├── ai_models/          # ML Model Definitions & Rules
└── scripts/            # Utility & Automation Scripts
```

---

## 🚀 Deployment Guide

### Prerequisites
- **Python**: 3.10 or higher
- **Node.js**: 18.0 or higher
- **Docker**: Latest stable version with Docker Compose

### Option 1: Docker (Recommended for Production)
Ensure Docker Desktop is running, then execute:
```bash
docker-compose -f infra/docker/docker-compose.yml up --build
```

### Option 2: Local Development Setup
The easiest way to start on Windows is using the provided automation script:
```powershell
./run_local.bat
```

#### Manual Steps:
1.  **Backend**:
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install -r requirements.txt
    uvicorn app.main:app --reload --port 8002
    ```
2.  **Worker**:
    ```bash
    cd backend
    celery -A app.worker worker --loglevel=info -P solo
    ```
3.  **Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

---

## 🔒 Security & Privacy

This project prioritizes data security and user privacy as its core mission.
- **Zero-Storage Policy**: Original documents can be purged immediately after processing.
- **Audit Logs**: Every redaction and discovery action is logged with timestamp and user ID.
- **Isolated Processing**: ML tasks run in isolated worker processes.

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
© 2024 DPDPShield Team. Professional Privacy Protection.
