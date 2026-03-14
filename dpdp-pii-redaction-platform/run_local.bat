@echo off
setlocal

echo [1/5] Preparing Backend Environment...
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate
echo Installing backend dependencies...
pip install -r requirements.txt

echo.
echo [2/5] Initializing Configuration...
if not exist .env (
    echo Creating .env from .env.example...
    copy ..\.env.example .env
    echo SQLALCHEMY_DATABASE_URI=sqlite:///./pii_demo.db >> .env
)

echo.
echo [3/5] Starting Redis (Container)...
echo Note: Ensure Docker Desktop is running.
docker start dpdp-redis 2>nul || docker run --name dpdp-redis -p 6379:6379 -d redis

echo.
echo [4/5] Starting Processing Services...
start "DPDP Backend" cmd /k "venv\Scripts\activate && uvicorn app.main:app --reload --port 8002"
start "DPDP Celery" cmd /k "venv\Scripts\activate && celery -A app.worker worker --loglevel=info -P solo"

echo.
echo [5/5] Launching Frontend...
cd ..\frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    npm install
)
echo Opening Dashboard...
start http://localhost:5173
npm run dev

pause
