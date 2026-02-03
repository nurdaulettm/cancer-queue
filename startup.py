#!/usr/bin/env python
"""
TrueBeam Queue Management - Auto Startup Script
Starts both backend and frontend services
"""

import subprocess
import time
import webbrowser
import sys
import os

def main():
    print("\n" + "="*60)
    print(" TRUEBEAM QUEUE MANAGEMENT SYSTEM - AUTO STARTUP")
    print("="*60 + "\n")
    
    # Change to project directory
    project_dir = r"C:\Users\tasmu\Queue_Can"
    os.chdir(project_dir)
    
    print("[1/4] Starting Backend (FastAPI)...")
    print("      Location: backend/")
    print("      Port: 8000")
    
    try:
        backend_process = subprocess.Popen(
            [sys.executable, "backend/main.py"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        print("✅ Backend started (PID: {})".format(backend_process.pid))
        time.sleep(3)
    except Exception as e:
        print(f"❌ Failed to start backend: {e}")
        return False
    
    print("\n[2/4] Starting Frontend (React/Next.js)...")
    print("      Location: frontend/")
    print("      Port: 3000")
    
    try:
        frontend_cmd = r"C:\tools\nodejs\node-v18.19.0-win-x64\npm.cmd"
        frontend_process = subprocess.Popen(
            [frontend_cmd, "run", "dev"],
            cwd="frontend",
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        print("✅ Frontend started (PID: {})".format(frontend_process.pid))
        time.sleep(5)
    except Exception as e:
        print(f"❌ Failed to start frontend: {e}")
        backend_process.terminate()
        return False
    
    print("\n[3/4] Verifying services...")
    
    # Check if services are running
    time.sleep(2)
    if backend_process.poll() is None:
        print("✅ Backend running on http://localhost:8000")
    else:
        print("❌ Backend failed to start")
        return False
    
    if frontend_process.poll() is None:
        print("✅ Frontend running on http://localhost:3000")
    else:
        print("❌ Frontend failed to start")
        return False
    
    print("\n[4/4] Opening dashboard in browser...")
    time.sleep(2)
    
    try:
        webbrowser.open("http://localhost:3000")
        print("✅ Browser opened at http://localhost:3000")
    except:
        print("⚠️  Could not open browser automatically")
        print("   Please visit: http://localhost:3000")
    
    print("\n" + "="*60)
    print(" ✅ SYSTEM STARTED SUCCESSFULLY!")
    print("="*60)
    print("\n🌐 Access Your System:")
    print("   Dashboard:    http://localhost:3000")
    print("   Backend API:  http://localhost:8000")
    print("   API Docs:     http://localhost:8000/docs")
    print("\n⚠️  Keep this window open. Services running...")
    print("="*60 + "\n")
    
    # Keep script running
    try:
        backend_process.wait()
    except KeyboardInterrupt:
        print("\n\nShutting down...")
        backend_process.terminate()
        frontend_process.terminate()
        time.sleep(1)
        backend_process.kill()
        frontend_process.kill()
        print("✅ Services stopped")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
