@echo off
REM Quick Diagnostics for TrueBeam Queue System

echo.
echo ============================================================
echo  SYSTEM DIAGNOSTIC CHECK
echo ============================================================
echo.

echo [1/8] Checking Python Installation...
python --version
if errorlevel 1 echo ❌ Python NOT FOUND - https://www.python.org/
echo.

echo [2/8] Checking Node.js Installation...
node --version
if errorlevel 1 echo ❌ Node NOT FOUND - https://nodejs.org/
echo.

echo [3/8] Checking npm Installation...
npm --version
if errorlevel 1 echo ❌ npm NOT FOUND
echo.

echo [4/8] Checking Backend Dependencies...
cd backend 2>nul
if exist requirements.txt (
    echo ✅ requirements.txt found
    type requirements.txt
) else (
    echo ❌ requirements.txt not found
)
cd .. 2>nul
echo.

echo [5/8] Checking Frontend Dependencies...
cd frontend 2>nul
if exist package.json (
    echo ✅ package.json found
    findstr "\"version\"" package.json
) else (
    echo ❌ package.json not found
)
cd .. 2>nul
echo.

echo [6/8] Checking Port Availability...
netstat -ano | findstr :8000 >nul
if errorlevel 1 (
    echo ✅ Port 8000 available for Backend
) else (
    echo ⚠️  Port 8000 already in use
)

netstat -ano | findstr :3000 >nul
if errorlevel 1 (
    echo ✅ Port 3000 available for Frontend
) else (
    echo ⚠️  Port 3000 already in use
)
echo.

echo [7/8] Checking Project Structure...
if exist "backend\main.py" echo ✅ Backend main.py found
if exist "frontend\src\pages\index.jsx" echo ✅ Frontend index.jsx found
if exist "backend\app\simulator.py" echo ✅ Simulator engine found
if exist "qa_test.py" echo ✅ QA test script found
echo.

echo [8/8] Checking Environment Files...
if exist "backend\.env" echo ✅ Backend .env found
if exist "frontend\.env.local" echo ✅ Frontend .env.local found
echo.

echo ============================================================
echo.
echo NEXT STEPS:
echo.
echo 1. If Python is missing: https://www.python.org/
echo 2. If Node is missing: https://nodejs.org/ (get LTS)
echo 3. Once installed, run: start-all.bat
echo.
echo ============================================================
pause
