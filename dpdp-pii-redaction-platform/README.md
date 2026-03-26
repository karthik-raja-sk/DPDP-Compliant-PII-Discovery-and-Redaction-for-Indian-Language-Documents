<div align="center">
  <img src="https://img.shields.io/badge/Status-Production--Ready-success?style=for-the-badge" alt="Status"/>
  <img src="https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>

  <h1>DPDPShield: Enterprise Privacy Intelligence Platform</h1>
  <p><b>AI-powered PII discovery, risk scoring, and DPDP-compliant redaction platform</b></p>
</div>

---

## 📖 Overview

In modern data architectures, protecting Personally Identifiable Information (PII) is no longer optional—it is a critical legal mandate. **DPDPShield** solves the complex challenge of algorithmic data sovereignty for enterprise compliance teams. 

Specifically engineered to address the strict regulatory requirements of **India's Digital Personal Data Protection (DPDP) Act, 2023**, this platform leverages zero-shot NLP and heuristic parsing to autonomously discover, score, and redact sensitive Indian data formats (Aadhaar, PAN, UPI) within large document sets. It protects organizational reputation, automates compliance auditing, and completely eliminates the risk of manual PII leaks.

### Why This Project Matters
With data breaches incurring massive regulatory fines, organizations cannot rely on manual auditors to redact sensitive information. DPDPShield proves how modern software architecture can cleanly decouple a user-facing Web Server from heavy Machine Learning inferences—guaranteeing strict privacy compliance without crashing production systems under load. 

---

## ⚡ Key Engineering Highlights

- **Asynchronous Task Parallelization:** Engineered an event-driven Redis/Celery queue to entirely offload heavy PyMuPDF parsing from the primary FastAPI event loop, ensuring horizontal scalability.
- **Zero-Trust Access Control:** Enforced immutable Role-Based Access Control (RBAC) via cryptographically verified JWT dependency injection routing.
- **Real-Time Data Streaming:** Bypassed traditional long-polling by streaming continuous progression telemetry via Server-Sent Events (SSE) directly to the React Virtual DOM.
- **Zero-Shot NLP Intelligence:** Integrated Microsoft Presidio’s deterministic/stochastic ML recognition matrix to dynamically score semantic contextual privacy risks.

---

## ✨ Enterprise Features

*   **Intelligent PII Detection (Indian Context):** Hybrid detection engine combining Microsoft Presidio zero-shot NLP with localized deterministic models to accurately isolate Aadhaar, PAN, and UPI identifiers.
*   **Dynamic Risk Scoring:** Algorithmic calculation of document vulnerability (0-100) based on contextual sensitivity density, penalizing unencrypted high-variance data.
*   **Policy-Based Redaction:** Cryptographic orchestration allowing users to execute structural masking, partial character hashing (e.g., `XXXX-XXXX-1234`), or categorical entity aliasing.
*   **Async Processing (Celery + Redis):** Enterprise-grade background task queue designed to parallelize heavy PyMuPDF extraction jobs without blocking the main event gateway.
*   **Zero-Trust RBAC Security:** Strict JSON Web Token (JWT) compliance enforcing segregation of duties across Administrator, Analyst, and Auditor boundary paths.
*   **Immutable Audit & Compliance Dashboard:** Cryptographically isolated ledger tracing every file upload, redaction policy, and permanent deletion action.
*   **Side-by-Side Forensics Alignment:** High-fidelity UI comparison viewer mapping the original uploaded document against the mathematically redacted output.
*   **Real-Time Progress Telemetry:** Server-Sent Events (SSE) streaming live inference progression metrics directly to the React Virtual DOM without polling.

---

## 🏗️ System Architecture Flow

DPDPShield relies on a decoupled, containerized microservices architecture to ensure high availability and inference scale:

1. **Client Gateway (React/Tailwind):** The Analyst securely uploads a document via the SPA. The React client immediately establishes a persistent SSE connection.
2. **API Manager (FastAPI):** The Uvicorn standard routes the request, writes the payload to an algorithmic filesystem vault, and dispatches a lightweight message to the memory broker.
3. **Message Broker (Redis):** Orchestrates the high-throughput task queue, storing immediate trajectory state without touching the primary relational database.
4. **Targeted Subsystem Fleet (Celery):** Isolated background processes fetch the job, execute the PyMuPDF/Microsoft Presidio intelligence engine natively, securely push Redaction coordinates, and commit the final cryptographic signature to the Immutable Audit Ledger (SQLite/Postgres).

---

## 🖥️ Platform Showcase

*(Replace placeholders below with actual production screenshots)*

### 1. Enterprise Dashboard
![Dashboard Screenshot Placeholder](https://placehold.co/800x400/1e293b/ffffff?text=Enterprise+Analytics+Dashboard)
*Real-time compliance telemetry, PII distribution charts, and DPDP risk indexing.*

### 2. Document Extraction Gateway
![Upload Screenshot Placeholder](https://placehold.co/800x400/1e293b/ffffff?text=Secure+Upload+%26+Scan+Gateway)
*Drag-and-drop secure upload with live SSE trajectory tracking.*

### 3. Forensic Policy Masking
![Scan Result Placeholder](https://placehold.co/800x400/1e293b/ffffff?text=Side-by-Side+Redaction+Forensics)
*Side-by-side risk visualization with granular redaction mode selection.*

### 4. Immutable Audit Ledger
![Audit History Placeholder](https://placehold.co/800x400/1e293b/ffffff?text=Immutable+Audit+Ledger)
*Cryptographic ledger documenting all Analyst processing operations.*

---

## 🚀 Installation & Setup

### Requirements
*   Python 3.10+
*   Node.js 18+
*   Redis server (runs natively or via Docker)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/DPDP-Compliant-PII-Discovery-and-Redaction-for-Indian-Language-Documents.git
cd dpdp-pii-redaction-platform
```

### 2. Backend & Worker Initialization
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
python -m spacy download en_core_web_sm

# Start the Redis server (ensure port 6379 is open)
redis-server

# Run the FastAPI Web Server
uvicorn app.main:app --reload --port 8000

# Run the Celery Worker (In a separate terminal)
celery -A app.worker.celery_app worker --loglevel=info
```

### 3. Frontend Initialization
```bash
cd frontend
npm install
npm run dev
# The React dashboard will be available at http://localhost:5173
```

---

## 🔐 Environment Variables

Create a strict `.env` inside the `backend/` directory explicitly omitting secrets from version control:

```env
# backend/.env 
SECRET_KEY=generate_a_secure_random_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./data/pii_platform.db
REDIS_URL=redis://localhost:6379/0
API_V1_STR=/api/v1
```

---

## 🔌 API Boundaries

| Endpoint | Method | Role Requirement | Purpose |
| :--- | :--- | :--- | :--- |
| `/api/v1/upload/` | `POST` | `Admin`, `Analyst` | Ingests PDF securely into the processing pipeline. |
| `/api/v1/scan/{id}/stream` | `GET` | `Admin`, `Analyst` | Connects an SSE stream for live background tracking. |
| `/api/v1/redact/{id}` | `POST` | `Admin`, `Analyst` | Executes the mathematical redaction policy on the object. |
| `/api/v1/scan/{id}/report` | `GET` | `Admin`, `Analyst`, `Auditor` | Generates a granular risk compliance report. |
| `/api/v1/audit/` | `GET` | `Admin`, `Auditor` | Returns the immutable cryptographic system ledger. |

---

## 🚢 Deployment Strategies

### Local Orchestration (Docker Compose)
The repository is fully Docker-ready for immediate orchestration across all operating systems.
```bash
docker-compose up -d --build
```
*This launches Nginx, the UI, FastAPI, Redis, and Celery identically to a production environment.*

### Cloud Production Notes
*   **Stateless Scaling:** Swap the SQLite volume for an AWS RDS PostgreSQL instance and target an ElastiCache Redis broker to scale Celery workers via Kubernetes HPA.
*   **Blob Storage:** Update `upload.py` to route local `/data/` streams directly to AWS S3 buckets to prevent disk bloat on the web tier.

---

## 🛠️ Technology Stack

*   **Backend:** FastAPI, SQLAlchemy, Pydantic, Uvicorn
*   **Infrastructure:** Celery, Redis, Docker, Nginx
*   **Frontend:** React 18, Tailwind CSS, Recharts, Vite
*   **Machine Learning/NLP:** Microsoft Presidio Analyzer, SpaCy, PyMuPDF (fitz)

---

## 🔮 Future Evolutions

*   **Multilingual Indian NLP:** Implement HuggingFace models (e.g., IndicBERT) to detect PII accurately inside Hindi, Tamil, and Bengali regional texts.
*   **Advanced OCR Capabilities:** Integrate Tesseract to identify PII within scanned image-based PDFs, not just natively structured text.
*   **Cloud Object Sovereignty:** Deploy to AWS/Azure using dedicated GovCloud boundaries to ensure strict inter-region data compliance.
*   **Global Compliance Frameworks:** Extend the tagging matrix to isolate GDPR (EU) and CCPA (California) boundary entities dynamically.

---

## 📄 License

This system architecture is open-sourced under the MIT License. See `LICENSE` for further operational agreements.
