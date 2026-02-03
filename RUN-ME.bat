@echo off
REM TrueBeam Queue Management - Complete Startup
REM This should be run from Windows Command Prompt (cmd.exe), not PowerShell

setlocal enabledelayedexpansion
chcp 65001 >nul

echo.
echo =========================================================
echo  TRUEBEAM QUEUE MANAGEMENT SYSTEM - STARTUP
echo =========================================================
echo.
echo Project Location: C:\Users\tasmu\Queue_Can
echo.

REM Set Python and Node paths
set PYTHON_PATH=C:\Users\tasmu\AppData\Local\Programs\Python\Python312\python.exe
set NODE_PATH=C:\Program Files\nodejs
set NPM_PATH=%NODE_PATH%\npm.cmd

REM Check if Python exists
if not exist "%PYTHON_PATH%" (
    echo ERROR: Python not found at %PYTHON_PATH%
    echo Please install Python 3.11 first
    pause
    exit /b 1
)

REM Check if Node exists
if not exist "%NODE_PATH%\node.exe" (
    echo ERROR: Node.js not found at %NODE_PATH%
    echo Please install Node.js first
    pause
    exit /b 1
)

echo Detected:
echo  - Python: %PYTHON_PATH%
echo  - Node.js: %NODE_PATH%\node.exe
echo  - npm: %NPM_PATH%
echo.

REM Step 1: Install backend dependencies
echo [1/4] Installing backend dependencies...
cd /d C:\Users\tasmu\Queue_Can\backend
"%PYTHON_PATH%" -m pip install -r requirements.txt >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Backend dependencies may not have installed properly
) else (
    echo OK: Backend dependencies installed
)

REM Step 2: Install frontend dependencies  
echo [2/4] Installing frontend dependencies...
cd /d C:\Users\tasmu\Queue_Can\frontend
"%NPM_PATH%" install >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Frontend dependencies may not have installed properly
) else (
    echo OK: Frontend dependencies installed
)

REM Step 3: Start backend
echo [3/4] Starting backend server (port 8000)...
cd /d C:\Users\tasmu\Queue_Can\backend
start "Backend - TrueBeam Queue" cmd /k "%PYTHON_PATH%" main.py
timeout /t 3 /nobreak

REM Step 4: Start frontend
echo [4/4] Starting frontend server (port 3000)...
cd /d C:\Users\tasmu\Queue_Can\frontend
start "Frontend - TrueBeam Queue" cmd /k "%NPM_PATH%" run dev
timeout /t 5 /nobreak

REM Step 5: Open browser
cd /d C:\Users\tasmu\Queue_Can
echo.
echo Attempting to open dashboard in browser...
start http://localhost:3000

echo.
echo =========================================================
echo  STARTUP COMPLETE
echo =========================================================
echo.
echo Your TrueBeam Queue Management System is now running!
echo.
echo Access your system at:
echo  - Dashboard:     http://localhost:3000
echo  - Backend API:   http://localhost:8000
echo  - API Docs:      http://localhost:8000/docs
echo.
echo Two new windows have been opened:
echo  1. Backend Server (Python/FastAPI) - http://localhost:8000
echo  2. Frontend Server (React/Next.js) - http://localhost:3000
echo.
echo Keep these windows open while using the system.
echo To stop the servers, close these windows.
echo.
echo =========================================================
echo.

pause
