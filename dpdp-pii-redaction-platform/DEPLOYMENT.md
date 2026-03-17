# Deployment (Free / Production-ready)

This project can be deployed **for free** on an **Oracle Cloud Always Free** VM using Docker Compose.

## What you will deploy

- **Frontend**: built static bundle served by **Nginx** (container), also proxies `/api/*` to backend.
- **Backend**: FastAPI (Uvicorn) on port `8000` (container).
- **Worker**: Celery worker for background scan processing.
- **Database**: Postgres (container volume).
- **Queue**: Redis (container).

The public entrypoint is the **frontend container** (port `5173` on the VM).

## Prerequisites

- Oracle Cloud account (Always Free eligible)
- A VM instance (Ubuntu recommended)
- Docker + Docker Compose installed on the VM
- A domain name (optional but recommended for HTTPS)

## 1) Create an Oracle Cloud Always Free VM

- Shape: `VM.Standard.E2.1.Micro` (Always Free) or the best Always Free available in your region.
- OS: Ubuntu 22.04 LTS
- Open inbound ports:
  - `22` (SSH)
  - `80` (HTTP) optional
  - `443` (HTTPS) optional
  - `5173` (App) required unless you put a reverse proxy in front

## 2) Install Docker on the VM

On Ubuntu:

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
newgrp docker
```

## 3) Upload the project to the VM

Options:
- `git clone` from GitHub
- or copy via `scp`

Example:

```bash
git clone <your-repo-url>
cd dpdp-pii-redaction-platform
```

## 4) Set the production SECRET_KEY

Pick a strong value and export it before running compose:

```bash
export SECRET_KEY="$(openssl rand -hex 32)"
```

## 5) Start the stack

From the project root:

```bash
cd infra/docker
docker compose up -d --build
```

Then open:
- `http://<VM_PUBLIC_IP>:5173`

## 6) Database migrations (production)

The backend now includes Alembic migrations in `backend/alembic/`.

Run migrations inside the backend container:

```bash
docker compose exec backend alembic upgrade head
```

## 7) Updates

```bash
git pull
cd infra/docker
docker compose up -d --build
docker compose exec backend alembic upgrade head
```

## Notes / recommended hardening

- Put a proper reverse proxy (Caddy/Nginx) on ports `80/443` and serve the app on your domain with TLS.\n+- Set `BACKEND_CORS_ORIGINS` to your real frontend origin(s).\n+- Use managed Postgres/Redis if you outgrow a single VM.\n+
