#!/usr/bin/env python3
"""
TrueBeam Queue Management System - Verification Script
Checks if the installation is complete and correct
"""

import os
import sys
from pathlib import Path


def check_file_exists(path, description):
    """Check if a file exists"""
    if Path(path).exists():
        print(f"✅ {description}: {path}")
        return True
    else:
        print(f"❌ {description}: MISSING - {path}")
        return False


def check_directory_exists(path, description):
    """Check if a directory exists"""
    if Path(path).is_dir():
        print(f"✅ {description}: {path}")
        return True
    else:
        print(f"❌ {description}: MISSING - {path}")
        return False


def main():
    print("=" * 60)
    print("TrueBeam Queue Management System - Verification")
    print("=" * 60)
    print()
    
    all_ok = True
    
    # Check root files
    print("📋 Checking documentation files...")
    docs = [
        ("README.md", "Main documentation"),
        ("QUICKSTART.md", "Quick start guide"),
        ("INSTALLATION.md", "Installation guide"),
        ("ARCHITECTURE.md", "Architecture documentation"),
        ("PROJECT_SUMMARY.md", "Project summary"),
        ("INDEX.md", "Documentation index"),
        ("FILE_INVENTORY.md", "File inventory"),
        ("DEPLOYMENT_READY.md", "Deployment status"),
    ]
    
    for file, desc in docs:
        all_ok &= check_file_exists(file, desc)
    
    print()
    
    # Check backend
    print("🔧 Checking backend files...")
    backend_files = [
        ("backend/main.py", "FastAPI main entry point"),
        ("backend/requirements.txt", "Python dependencies"),
        ("backend/.env", "Backend configuration"),
        ("backend/app/simulator.py", "Monte Carlo simulator"),
        ("backend/app/models/queue.py", "Data models"),
        ("backend/app/routes/simulation.py", "API routes"),
    ]
    
    for file, desc in backend_files:
        all_ok &= check_file_exists(file, desc)
    
    print()
    
    # Check backend directories
    print("📁 Checking backend directories...")
    backend_dirs = [
        ("backend/app", "App package"),
        ("backend/app/models", "Models package"),
        ("backend/app/routes", "Routes package"),
        ("backend/tests", "Tests package"),
    ]
    
    for dir, desc in backend_dirs:
        all_ok &= check_directory_exists(dir, desc)
    
    print()
    
    # Check frontend
    print("⚛️  Checking frontend files...")
    frontend_files = [
        ("frontend/package.json", "Node.js dependencies"),
        ("frontend/next.config.js", "Next.js configuration"),
        ("frontend/tailwind.config.js", "Tailwind configuration"),
        ("frontend/.env.local", "Frontend configuration"),
        ("frontend/src/pages/index.jsx", "Dashboard page"),
        ("frontend/src/pages/strategy.jsx", "Strategy page"),
        ("frontend/src/components/QueueTimeline.jsx", "Timeline component"),
        ("frontend/src/components/SimulationControls.jsx", "Controls component"),
        ("frontend/src/components/SimulationResults.jsx", "Results component"),
        ("frontend/src/lib/api.js", "API client"),
        ("frontend/src/lib/utils.js", "Utility functions"),
        ("frontend/src/styles/globals.css", "Global styles"),
    ]
    
    for file, desc in frontend_files:
        all_ok &= check_file_exists(file, desc)
    
    print()
    
    # Check frontend directories
    print("📁 Checking frontend directories...")
    frontend_dirs = [
        ("frontend/src", "Source directory"),
        ("frontend/src/pages", "Pages directory"),
        ("frontend/src/components", "Components directory"),
        ("frontend/src/lib", "Lib directory"),
        ("frontend/src/styles", "Styles directory"),
    ]
    
    for dir, desc in frontend_dirs:
        all_ok &= check_directory_exists(dir, desc)
    
    print()
    
    # Check scripts
    print("🚀 Checking setup scripts...")
    scripts = [
        ("setup.bat", "Windows setup script"),
        ("setup.sh", "Unix setup script"),
        ("start-backend.bat", "Start backend script"),
        ("start-frontend.bat", "Start frontend script"),
    ]
    
    for file, desc in scripts:
        all_ok &= check_file_exists(file, desc)
    
    print()
    
    # Summary
    print("=" * 60)
    if all_ok:
        print("✅ ALL CHECKS PASSED!")
        print()
        print("Next steps:")
        print("1. Read QUICKSTART.md")
        print("2. Run: setup.bat (or setup.sh)")
        print("3. Terminal 1: cd backend && python main.py")
        print("4. Terminal 2: cd frontend && npm run dev")
        print("5. Visit: http://localhost:3000")
        return 0
    else:
        print("❌ SOME FILES ARE MISSING!")
        print()
        print("Please ensure all files are present before proceeding.")
        print("See FILE_INVENTORY.md for complete file list.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
