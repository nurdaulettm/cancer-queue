@echo off
REM TrueBeam Queue Management - Complete Startup with QA Testing
REM This script starts all services and runs QA tests

setlocal enabledelayedexpansion

echo.
echo ============================================================
echo  TrueBeam Smart Queue Management System - STARTUP
echo ============================================================
echo.

REM Check if running from correct directory
if not exist "backend\main.py" (
    echo ERROR: Run this script from Queue_Can directory
    echo Current directory: %cd%
    pause
    exit /b 1
)

REM Step 1: Check Python
echo [1/6] Checking Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found. Installing...
    call :install_python
) else (
    for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
    echo ✅ Found: !PYTHON_VERSION!
)

REM Step 2: Check Node.js
echo [2/6] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Installing...
    call :install_node
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✅ Found: Node.js %%i
)

REM Step 3: Install backend dependencies
echo [3/6] Installing backend dependencies...
cd backend
pip install -q -r requirements.txt >nul 2>&1
if errorlevel 1 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies ready
cd ..

REM Step 4: Install frontend dependencies
echo [4/6] Installing frontend dependencies...
cd frontend
if not exist "node_modules" (
    npm install -q >nul 2>&1
    if errorlevel 1 (
        echo ❌ Failed to install frontend dependencies
        pause
        exit /b 1
    )
)
echo ✅ Frontend dependencies ready
cd ..

REM Step 5: Start services
echo [5/6] Starting services...
echo.
echo Starting Backend Server (Port 8000)...
start "Backend - TrueBeam Queue" cmd /k "cd backend && python main.py"
timeout /t 3 /nobreak

echo Starting Frontend Server (Port 3000)...
start "Frontend - TrueBeam Queue" cmd /k "cd frontend && npm run dev"
timeout /t 5 /nobreak

REM Step 6: Run QA Tests
echo [6/6] Running QA Tests...
echo.

REM Wait for services
timeout /t 3 /nobreak

REM Run tests
python qa_test.py

if errorlevel 1 (
    echo.
    echo ⚠️  Some tests failed. Check the services above.
) else (
    echo.
    echo ============================================================
    echo ✅ SUCCESS! System is running and all tests passed!
    echo ============================================================
    echo.
    echo 🌐 ACCESS YOUR SYSTEM:
    echo.
    echo    Local Dashboard:  http://localhost:3000
    echo    Local API:        http://localhost:8000
    echo    API Docs:         http://localhost:8000/docs
    echo.
    echo 🚀 TO MAKE PUBLIC:
    echo.
    echo    npx localtunnel --port 3000 --subdomain truebeam-queue
    echo.
    echo ============================================================
    echo.
)

pause
exit /b 0

:install_python
echo Attempting to install Python...
powershell -Command "Start-Process python -Wait"
goto :eof

:install_node
echo Attempting to install Node.js...
powershell -Command "Start-Process https://nodejs.org/en/download/"
goto :eof
