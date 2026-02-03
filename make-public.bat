@echo off
REM TrueBeam Queue - Public Access Setup
echo.
echo ====================================
echo TrueBeam Queue - Making Public
echo ====================================
echo.

REM Check if ngrok is available
ngrok --version >nul 2>&1
if errorlevel 1 (
    echo Downloading ngrok...
    powershell -Command "Invoke-WebRequest -Uri 'https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-windows-amd64.zip' -OutFile '$env:TEMP\ngrok.zip'; Expand-Archive -Path '$env:TEMP\ngrok.zip' -DestinationPath 'C:\tools\ngrok' -Force"
    setx PATH "%PATH%;C:\tools\ngrok"
)

echo.
echo ====================================
echo 🚀 STARTING SERVICES...
echo ====================================
echo.

REM Start backend
echo Starting Backend (Port 8000)...
start "Backend" cmd /k "cd backend && python main.py"

timeout /t 3

REM Start frontend  
echo Starting Frontend (Port 3000)...
start "Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 5

REM Create ngrok tunnel
echo.
echo ====================================
echo 🌐 CREATING PUBLIC TUNNEL...
echo ====================================
echo.

echo Creating tunnel for Frontend (Port 3000)...
ngrok http 3000 --log=stdout

pause
