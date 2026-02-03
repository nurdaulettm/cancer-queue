@echo off
REM Simple startup script - avoids PowerShell encoding issues

setlocal enabledelayedexpansion

cd /d C:\Users\tasmu\Queue_Can

echo.
echo Starting TrueBeam Queue Management System...
echo.

REM Start Backend
echo Starting Backend on port 8000...
start "Backend - TrueBeam" cmd /k "cd backend && python main.py"

timeout /t 3 /nobreak

REM Start Frontend  
echo Starting Frontend on port 3000...
start "Frontend - TrueBeam" cmd /k "cd frontend && C:\tools\nodejs\node-v18.19.0-win-x64\npm.cmd run dev"

timeout /t 5 /nobreak

REM Open browser
echo.
echo Opening dashboard in browser...
start http://localhost:3000

echo.
echo Services started! Dashboard opening at http://localhost:3000
echo.
echo Backend API:  http://localhost:8000
echo API Docs:    http://localhost:8000/docs
echo.

pause
