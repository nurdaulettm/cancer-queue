
# TrueBeam Queue Management - Auto Installer
# Run this in PowerShell as Administrator

$ErrorActionPreference = "Continue"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " TRUEBEAM QUEUE MANAGEMENT SYSTEM" -ForegroundColor Cyan
Write-Host " Quick Install Script" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "❌ This script must run as ADMINISTRATOR" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please do the following:" -ForegroundColor Yellow
    Write-Host "1. Press Win+X"
    Write-Host "2. Select 'Windows PowerShell (Admin)'"
    Write-Host "3. Paste this script again"
    Write-Host ""
    Read-Host "Press Enter to continue"
    exit 1
}

Write-Host "✅ Administrator access confirmed" -ForegroundColor Green
Write-Host ""

# Function to check if command exists
function Test-CommandExists {
    param($command)
    $null = Get-Command $command -ErrorAction SilentlyContinue
    return $?
}

# Step 1: Check Python
Write-Host "[1/5] Checking Python..." -ForegroundColor Cyan
if (Test-CommandExists python) {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "⏳ Installing Python 3.11..." -ForegroundColor Yellow
    
    # Try using winget first
    if (Test-CommandExists winget) {
        winget install Python.Python.3.11 -e -h
    } else {
        # Fallback: direct download and install
        Write-Host "Downloading Python installer..." -ForegroundColor Yellow
        $pythonUrl = "https://www.python.org/ftp/python/3.11.7/python-3.11.7-amd64.exe"
        $pythonPath = "$env:TEMP\python-installer.exe"
        
        Invoke-WebRequest -Uri $pythonUrl -OutFile $pythonPath -ErrorAction SilentlyContinue
        
        if (Test-Path $pythonPath) {
            Write-Host "Starting Python installation..." -ForegroundColor Yellow
            Start-Process $pythonPath -ArgumentList "InstallAllUsers=1 PrependPath=1" -NoNewWindow -Wait
            Remove-Item $pythonPath -Force -ErrorAction SilentlyContinue
        } else {
            Write-Host "⚠️  Could not download Python" -ForegroundColor Yellow
            Write-Host "Please install manually from https://www.python.org/" -ForegroundColor Yellow
        }
    }
}

# Step 2: Check Node.js
Write-Host "[2/5] Checking Node.js..." -ForegroundColor Cyan
if (Test-CommandExists node) {
    $nodeVersion = node --version 2>&1
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "⏳ Installing Node.js LTS..." -ForegroundColor Yellow
    
    if (Test-CommandExists winget) {
        winget install OpenJS.NodeJS.LTS -e -h
    } else {
        Write-Host "Downloading Node.js installer..." -ForegroundColor Yellow
        $nodeUrl = "https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi"
        $nodePath = "$env:TEMP\nodejs-installer.msi"
        
        Invoke-WebRequest -Uri $nodeUrl -OutFile $nodePath -ErrorAction SilentlyContinue
        
        if (Test-Path $nodePath) {
            Write-Host "Starting Node.js installation..." -ForegroundColor Yellow
            Start-Process msiexec.exe -ArgumentList "/i $nodePath /quiet /norestart" -NoNewWindow -Wait
            Remove-Item $nodePath -Force -ErrorAction SilentlyContinue
        } else {
            Write-Host "⚠️  Could not download Node.js" -ForegroundColor Yellow
            Write-Host "Please install manually from https://nodejs.org/" -ForegroundColor Yellow
        }
    }
}

# Refresh PATH
Write-Host "[3/5] Refreshing system environment..." -ForegroundColor Cyan
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
Write-Host "✅ Environment refreshed" -ForegroundColor Green

# Step 3: Verify installations
Write-Host "[4/5] Verifying installations..." -ForegroundColor Cyan
Write-Host ""

try {
    $pythonVer = python --version 2>&1 | Out-String
    Write-Host "✅ Python: $pythonVer" -ForegroundColor Green
} catch {
    Write-Host "❌ Python verification failed" -ForegroundColor Red
}

try {
    $nodeVer = node --version 2>&1 | Out-String
    Write-Host "✅ Node.js: $nodeVer" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js verification failed" -ForegroundColor Red
}

try {
    $npmVer = npm --version 2>&1 | Out-String
    Write-Host "✅ npm: $npmVer" -ForegroundColor Green
} catch {
    Write-Host "❌ npm verification failed" -ForegroundColor Red
}

Write-Host ""

# Step 4: Install project dependencies
Write-Host "[5/5] Installing project dependencies..." -ForegroundColor Cyan
Write-Host ""

$projectPath = "C:\Users\tasmu\Queue_Can"
if (Test-Path $projectPath) {
    Set-Location $projectPath
    
    # Backend dependencies
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location backend
    if (Test-Path "requirements.txt") {
        pip install -q -r requirements.txt
        if ($?) {
            Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Some backend dependencies may have failed" -ForegroundColor Yellow
        }
    }
    Set-Location ..
    
    # Frontend dependencies
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    Set-Location frontend
    if (Test-Path "package.json") {
        npm install -q 2>$null
        if ($?) {
            Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Some frontend dependencies may have failed" -ForegroundColor Yellow
        }
    }
    Set-Location ..
} else {
    Write-Host "⚠️  Project directory not found at $projectPath" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "✅ SETUP COMPLETE" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Navigate to: C:\Users\tasmu\Queue_Can" -ForegroundColor White
Write-Host "2. Start backend: py backend\main.py" -ForegroundColor White
Write-Host "3. Start frontend: npm run dev --prefix frontend" -ForegroundColor White
Write-Host ""
Write-Host "Or simply run: .\start-all.bat" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access your system at:" -ForegroundColor Green
Write-Host "  🌐 http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""

Read-Host "Press Enter to close"
