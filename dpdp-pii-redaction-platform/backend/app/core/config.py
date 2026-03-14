from pydantic_settings import BaseSettings
from typing import List, Optional
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "DPDP PII Redaction Platform"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "70921cf8a0e86a079e0a6d0c6d7a421b")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # Database
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "postgres")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "pii_platform")
    SQLALCHEMY_DATABASE_URI: Optional[str] = os.getenv(
        "SQLALCHEMY_DATABASE_URI", 
        f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}/{POSTGRES_DB}"
    )

    # Redis & Celery (SQLite fallback for local portability)
    _redis_url = f"redis://{os.getenv('REDIS_HOST', 'localhost')}:{int(os.getenv('REDIS_PORT', 6379))}/0"
    CELERY_BROKER_URL: str = os.getenv("CELERY_BROKER_URL", "sqla+sqlite:///data/celery_broker.db")
    CELERY_RESULT_BACKEND: str = os.getenv("CELERY_RESULT_BACKEND", "db+sqlite:///data/celery_results.db")

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    # Storage
    UPLOAD_DIR: str = "data/raw"
    PROCESSED_DIR: str = "data/processed"
    REDACTED_DIR: str = "data/redacted_outputs"

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore"

settings = Settings()
