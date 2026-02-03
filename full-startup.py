"""
TrueBeam Queue Management - Complete Startup Manager
Handles installation, dependency management, and service startup
"""

import subprocess
import sys
import time
import os
import json
from pathlib import Path

class StartupManager:
    def __init__(self):
        self.project_dir = r"C:\Users\tasmu\Queue_Can"
        self.backend_port = 8000
        self.frontend_port = 3000
        self.python_exe = sys.executable
        self.npm_exe = r"C:\tools\nodejs\node-v18.19.0-win-x64\npm.cmd"
        
    def log(self, message, level="INFO"):
        """Print formatted log message"""
        timestamp = time.strftime("%H:%M:%S")
        symbols = {"INFO": "ℹ️", "SUCCESS": "✅", "ERROR": "❌", "WARNING": "⚠️", "RUNNING": "▶️"}
        print(f"[{timestamp}] {symbols.get(level, '•')} {message}")
    
    def run_command(self, cmd, cwd=None, show_output=False):
        """Execute a command and return success status"""
        try:
            if show_output:
                result = subprocess.run(cmd, cwd=cwd or self.project_dir, shell=True)
                return result.returncode == 0
            else:
                result = subprocess.run(
                    cmd, 
                    cwd=cwd or self.project_dir,
                    capture_output=True,
                    text=True,
                    shell=True
                )
                return result.returncode == 0
        except Exception as e:
            self.log(f"Command failed: {e}", "ERROR")
            return False
    
    def check_python(self):
        """Verify Python is installed and working"""
        self.log("Checking Python installation...", "INFO")
        result = subprocess.run(
            [self.python_exe, "--version"],
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            self.log(f"Python found: {result.stdout.strip()}", "SUCCESS")
            return True
        else:
            self.log("Python not found in PATH", "ERROR")
            return False
    
    def check_nodejs(self):
        """Verify Node.js is installed and working"""
        self.log("Checking Node.js installation...", "INFO")
        try:
            result = subprocess.run(
                [r"C:\tools\nodejs\node-v18.19.0-win-x64\node.exe", "--version"],
                capture_output=True,
                text=True
            )
            if result.returncode == 0:
                self.log(f"Node.js found: {result.stdout.strip()}", "SUCCESS")
                return True
        except:
            pass
        self.log("Node.js not properly configured", "ERROR")
        return False
    
    def install_python_deps(self):
        """Install Python dependencies"""
        self.log("Installing backend dependencies...", "INFO")
        backend_dir = os.path.join(self.project_dir, "backend")
        cmd = f'"{self.python_exe}" -m pip install -r requirements.txt'
        if self.run_command(cmd, cwd=backend_dir):
            self.log("Backend dependencies installed", "SUCCESS")
            return True
        else:
            self.log("Failed to install backend dependencies", "WARNING")
            return False
    
    def install_node_deps(self):
        """Install Node.js dependencies"""
        self.log("Installing frontend dependencies...", "INFO")
        frontend_dir = os.path.join(self.project_dir, "frontend")
        cmd = f'"{self.npm_exe}" install'
        if self.run_command(cmd, cwd=frontend_dir):
            self.log("Frontend dependencies installed", "SUCCESS")
            return True
        else:
            self.log("Failed to install frontend dependencies", "WARNING")
            return False
    
    def start_backend(self):
        """Start FastAPI backend server"""
        self.log("Starting Backend Server...", "RUNNING")
        backend_dir = os.path.join(self.project_dir, "backend")
        cmd = f'"{self.python_exe}" main.py'
        
        try:
            # Create a new console window for backend
            process = subprocess.Popen(
                f'start "Backend - TrueBeam Queue" cmd /k "{self.python_exe}" main.py',
                cwd=backend_dir,
                shell=True
            )
            self.log(f"Backend started (PID: {process.pid})", "SUCCESS")
            return True
        except Exception as e:
            self.log(f"Failed to start backend: {e}", "ERROR")
            return False
    
    def start_frontend(self):
        """Start Next.js frontend server"""
        self.log("Starting Frontend Server...", "RUNNING")
        frontend_dir = os.path.join(self.project_dir, "frontend")
        
        try:
            # Create a new console window for frontend
            cmd = f'start "Frontend - TrueBeam Queue" cmd /k "{self.npm_exe}" run dev'
            process = subprocess.Popen(cmd, cwd=frontend_dir, shell=True)
            self.log(f"Frontend started (PID: {process.pid})", "SUCCESS")
            return True
        except Exception as e:
            self.log(f"Failed to start frontend: {e}", "ERROR")
            return False
    
    def open_browser(self):
        """Open dashboard in default browser"""
        import webbrowser
        try:
            self.log("Opening dashboard in browser...", "INFO")
            webbrowser.open("http://localhost:3000", new=1)
            self.log("Dashboard opened at http://localhost:3000", "SUCCESS")
            return True
        except:
            self.log("Could not open browser automatically", "WARNING")
            return False
    
    def run(self):
        """Main startup sequence"""
        print("\n" + "="*70)
        print(" 🚀 TRUEBEAM SMART QUEUE MANAGEMENT SYSTEM")
        print(" Automatic Startup Manager")
        print("="*70 + "\n")
        
        os.chdir(self.project_dir)
        
        # Check prerequisites
        self.log("═" * 70, "INFO")
        self.log("STEP 1: Checking Prerequisites", "INFO")
        self.log("═" * 70, "INFO")
        
        if not self.check_python():
            self.log("Cannot proceed without Python", "ERROR")
            return False
        
        if not self.check_nodejs():
            self.log("Cannot proceed without Node.js", "WARNING")
        
        time.sleep(1)
        
        # Install dependencies
        self.log("\n" + "═" * 70, "INFO")
        self.log("STEP 2: Installing Dependencies", "INFO")
        self.log("═" * 70, "INFO")
        
        self.install_python_deps()
        self.install_node_deps()
        
        time.sleep(1)
        
        # Start services
        self.log("\n" + "═" * 70, "INFO")
        self.log("STEP 3: Starting Services", "INFO")
        self.log("═" * 70, "INFO")
        
        backend_ok = self.start_backend()
        time.sleep(2)
        frontend_ok = self.start_frontend()
        time.sleep(3)
        
        # Open browser
        self.log("\n" + "═" * 70, "INFO")
        self.log("STEP 4: Opening Dashboard", "INFO")
        self.log("═" * 70, "INFO")
        
        self.open_browser()
        
        # Summary
        print("\n" + "="*70)
        print(" ✅ SYSTEM STARTUP COMPLETE")
        print("="*70)
        print("\n 🌐 Access Your System:\n")
        print("    Dashboard:     http://localhost:3000")
        print("    Backend API:   http://localhost:8000")
        print("    API Docs:      http://localhost:8000/docs\n")
        print(" ⏳ Services are running in separate windows.")
        print(" 📝 Keep this window open for monitoring.\n")
        print("="*70 + "\n")
        
        return True

if __name__ == "__main__":
    manager = StartupManager()
    success = manager.run()
    sys.exit(0 if success else 1)
