from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import auth, upload, scan, redact, health
from app.core.database import engine, Base

# Create tables in DEV (In production use Alembic)
Base.metadata.create_all(bind=engine)

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
