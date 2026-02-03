# TrueBeam Queue Management - File Inventory

## 📋 Complete File List with Descriptions

### Documentation Files

| File | Size | Purpose |
|------|------|---------|
| **README.md** | 8KB | Main project documentation - features, setup, API reference |
| **QUICKSTART.md** | 6KB | 5-minute quick start guide and common questions |
| **INSTALLATION.md** | 10KB | Detailed installation for all platforms with troubleshooting |
| **ARCHITECTURE.md** | 15KB | Technical architecture, design decisions, and implementation |
| **PROJECT_SUMMARY.md** | 12KB | Executive summary of project capabilities and structure |
| **INDEX.md** | 14KB | Documentation navigation and getting started by role |
| **.gitignore** | 1KB | Git ignore patterns for Python and Node projects |

### Backend Files

#### Main Application
| File | Purpose |
|------|---------|
| `backend/main.py` | FastAPI entry point with CORS config and route registration |
| `backend/requirements.txt` | Python package dependencies (fastapi, uvicorn, numpy, etc.) |
| `backend/.env` | Environment variables (port, frontend URL, env mode) |

#### Application Code
| File | Purpose |
|------|---------|
| `backend/app/__init__.py` | Package marker for app module |
| `backend/app/simulator.py` | **Core**: Monte Carlo simulation engine with Lindley's equation |
| `backend/app/models/queue.py` | Pydantic data models for request/response validation |
| `backend/app/routes/simulation.py` | FastAPI endpoints: `/api/health` and `/api/simulate` |

#### Testing
| File | Purpose |
|------|---------|
| `backend/tests/__init__.py` | Package marker for tests module |
| `backend/tests/test_simulator.py` | Unit tests for simulator functions |

### Frontend Files

#### Configuration
| File | Purpose |
|------|---------|
| `frontend/package.json` | Node.js dependencies (React, Next.js, Recharts, etc.) |
| `frontend/next.config.js` | Next.js configuration and environment setup |
| `frontend/tailwind.config.js` | Tailwind CSS configuration with custom colors |
| `frontend/postcss.config.js` | PostCSS plugin configuration for Tailwind |
| `frontend/.env.local` | Frontend environment variables (API URL) |

#### Pages (Next.js Routes)
| File | Purpose |
|------|---------|
| `frontend/src/pages/_app.jsx` | Layout wrapper with navigation and footer |
| `frontend/src/pages/index.jsx` | **Dashboard page**: Real-time metrics and status |
| `frontend/src/pages/strategy.jsx` | **Strategy page**: Simulation controls and results |

#### Components (Reusable React Components)
| File | Purpose |
|------|---------|
| `frontend/src/components/QueueTimeline.jsx` | Scrollable timeline display (8am-6pm, 10-min slots) |
| `frontend/src/components/SimulationControls.jsx` | Interactive sliders and simulation runner |
| `frontend/src/components/SimulationResults.jsx` | Results visualization with charts and statistics |

#### Utilities & Services
| File | Purpose |
|------|---------|
| `frontend/src/lib/api.js` | Axios client for API communication with backend |
| `frontend/src/lib/utils.js` | Helper functions (time formatting, color coding, etc.) |

#### Styling
| File | Purpose |
|------|---------|
| `frontend/src/styles/globals.css` | Global Tailwind CSS with custom clinical theme |

### Setup Scripts

| File | Purpose |
|------|---------|
| **setup.bat** | Windows batch script to install all dependencies |
| **setup.sh** | Bash script for macOS/Linux setup |
| **start-backend.bat** | Windows batch to start backend server |
| **start-frontend.bat** | Windows batch to start frontend dev server |

---

## 📊 File Statistics

### By Type
| Type | Count | Total Size |
|------|-------|-----------|
| Documentation | 7 | ~65 KB |
| Python (.py) | 7 | ~25 KB |
| JavaScript (.jsx, .js) | 10 | ~35 KB |
| Config (.json, .js, .config) | 5 | ~8 KB |
| Environment (.env) | 2 | <1 KB |
| Scripts (.bat, .sh) | 4 | ~2 KB |
| Text files (.md, .txt, .ignore) | 3 | ~5 KB |
| **TOTAL** | **38 files** | **~140 KB** |

### By Directory
| Directory | Files | Purpose |
|-----------|-------|---------|
| Root | 11 | Documentation + scripts |
| backend/ | 12 | API server + simulation |
| backend/app/ | 5 | Core application code |
| backend/tests/ | 2 | Unit tests |
| frontend/ | 13 | React/Next.js application |
| frontend/src/ | 1 | Source code container |
| frontend/src/pages/ | 3 | Page components |
| frontend/src/components/ | 3 | UI components |
| frontend/src/lib/ | 2 | Utilities |
| frontend/src/styles/ | 1 | CSS styling |

---

## 🔍 File Dependencies

### Backend Dependencies
```
main.py
  ├── depends on: fastapi, uvicorn, cors
  ├── imports: app.routes.simulation
  └── loads: .env

app/routes/simulation.py
  ├── depends on: fastapi
  ├── imports: app.models.queue, app.simulator
  └── defines: /api/health, /api/simulate endpoints

app/simulator.py
  ├── depends on: numpy
  ├── defines: QueueSimulator, SimulationConfig
  └── implements: Monte Carlo engine with math formulas

app/models/queue.py
  ├── depends on: pydantic
  └── defines: Data validation models
```

### Frontend Dependencies
```
_app.jsx (Layout wrapper)
  ├── imports: Navigation, Footer
  └── wraps: All pages

pages/index.jsx (Dashboard)
  ├── imports: QueueTimeline
  ├── imports: api.js for health check
  └── displays: Real-time metrics

pages/strategy.jsx (Strategy Sandbox)
  ├── imports: SimulationControls
  ├── imports: SimulationResults
  ├── imports: QueueTimeline
  └── manages: Simulation state

components/SimulationControls.jsx
  ├── imports: api.js for simulate endpoint
  └── manages: Slider inputs and form state

components/SimulationResults.jsx
  ├── imports: utils.js for formatting
  ├── imports: Recharts for charts
  └── displays: Results and statistics

components/QueueTimeline.jsx
  ├── imports: utils.js for helper functions
  └── displays: Scrollable timeline

lib/api.js
  ├── depends on: axios
  ├── imports: config from NEXT_PUBLIC_API_URL
  └── provides: API client methods

lib/utils.js
  ├── provides: Helper functions (no imports)
  └── used by: All components
```

---

## 🔧 Configuration Files Explained

### backend/.env
```
FASTAPI_ENV=development         # production or development
API_PORT=8000                   # Port for API server
FRONTEND_URL=http://localhost:3000  # For CORS
```

### frontend/.env.local
```
NEXT_PUBLIC_API_URL=http://localhost:8000  # API endpoint
```

### frontend/package.json
```json
{
  "dependencies": {
    "react": "18.2.0",          # UI framework
    "next": "14.0.0",           # Full-stack framework
    "recharts": "2.10.0",       # Charts library
    "axios": "1.6.0"            # HTTP client
  }
}
```

### backend/requirements.txt
```
fastapi==0.104.1                # Web framework
uvicorn==0.24.0                 # ASGI server
numpy==1.24.3                   # Numerical computing
pydantic==2.5.0                 # Data validation
```

---

## 📈 Code Metrics

### Backend Code (Python)
| File | Lines | Functions | Classes |
|------|-------|-----------|---------|
| simulator.py | 280 | 7 | 2 |
| routes/simulation.py | 80 | 2 | 0 |
| models/queue.py | 50 | 0 | 5 |
| main.py | 50 | 1 | 0 |
| **Total** | **460** | **10** | **7** |

### Frontend Code (React/JavaScript)
| File | Lines | Components |
|------|-------|-----------|
| pages/index.jsx | 90 | 1 |
| pages/strategy.jsx | 85 | 1 |
| pages/_app.jsx | 30 | 1 |
| components/SimulationControls.jsx | 150 | 1 |
| components/SimulationResults.jsx | 170 | 1 |
| components/QueueTimeline.jsx | 80 | 1 |
| lib/api.js | 40 | 0 |
| lib/utils.js | 50 | 0 |
| **Total** | **695** | **6** |

---

## 🔐 Security Sensitive Files

| File | Sensitivity | Notes |
|------|------------|-------|
| backend/.env | **HIGH** | Contains port and URL config |
| frontend/.env.local | **MEDIUM** | Contains API URL (public info) |
| backend/requirements.txt | **LOW** | Public package list |
| frontend/package.json | **LOW** | Public package list |

⚠️ **Important**: Never commit `.env` files to version control!

---

## 📦 Generated Directories (Not Included)

These directories are created during setup and not in version control:

```
backend/
  └── (no generated dirs)

frontend/
  ├── node_modules/          # npm packages (1000+ files)
  ├── .next/                 # Next.js build cache
  └── out/                   # Production build output

Both:
  └── __pycache__/           # Python cache (if running)
```

---

## ✅ File Integrity Checklist

Before running, verify these files exist:
- [x] README.md
- [x] QUICKSTART.md
- [x] INSTALLATION.md
- [x] ARCHITECTURE.md
- [x] PROJECT_SUMMARY.md
- [x] INDEX.md
- [x] backend/main.py
- [x] backend/app/simulator.py
- [x] backend/requirements.txt
- [x] frontend/package.json
- [x] frontend/src/pages/index.jsx
- [x] frontend/src/pages/strategy.jsx
- [x] setup.bat
- [x] setup.sh

---

## 📝 File Modification Guide

### Safe to Modify
- `backend/.env` - Change port/URL
- `frontend/.env.local` - Change API URL
- Component files - Add features
- CSS files - Customize styling
- Configuration files (*.config.js)

### Careful When Modifying
- `backend/simulator.py` - Changes affect calculations
- `backend/main.py` - Changes affect API
- `package.json` / `requirements.txt` - Dependency changes

### Don't Modify
- Documentation files (unless documenting changes)
- `setup.bat` / `setup.sh` (unless you know what you're doing)
- Test files (unless writing new tests)

---

## 🚀 Deployment File Requirements

For deployment, include:
- ✅ All backend files except `tests/`
- ✅ All frontend files except `node_modules/` and `.next/`
- ✅ Documentation files
- ✅ `.env` files (with production values)
- ❌ `node_modules/` (recreate with `npm install`)
- ❌ `__pycache__/` (recreate with Python)
- ❌ `.next/` (recreate with `npm run build`)

---

**Total Project Size**: ~140 KB source code
**With node_modules**: ~600 MB
**Build artifacts**: Additional 200 MB

Last Updated: February 2026
