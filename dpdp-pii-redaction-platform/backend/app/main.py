from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import auth, upload, scan, redact, health
from app.core.database import engine, Base
from sqlalchemy import text
import os

def _dev_bootstrap_db():
    """
    Dev-only bootstrap: create tables if you're not using Alembic yet.
    Production should run Alembic migrations instead of create_all.
    """
    Base.metadata.create_all(bind=engine)

    # Backfill invalid enum values from older versions (SQLite dev DBs may contain them).
    try:
        with engine.begin() as conn:
            conn.execute(
                text("UPDATE documents SET status = :new_status WHERE status = :old_status"),
                {"new_status": "extracting text", "old_status": "extracting"},
            )
    except Exception:
        pass


if str(getattr(settings, "AUTO_CREATE_DB", os.getenv("AUTO_CREATE_DB", "false"))).lower() == "true":
    _dev_bootstrap_db()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS Middleware
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(upload.router, prefix=f"{settings.API_V1_STR}/upload", tags=["Upload"])
app.include_router(scan.router, prefix=f"{settings.API_V1_STR}/scan", tags=["Scanning"])
app.include_router(redact.router, prefix=f"{settings.API_V1_STR}/redact", tags=["Redaction"])
app.include_router(health.router, prefix=f"{settings.API_V1_STR}/health", tags=["Health"])

@app.get("/")
def root():
    return {"message": "Welcome to DPDP PII Redaction API"}
