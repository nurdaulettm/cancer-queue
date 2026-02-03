@echo off
REM Simple install - uses winget (Windows 11) or direct download

echo.
echo ============================================================
echo  QUICK INSTALL - Python and Node.js
echo ============================================================
echo.

REM Check if winget is available (Windows 11+)
winget --version >nul 2>&1

if %errorlevel% equ 0 (
    echo Using winget for installation (fast)...
    echo.
    
    echo Installing Python...
    winget install Python.Python.3.11 -e --accept-package-agreements --accept-source-agreements >nul 2>&1
    
    echo Installing Node.js LTS...
    winget install OpenJS.NodeJS.LTS -e --accept-package-agreements --accept-source-agreements >nul 2>&1
    
    echo.
    echo ✅ Installation via winget complete!
    
) else (
    echo Using direct download (slower, but works on Windows 10)...
    echo.
    echo Downloading Python...
    powershell -Command "Invoke-WebRequest -Uri 'https://www.python.org/ftp/python/3.11.7/python-3.11.7-amd64.exe' -OutFile '%TEMP%\python.exe'" && (
        echo Running Python installer...
        "%TEMP%\python.exe" InstallAllUsers=1 PrependPath=1 /quiet
        del "%TEMP%\python.exe" >nul 2>&1
    )
    
    echo Downloading Node.js...
    powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi' -OutFile '%TEMP%\node.msi'" && (
        echo Running Node.js installer...
        msiexec /i "%TEMP%\node.msi" /quiet /norestart
        del "%TEMP%\node.msi" >nul 2>&1
    )
    
    echo.
    echo ✅ Installation via download complete!
)

echo.
echo Refreshing environment...
setx PATH "%PATH%" >nul 2>&1

echo.
echo ============================================================
echo  Installation Summary
echo ============================================================
echo.

python --version
node --version  
npm --version

echo.
echo ============================================================
echo.
echo ✅ NEXT: Close this window, then run start-all.bat
echo.
echo ============================================================
echo.

pause
