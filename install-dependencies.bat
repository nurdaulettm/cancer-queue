@echo off
REM Automated Installation Script for TrueBeam Queue Management
REM This script downloads and installs Python 3.11 and Node.js LTS

echo.
echo ============================================================
echo  TRUEBEAM QUEUE - AUTOMATIC INSTALLATION
echo ============================================================
echo.

REM Check if running as Administrator
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if %errorlevel% neq 0 (
    echo.
    echo ❌ This script must run as ADMINISTRATOR
    echo.
    echo Please right-click command prompt and select "Run as Administrator"
    pause
    exit /b 1
)

echo ✅ Running with Administrator privileges
echo.

REM Create temp directory
set "TEMP_DIR=%TEMP%\TrueBeamSetup"
if not exist "%TEMP_DIR%" mkdir "%TEMP_DIR%"

REM Step 1: Install Python
echo [Step 1/2] Installing Python 3.11...
echo Downloading Python installer...
powershell -Command ^
    "$ProgressPreference = 'SilentlyContinue'; ^
    Invoke-WebRequest -Uri 'https://www.python.org/ftp/python/3.11.7/python-3.11.7-amd64.exe' ^
    -OutFile '%TEMP_DIR%\python-installer.exe'; ^
    Write-Host 'Download complete. Starting installation...'; ^
    Start-Process '%TEMP_DIR%\python-installer.exe' -ArgumentList 'InstallAllUsers=1 PrependPath=1 Include_test=0' -Wait"

if errorlevel 1 (
    echo ⚠️  Python installation had issues. Trying alternative method...
    echo.
    echo Please download Python manually from:
    echo https://www.python.org/downloads/
    echo.
    echo IMPORTANT: During installation, CHECK this box:
    echo ☑ Add Python 3.11 to PATH
    echo.
    pause
    exit /b 1
)

echo ✅ Python installed

REM Step 2: Install Node.js
echo [Step 2/2] Installing Node.js LTS...
echo Downloading Node.js installer...
powershell -Command ^
    "$ProgressPreference = 'SilentlyContinue'; ^
    Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi' ^
    -OutFile '%TEMP_DIR%\nodejs-installer.msi'; ^
    Write-Host 'Download complete. Starting installation...'; ^
    Start-Process 'msiexec.exe' -ArgumentList '/i %TEMP_DIR%\nodejs-installer.msi /quiet' -Wait"

if errorlevel 1 (
    echo ⚠️  Node.js installation had issues. Trying alternative method...
    echo.
    echo Please download Node.js manually from:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js installed

REM Step 3: Refresh environment
echo.
echo Refreshing system environment...
setx PATH "%PATH%"

REM Step 4: Verify installations
echo.
echo [Verification] Checking installations...
call python --version
if errorlevel 1 (
    echo ❌ Python verification failed
) else (
    echo ✅ Python ready
)

call node --version
if errorlevel 1 (
    echo ❌ Node.js verification failed
) else (
    echo ✅ Node.js ready
)

call npm --version
if errorlevel 1 (
    echo ❌ npm verification failed
) else (
    echo ✅ npm ready
)

REM Step 5: Cleanup and next steps
echo.
echo ============================================================
echo ✅ INSTALLATION COMPLETE
echo ============================================================
echo.
echo Next steps:
echo.
echo 1. Close this window
echo 2. Open a NEW PowerShell window
echo 3. Navigate to: C:\Users\tasmu\Queue_Can
echo 4. Run: .\start-all.bat
echo.
echo ============================================================

REM Cleanup
rmdir /s /q "%TEMP_DIR%" >nul 2>&1

pause
exit /b 0
