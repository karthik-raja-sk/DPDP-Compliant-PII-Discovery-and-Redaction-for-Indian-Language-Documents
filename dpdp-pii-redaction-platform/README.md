# DPDPShield: Enterprise PII Discovery & Redaction Platform

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688?style=flat&logo=fastapi)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.5-38B2AC?style=flat&logo=tailwind-css)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker)

**DPDPShield** is an AI-powered enterprise privacy intelligence and redaction platform for Indian compliance workflows. Built to automate the discovery, classification, and redaction of Personally Identifiable Information (PII) according to the strict regulatory requirements of **India's Digital Personal Data Protection (DPDP) Act, 2023**.

> **Resume Pitch**: Architected a scalable, end-to-end privacy compliance platform utilizing a modern FastAPI + React/Vite stack. Integrates distributed background processing (Celery/Redis) with real-time SSE progress tracking, ensuring secure, high-fidelity redaction of multi-modal Indian PII data across structured and unstructured documents.

---

## 🌟 Core Enterprise Features

*   🔍 **Smart Multi-modal Discovery Engine**: Hybrid detection utilizing intelligent Regex, context-aware rule validation, and NLP analysis to identify Pan Cards, Aadhaar, Voter IDs, UPI, and banking records.
*   📐 **Real-time Document Risk Scoring**: Algorithmic risk evaluation (0-100) based on PII density, sensitivity weights, and dangerous data combinations.
*   🛡️ **Dynamic Redaction Policies**: Configurable enforcement with full masking, partial character reveal, and entity labeling across PDFs and raw text.
*   📊 **Actionable Privacy Intelligence**: A beautiful, premium light-themed **Enterprise Dashboard** providing interactive `Recharts` analytics on system compliance health.
*   ⚖️ **Comprehensive Audit Ledger**: Permanent, searchable tracking of all data lifecycle events (Uploads, Scans, Purges) with strict RBAC boundary enforcement (Admin, Analyst, Auditor).
*   🚀 **Asynchronous Processing Pipeline**: Robust background job handling for large document batches using Celery and Redis, complete with live Server-Sent Events (SSE) progress streaming.

---

## 📸 Platform Interface

| Dashboard & Analytics | Side-by-Side Forensics |
| :---: | :---: |
| ![Dashboard Placeholer](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=400) | ![Forensics Placeholder](https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=600&h=400) |
| *Real-time insights and Document Risk Scoring.* | *High-fidelity Redaction & Compliance verification.* |

| Secure Document Gateway | Audit Ledger |
| :---: | :---: |
| ![Upload Placeholder](https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600&h=400) | ![Ledger Placeholder](https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600&h=400) |
| *Drag-and-drop secure upload pipeline.* | *Searchable, immutable compliance history.* |

---

## 🏗️ System Architecture

DPDPShield employs a modern, decoupled microservices-inspired architecture optimized for scalability and isolation of computational workloads.

*   **Frontend**: React 18 SPA via Vite, styled with Tailwind CSS (Premium Indigo/Slate Design System).
*   **API Gateway & Core**: Asynchronous RESTful API powered by FastAPI & Uvicorn.
*   **Background Workers**: Celery distributed task queue backed by Redis, isolating intensive ML extraction processes.
*   **Data Persistence**: SQLAlchemy ORM compatible with PostgreSQL (defaulting to SQLite for rapid local dev).
*   **Orchestration**: Fully containerized using `docker-compose` for reproducible production builds.

---

## ⚙️ Environment Configuration

Define these variables in `.env` within the `backend/` directory or inject them via your CI/CD pipeline:

```env
# Security Core
SECRET_KEY="generate-a-strong-256-bit-secret-key-here"
ENVIRONMENT="production" # or "development"

# Database Configuration (Postgres/SQLite)
SQLALCHEMY_DATABASE_URI="sqlite:///./data/pii_demo.db" 

# Background Worker Configuration
USE_CELERY=true
CELERY_BROKER_URL="redis://redis:6379/0"
CELERY_RESULT_BACKEND="redis://redis:6379/0"
```

---

## 🚀 Setup & Deployment Guide

DPDPShield is Docker-native. The entire platform (Frontend + Backend + Celery Worker + Redis) can be spun up seamlessly.

### 1. Production Docker Orchestration (Recommended)

1.  Clone the repository and configure your `.env` variables.
2.  Deploy the entire stack using Docker Compose:

```bash
docker-compose up -d --build
```

3.  Access the platform:
    *   **Frontend UI**: `http://localhost` (Served via Nginx)
    *   **Backend API Docs**: `http://localhost:8000/docs` (Swagger UI)

### 2. Local Development (Manual Setup)

**Backend Setup:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Celery Worker Setup (In a separate terminal):**
```bash
cd backend
source venv/bin/activate
celery -A app.worker.celery_app worker --loglevel=info
```

**Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```

---

## 📡 API Overview

The platform exposes a comprehensive, RBAC-protected RESTful API documented via OpenAPI.

| Endpoint | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/api/v1/auth/login` | `POST` | Public | Authenticates user and issues JWT. |
| `/api/v1/upload/` | `POST` | Analyst, Admin | Intakes raw documents into the secure local vault. |
| `/api/v1/scan/{id}` | `POST` | Analyst, Admin | Enqueues the document into the Celery processing pipeline. |
| `/api/v1/scan/{id}/stream` | `GET` | Analyst, Admin | SSE endpoint pushing real-time scan progress updates. |
| `/api/v1/document/{id}/redact` | `POST` | Analyst, Admin | Applies selected redaction policies to the source text. |
| `/api/v1/scan/{id}/report` | `GET` | All | Generates a DPDP Risk Assessment Report (JSON). |
| `/api/v1/audit/` | `GET` | Auditor, Admin | Retrieves the immutable compliance ledger. |

---

## 🔮 Future Scope & Roadmap

*   **Cloud Object Storage**: Migration from local filesystem vault to AWS S3 / Azure Blob Storage.
*   **Webhooks**: Integration engine to fire webhooks upon critical risk detection (score > 90).
*   **Expanded NER Models**: Fine-tuning regional LLMs (e.g., Sarvam AI) for deeper contextual Indian language understanding.
*   **Kubernetes Helm Charts**: Transitioning from `docker-compose` to fully distributed K8s deployments for auto-scaling worker nodes.

---
*Architected for strict compliance. Engineered for scale.* 
**© 2026 DPDPShield Team.**
