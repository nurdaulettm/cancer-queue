# TrueBeam Smart Queue Management System - Installation Guide

## System Requirements

- **Python**: 3.8 or higher
- **Node.js**: 18.0 or higher
- **npm**: 9.0 or higher
- **OS**: Windows, macOS, or Linux
- **RAM**: 4GB minimum
- **Disk Space**: 2GB minimum

## Installation Steps

### 1. Install Python 3

#### Windows
- Download from [python.org](https://www.python.org/downloads/)
- During installation, **check "Add Python to PATH"**
- Verify installation:
  ```cmd
  python --version
  ```

#### macOS
```bash
brew install python3
python3 --version
```

#### Linux
```bash
sudo apt-get install python3 python3-pip
python3 --version
```

### 2. Install Node.js

#### Windows
- Download from [nodejs.org](https://nodejs.org/)
- Use the LTS version
- Follow the installer
- Verify installation:
  ```cmd
  node --version
  npm --version
  ```

#### macOS
```bash
brew install node
node --version
npm --version
```

#### Linux
```bash
sudo apt-get install nodejs npm
node --version
npm --version
```

### 3. Clone/Download the Project

```bash
cd Queue_Can
```

### 4. Run Setup Script

#### Windows
```cmd
setup.bat
```

#### macOS/Linux
```bash
chmod +x setup.sh
./setup.sh
```

## Manual Installation (if setup script fails)

### Backend Setup
```bash
cd backend
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### Frontend Setup
```bash
cd frontend
npm install
```

## Running the Application

### Option 1: Batch Files (Windows)

Open two Command Prompt windows:

**Terminal 1 - Backend:**
```cmd
start-backend.bat
```

**Terminal 2 - Frontend:**
```cmd
start-frontend.bat
```

### Option 2: Manual Commands

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
```

Should see:
```
Uvicorn running on http://0.0.0.0:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Should see:
```
- Local:        http://localhost:3000
```

### Option 3: Production Build

**Backend:**
```bash
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm run build
npm run start
```

## Verify Installation

1. **Backend Health Check:**
   - Open: `http://localhost:8000/health`
   - Should return: `{"status": "healthy", "service": "TrueBeam Queue Management API"}`

2. **API Documentation:**
   - Open: `http://localhost:8000/docs`
   - Interactive Swagger UI with all endpoints

3. **Frontend Application:**
   - Open: `http://localhost:3000`
   - Should see the TrueBeam dashboard

## Troubleshooting

### Python Not Found
```
# Windows: Add Python to PATH
setx PATH "%PATH%;C:\Users\YourUsername\AppData\Local\Programs\Python\Python312"

# Then restart your terminal
```

### Node/npm Not Found
```
# Verify installation path is in System PATH
echo %PATH%  # Windows
echo $PATH   # macOS/Linux

# Reinstall Node.js if necessary
```

### Port Already in Use
```
# Change backend port (edit backend/.env)
API_PORT=8001

# Change frontend port
npm run dev -- -p 3001
```

### Dependency Installation Fails
```bash
# Clear npm cache
npm cache clean --force

# Clear pip cache
pip cache purge

# Reinstall
pip install -r requirements.txt
npm install
```

### Module Not Found Error
```bash
# Reinstall dependencies with fresh install
cd backend
rm -rf venv
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Environment Variables

### Backend (.env)
```
FASTAPI_ENV=development
API_PORT=8000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Testing the API

### Health Check
```bash
curl http://localhost:8000/api/health
```

### Run Simulation
```bash
curl -X POST http://localhost:8000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "n_simulations": 1000,
    "p_no_show": 0.10,
    "scheduled_patients": 66,
    "overbooking_percentage": 5,
    "mean_service_time": 15,
    "std_service_time": 5
  }'
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port 8000 in use | Change `API_PORT` in backend/.env |
| Port 3000 in use | Run `npm run dev -- -p 3001` |
| Module not found | Run `pip install -r requirements.txt` or `npm install` |
| CORS errors | Verify `FRONTEND_URL` in backend/.env matches your frontend URL |
| Simulation too slow | Reduce `n_simulations` (default 1000) |
| Memory issues | Close other applications, reduce simulation count |

## Performance Tips

- **Simulation Speed**: Increasing simulations to 5000 takes ~30 seconds
- **Frontend**: Loads in <2 seconds on first visit, faster on refresh
- **API Response**: Typical simulation response <10 seconds
- **Recommended Settings for Performance Testing**:
  - Simulations: 1000-2000
  - Overbooking: 5-10%
  - No-show rate: 10-15%

## Next Steps

1. Explore the [README.md](README.md) for feature overview
2. Visit the dashboard at `http://localhost:3000`
3. Test simulations in the Strategy tab
4. Review API docs at `http://localhost:8000/docs`

## Support

For issues or questions, check:
- Terminal error messages for detailed information
- API documentation at `/docs`
- Project README.md for overview
