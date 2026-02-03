@echo off
REM TrueBeam Smart Queue Management System - Setup Script for Windows

echo.
echo 🏥 TrueBeam Queue Management System Setup
echo ==========================================
echo.

REM Check Python
echo Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found. Please install Python 3.8+ from https://www.python.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
echo ✓ %PYTHON_VERSION% found

REM Check Node.js
echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✓ Node.js %NODE_VERSION% found
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✓ npm %NPM_VERSION% found

REM Install backend dependencies
echo.
echo Installing backend dependencies...
cd backend
pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..
echo ✓ Backend dependencies installed

REM Install frontend dependencies
echo.
echo Installing frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo ❌ Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..
echo ✓ Frontend dependencies installed

echo.
echo ✓ Setup complete!
echo.
echo To start the application:
echo   Terminal 1: cd backend ^&^& python main.py
echo   Terminal 2: cd frontend ^&^& npm run dev
echo.
echo Then visit: http://localhost:3000
echo.
pause
