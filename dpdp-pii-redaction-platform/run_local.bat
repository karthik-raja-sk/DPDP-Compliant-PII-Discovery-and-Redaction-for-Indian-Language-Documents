@echo off
setlocal

echo [1/4] Preparing Backend Environment...
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate
echo Installing backend dependencies...
pip install -r requirements.txt

echo.
echo [2/4] Initializing Database...
echo Note: For visual demo, we will use SQLite if PostgreSQL is not available.
if not exist .env (
    echo Creating .env from .env.example...
    copy ..\.env.example .env
    echo SQLALCHEMY_DATABASE_URI=sqlite:///./pii_demo.db >> .env
)

echo.
echo [3/4] Preparing Frontend Environment...
cd ..\frontend
if not exist node_modules (
    echo Installing frontend dependencies (this may take a minute)...
    npm install
)

echo.
echo [4/4] Starting Platform...
echo Opening Dashboard in your browser...
start http://localhost:5173

echo Starting Backend Server in a new window...
start cmd /k "cd ..\backend && venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"

echo Starting Frontend Dev Server...
npm run dev

pause
