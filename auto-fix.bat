@REM This file can be run to automatically fix Python and Node.js PATH issues
@REM For Windows 11 with winget (fastest):

@echo off
title TrueBeam Queue - Dependency Installation
color 0B

cls
echo.
echo      ╔═══════════════════════════════════════════════════════╗
echo      ║      TRUEBEAM QUEUE MANAGEMENT SYSTEM                 ║
echo      ║      Automatic Dependency Installation                ║
echo      ╚═══════════════════════════════════════════════════════╝
echo.

REM Detect Windows version and Python/Node status
echo Detecting system configuration...
echo.

setlocal enabledelayedexpansion

REM Try different Python locations
set PYTHON_FOUND=0
set NODE_FOUND=0

for %%A in (python.exe) do (
    if not "%%~$PATH:A"=="" (
        set PYTHON_FOUND=1
        echo ✅ Python found in PATH
    )
)

for %%A in (node.exe) do (
    if not "%%~$PATH:A"=="" (
        set NODE_FOUND=1
        echo ✅ Node.js found in PATH
    )
)

if !PYTHON_FOUND! equ 0 (
    echo ⚠️  Python NOT found in PATH
    echo.
    echo Quick fix options:
    echo.
    echo 1. Use winget (Windows 11 - fastest):
    echo    winget install Python.Python.3.11 OpenJS.NodeJS.LTS -e --accept-package-agreements
    echo.
    echo 2. Use Microsoft Store:
    echo    Search for "Python 3.11" and "Node.js" - Click Install
    echo.
    echo 3. Manual install:
    echo    Python:  https://www.python.org/downloads/
    echo    Node:    https://nodejs.org/
    echo.
    echo After install, RESTART your computer and try again.
    echo.
)

if !NODE_FOUND! equ 0 (
    echo ⚠️  Node.js NOT found in PATH
)

if !PYTHON_FOUND! equ 1 (
    if !NODE_FOUND! equ 1 (
        echo.
        echo ============================================================
        echo ✅ Both Python and Node.js are installed!
        echo ============================================================
        echo.
        echo Installing project dependencies...
        echo.
        
        cd /d C:\Users\tasmu\Queue_Can
        
        echo [1/2] Backend dependencies...
        cd backend
        pip install -q -r requirements.txt
        if %errorlevel% equ 0 (
            echo ✅ Backend ready
        ) else (
            echo ❌ Backend setup had issues
        )
        cd ..
        
        echo [2/2] Frontend dependencies...
        cd frontend
        npm install -q
        if %errorlevel% equ 0 (
            echo ✅ Frontend ready
        ) else (
            echo ❌ Frontend setup had issues  
        )
        cd ..
        
        echo.
        echo ============================================================
        echo 🎉 READY TO START!
        echo ============================================================
        echo.
        echo Run: start-all.bat
        echo.
        echo This will:
        echo  ✅ Start Backend on http://localhost:8000
        echo  ✅ Start Frontend on http://localhost:3000
        echo  ✅ Run QA tests automatically
        echo  ✅ Show you the access links
        echo.
        echo ============================================================
        echo.
    )
)

if !PYTHON_FOUND! equ 0 (
    echo.
    echo ============================================================
    echo 📦 AUTOMATIC INSTALLATION STARTING
    echo ============================================================
    echo.
    
    REM Check for winget
    where winget >nul 2>&1
    if %errorlevel% equ 0 (
        echo Using Windows Package Manager (fast)...
        echo.
        echo Installing Python 3.11...
        winget install Python.Python.3.11 -e --accept-package-agreements --accept-source-agreements
        echo.
        echo Installing Node.js LTS...
        winget install OpenJS.NodeJS.LTS -e --accept-package-agreements --accept-source-agreements
        echo.
        echo ✅ Installation complete!
        echo.
        echo IMPORTANT: Close this window and restart your computer.
        echo Then run this script again.
        echo.
    ) else (
        echo winget not found. Using direct download method...
        echo.
        
        REM Use PowerShell to download and install
        powershell -Command ^
            "$ProgressPreference = 'SilentlyContinue'; ^
            Write-Host 'Downloading Python...'; ^
            Invoke-WebRequest -Uri 'https://www.python.org/ftp/python/3.11.7/python-3.11.7-amd64.exe' -OutFile '$env:TEMP\python.exe'; ^
            Write-Host 'Downloading Node.js...'; ^
            Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi' -OutFile '$env:TEMP\node.msi'; ^
            Write-Host 'Running installers...'; ^
            Start-Process '$env:TEMP\python.exe' -ArgumentList 'InstallAllUsers=1 PrependPath=1 /quiet' -NoNewWindow -Wait; ^
            Start-Process 'msiexec.exe' -ArgumentList '/i $env:TEMP\node.msi /quiet /norestart' -NoNewWindow -Wait"
        
        echo.
        echo ✅ Installation complete!
        echo.
        echo IMPORTANT: Close this window, restart your computer, and run again.
        echo.
    )
)

echo.
pause
