# TrueBeam Smart Queue Management System - Documentation Index

## 📖 Quick Navigation

### For First-Time Users
1. **Start Here**: [QUICKSTART.md](QUICKSTART.md) - Get running in 5 minutes
2. **Installation Help**: [INSTALLATION.md](INSTALLATION.md) - Detailed setup guide
3. **Project Overview**: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - What this system does

### For Developers
1. **Architecture**: [ARCHITECTURE.md](ARCHITECTURE.md) - Technical design
2. **API Reference**: See `README.md` → "API Endpoints" section
3. **Code Structure**: See "Project Structure" in this document

### For Medical Physics/Management
1. **Features**: [README.md](README.md) - What the system does
2. **Usage Guide**: [QUICKSTART.md](QUICKSTART.md) → "Dashboard Tour"
3. **Mathematical Details**: [ARCHITECTURE.md](ARCHITECTURE.md) → "Simulation Engine Details"

---

## 📚 Documentation Files

### 1. README.md
**Purpose**: Feature overview and complete documentation
**Contents**:
- System overview
- Technology stack
- Installation instructions
- API endpoints with examples
- Mathematical formulas
- Configuration guide
- Project structure
- Testing guide
- Future enhancements

**When to read**: After installation, to understand all features

### 2. QUICKSTART.md
**Purpose**: 5-minute setup and quick reference
**Contents**:
- TL;DR installation
- How to start services
- Dashboard tour
- Example scenarios
- Key metrics explained
- Common questions
- Troubleshooting table
- API testing commands

**When to read**: First thing, to get up and running fast

### 3. INSTALLATION.md
**Purpose**: Detailed setup with troubleshooting
**Contents**:
- System requirements
- Step-by-step installation (Windows, macOS, Linux)
- Manual installation steps
- Running options (batch files, manual, production)
- Verification steps
- Troubleshooting guide
- Environment configuration
- Performance tips

**When to read**: If setup.bat doesn't work, or for production deployment

### 4. ARCHITECTURE.md
**Purpose**: Technical design and implementation details
**Contents**:
- System architecture overview
- Component breakdown
- Code structure explanation
- Mathematical models detailed
- Simulation flow
- API contract with examples
- Data flow diagram
- Deployment considerations
- Design decisions
- Performance characteristics
- Extension points
- Testing strategy
- Security considerations

**When to read**: For understanding code, extending features, or optimization

### 5. PROJECT_SUMMARY.md
**Purpose**: High-level project overview
**Contents**:
- Project goals and capabilities
- Technology stack visual
- Complete file structure
- Getting started guide
- Mathematical foundation overview
- UI design description
- API endpoints summary
- Configuration overview
- Performance metrics
- Implemented features checklist
- Workflow examples
- Testing approach
- Deployment readiness
- Future enhancements

**When to read**: For project overview, executive summary, or planning

---

## 🗂️ File Organization

```
Queue_Can/
├── Documentation/
│   ├── README.md               ← Features & API reference
│   ├── QUICKSTART.md           ← 5-minute setup
│   ├── INSTALLATION.md         ← Detailed installation
│   ├── ARCHITECTURE.md         ← Technical design
│   ├── PROJECT_SUMMARY.md      ← Project overview
│   └── INDEX.md                ← This file
│
├── Backend Code/
│   ├── backend/main.py         ← FastAPI app
│   ├── backend/app/simulator.py ← Monte Carlo engine
│   ├── backend/app/models/     ← Data validation
│   ├── backend/app/routes/     ← API endpoints
│   ├── backend/requirements.txt ← Dependencies
│   └── backend/tests/          ← Unit tests
│
├── Frontend Code/
│   ├── frontend/src/pages/     ← Dashboard & Strategy
│   ├── frontend/src/components/ ← React components
│   ├── frontend/src/lib/       ← API client & utils
│   ├── frontend/src/styles/    ← Tailwind CSS
│   ├── frontend/package.json   ← Dependencies
│   └── frontend/next.config.js ← Configuration
│
└── Scripts/
    ├── setup.bat               ← Windows setup
    ├── setup.sh                ← macOS/Linux setup
    ├── start-backend.bat       ← Start backend
    └── start-frontend.bat      ← Start frontend
```

---

## 🚀 Getting Started by Role

### I'm a User (Want to Optimize Queues)
1. Read: [QUICKSTART.md](QUICKSTART.md)
2. Follow: Installation steps
3. Open: http://localhost:3000
4. Explore: Dashboard and Strategy tabs
5. Reference: "Common Questions" section in QUICKSTART

### I'm a Developer (Want to Extend/Modify)
1. Read: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Overview
2. Read: [ARCHITECTURE.md](ARCHITECTURE.md) - Technical design
3. Review: Code in `backend/` and `frontend/` directories
4. Check: API contract in [README.md](README.md)
5. Modify: Code as needed, follow directory structure
6. Test: Using pytest (backend) or manual testing

### I'm IT/DevOps (Want to Deploy)
1. Read: [INSTALLATION.md](INSTALLATION.md)
2. Read: [ARCHITECTURE.md](ARCHITECTURE.md) → "Deployment Considerations"
3. Follow: Production setup steps
4. Configure: Environment variables in `.env` files
5. Monitor: Using application logs

### I'm Medical Physics (Want to Use for Optimization)
1. Read: [QUICKSTART.md](QUICKSTART.md) - Quick overview
2. Read: [README.md](README.md) → "Features" section
3. Read: [ARCHITECTURE.md](ARCHITECTURE.md) → "Simulation Engine Details"
4. Try: Examples in [QUICKSTART.md](QUICKSTART.md) → "Example Scenarios"
5. Use: Strategy page to test your scenarios

---

## 🔑 Key Concepts Explained

### Monte Carlo Simulation
**What**: Running 1000+ random simulations to predict outcomes
**Why**: Accounts for randomness in patient arrivals and no-shows
**Where**: Backend → simulator.py
**Docs**: [ARCHITECTURE.md](ARCHITECTURE.md) → "Simulation Engine Details"

### Lindley's Recursive Equation
**What**: Mathematical formula to calculate patient wait times
**Formula**: W_i+1 = max(0, W_i + S_i - (A_i+1 - A_i))
**Why**: Accurate model of queue dynamics
**Docs**: [ARCHITECTURE.md](ARCHITECTURE.md) → "Mathematical Models"

### Optimal Booking (N*)
**What**: Recommended number of patients to schedule
**Formula**: N* = Slots / (1 - P_no_show)
**Example**: 66 patients / (1 - 0.10) = 73.3 patients
**Docs**: [README.md](README.md) → "Optimal Overbooking Strategy"

### Sweet Spot Indicator
**What**: Visual indicator of optimal configuration
**Criteria**: Occupancy > 85% AND Wait Time < 10 minutes
**Where**: Strategy page → Results section
**Docs**: [QUICKSTART.md](QUICKSTART.md) → "Example Scenarios"

---

## 🎯 Common Tasks

### Task: Run the Application
**Steps**:
1. `setup.bat` (or `setup.sh`)
2. Open terminal 1: `cd backend && python main.py`
3. Open terminal 2: `cd frontend && npm run dev`
4. Visit: http://localhost:3000

**Docs**: [QUICKSTART.md](QUICKSTART.md) → "TL;DR"

### Task: Test an API Endpoint
**Steps**:
1. Backend must be running
2. Run curl command or use Swagger UI at `/docs`
3. Example: `curl http://localhost:8000/api/health`

**Docs**: [QUICKSTART.md](QUICKSTART.md) → "API Endpoints"

### Task: Configure Simulation Parameters
**Steps**:
1. Open Strategy page
2. Adjust sliders
3. Click "Run Simulation"
4. View results

**Docs**: [QUICKSTART.md](QUICKSTART.md) → "Example Scenarios"

### Task: Change Default Port Numbers
**Steps**:
1. Backend: Edit `backend/.env`, change `API_PORT`
2. Frontend: Run `npm run dev -- -p 3001`
3. Update `FRONTEND_URL` in backend/.env if needed

**Docs**: [INSTALLATION.md](INSTALLATION.md) → "Troubleshooting"

### Task: Deploy to Production
**Steps**:
1. Install Python and Node.js on server
2. Clone repository
3. Run: `pip install -r requirements.txt`
4. Run: `npm install`
5. Set environment variables
6. Start with production commands
7. Set up reverse proxy (nginx/Apache)

**Docs**: [INSTALLATION.md](INSTALLATION.md) & [ARCHITECTURE.md](ARCHITECTURE.md) → "Deployment"

### Task: Extend with New Features
**Steps**:
1. Review [ARCHITECTURE.md](ARCHITECTURE.md) → "Extension Points"
2. Create new component/endpoint in appropriate directory
3. Follow existing code patterns
4. Test thoroughly
5. Update documentation

**Docs**: [ARCHITECTURE.md](ARCHITECTURE.md) → "Extension Points"

---

## 🆘 Troubleshooting Guide

**Problem**: Port 8000 already in use
→ See: [INSTALLATION.md](INSTALLATION.md) → "Troubleshooting"
→ Solution: Edit `API_PORT` in backend/.env

**Problem**: Module not found error
→ See: [INSTALLATION.md](INSTALLATION.md) → "Module Installation Fails"
→ Solution: Run `pip install -r requirements.txt`

**Problem**: API returns 404 error
→ See: [QUICKSTART.md](QUICKSTART.md) → "Troubleshooting"
→ Solution: Ensure backend is running with `python main.py`

**Problem**: Simulation is very slow
→ See: [QUICKSTART.md](QUICKSTART.md) → "Common Questions"
→ Solution: Reduce simulation runs (1000 instead of 5000)

**Problem**: "CORS error" in browser console
→ See: [ARCHITECTURE.md](ARCHITECTURE.md) → "CORS Configuration"
→ Solution: Check `FRONTEND_URL` in backend/.env

---

## 📞 Getting Help

### Check These in Order
1. **Error message in terminal**: Usually very clear, Google it
2. **[INSTALLATION.md](INSTALLATION.md) Troubleshooting section**: Common issues listed
3. **[QUICKSTART.md](QUICKSTART.md) Common Questions**: FAQ format
4. **[ARCHITECTURE.md](ARCHITECTURE.md) Technical Details**: If you need to understand deeper
5. **Browser DevTools**: F12 → Console tab for frontend errors
6. **API Docs**: http://localhost:8000/docs while backend running

### What Information to Provide if Asking for Help
1. **OS and Version**: Windows 10, macOS 12, etc.
2. **Python version**: `python --version`
3. **Node version**: `node --version`
4. **Error message**: Full text from terminal
5. **Steps taken**: What you did before the error
6. **Which file**: backend or frontend?

---

## 🔗 Document Cross-References

| Topic | Primary Doc | Secondary Docs |
|-------|-------------|-----------------|
| Installation | INSTALLATION.md | QUICKSTART.md |
| API Usage | README.md | ARCHITECTURE.md |
| Configuration | INSTALLATION.md | QUICKSTART.md |
| Architecture | ARCHITECTURE.md | PROJECT_SUMMARY.md |
| Mathematics | ARCHITECTURE.md | README.md |
| Troubleshooting | INSTALLATION.md | QUICKSTART.md |
| Deployment | ARCHITECTURE.md | INSTALLATION.md |
| Features | README.md | PROJECT_SUMMARY.md |
| Quick Start | QUICKSTART.md | INSTALLATION.md |

---

## ✅ Pre-Launch Checklist

Before using the system:
- [ ] Python 3.8+ installed
- [ ] Node.js 18+ installed
- [ ] `setup.bat` (or `setup.sh`) ran successfully
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can visit http://localhost:3000
- [ ] Can visit http://localhost:8000/health
- [ ] Dashboard shows "API Connected"
- [ ] Can run a simulation successfully
- [ ] Results display with charts

---

## 📊 File Sizes & Load Times

| Component | File Size | Load Time |
|-----------|-----------|-----------|
| Backend (installed) | ~50MB | 30 sec to start |
| Frontend (installed) | ~500MB | 20 sec to install, 5 sec to build |
| Simulation (1000 runs) | N/A | 5-10 sec |
| Dashboard load | <2MB | <2 sec |
| Single simulation result | ~50KB | <1 sec |

---

## 🎓 Learning Path

### Beginner (Just Want to Use It)
1. QUICKSTART.md
2. README.md (Features section)
3. Start using!

### Intermediate (Want to Understand It)
1. PROJECT_SUMMARY.md
2. ARCHITECTURE.md (Components section)
3. QUICKSTART.md → "Example Scenarios"

### Advanced (Want to Modify/Extend)
1. ARCHITECTURE.md (Full document)
2. Code review of simulator.py
3. API contract in README.md
4. Extension points in ARCHITECTURE.md

---

**Last Updated**: February 2026
**Version**: 1.0.0
**Status**: Production Ready ✅
