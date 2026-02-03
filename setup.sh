#!/bin/bash
# TrueBeam Smart Queue Management System - Setup Script

echo "🏥 TrueBeam Queue Management System Setup"
echo "=========================================="
echo ""

# Check Python
echo "Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.8 or later from https://www.python.org/"
    exit 1
fi
echo "✓ Python $(python3 --version) found"

# Check Node.js
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js $(node --version) found"
echo "✓ npm $(npm --version) found"

# Install backend dependencies
echo ""
echo "Installing backend dependencies..."
cd backend
pip install -r requirements.txt
cd ..

# Install frontend dependencies
echo ""
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "✓ Setup complete!"
echo ""
echo "To start the application:"
echo "  Terminal 1: cd backend && python main.py"
echo "  Terminal 2: cd frontend && npm run dev"
echo ""
echo "Then visit: http://localhost:3000"
