# 🚨 HOW TO FIX: "I Can't Entry" Error

## The Problem
Your system is **architecturally complete** but **missing Python and Node.js** on your computer.

### Error Messages You're Seeing:
```
❌ Python was not found
❌ "node" is not recognized
```

---

## ✅ SOLUTION (Pick ONE)

### **Method 1: Automatic Install (EASIEST) ⭐**

1. **Open PowerShell as Administrator** (Win+X → PowerShell Admin)
2. **Run this command:**
   ```powershell
   cd C:\Users\tasmu\Queue_Can
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
   .\install.ps1
   ```
3. Let it run (takes 5-10 minutes)
4. When done, it will start your services automatically

---

### **Method 2: Quick Batch Install**

1. **Open Command Prompt** (Win+R, type `cmd`)
2. **Run this:**
   ```cmd
   cd C:\Users\tasmu\Queue_Can
   quick-install.bat
   ```
3. Let it complete, then close and reopen the window
4. **Run start-all.bat**

---

### **Method 3: Manual Installation (Most Control)**

#### A) Install Python
1. Go to https://www.python.org/downloads/
2. Download **Python 3.11.7** (recommended)
3. Run installer
4. **IMPORTANT:** ✅ Check "Add Python to PATH"
5. Click Install

#### B) Install Node.js  
1. Go to https://nodejs.org/
2. Download **LTS version** (18 or 20)
3. Run installer, accept defaults
4. Click Install

#### C) Verify Installation
Open a **NEW Command Prompt** and run:
```cmd
python --version
node --version
npm --version
```

#### D) Install Dependencies & Start Services
```cmd
cd C:\Users\tasmu\Queue_Can

REM Install dependencies
pip install -r backend\requirements.txt
npm install --prefix frontend

REM Start services
start cmd /k "cd backend && python main.py"
start cmd /k "cd frontend && npm run dev"

REM Run QA Tests
python qa_test.py
```

---

## 🎯 What You'll See When It Works

### Terminal 1 (Backend):
```
INFO:     Started server process [8000]
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Terminal 2 (Frontend):
```
- Local:        http://localhost:3000
- Environments: .local
```

### Terminal 3 (QA Tests):
```
✅ Test 1: Health Check - PASSED
✅ Test 2: API Documentation - PASSED
✅ Test 3: Simulation (Default) - PASSED
✅ Test 4: Simulation (Custom) - PASSED
✅ Test 5: Frontend Load - PASSED
✅ Test 6: CORS Headers - PASSED
✅ Test 7: Response Format - PASSED

All 7 tests PASSED! ✅
```

---

## 🌐 Access Your System

Once running:

### Local Access (Your Computer):
- **Dashboard:** http://localhost:3000
- **API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

### Public Access (Share with Others):
```powershell
# Install ngrok (one-time)
npm install -g ngrok

# Create public link
ngrok http 3000

# Share the generated URL
# Example: https://abc123def456.ngrok.io
```

---

## 🛠️ Troubleshooting

### "Python still not found after install"
- **Restart your computer** (environment changes need reboot)
- Open a **NEW Command Prompt** window
- Try again

### "pip install fails"
```cmd
# Try upgrading pip first
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### "npm install fails"  
```cmd
# Clear npm cache
npm cache clean --force
npm install --prefix frontend
```

### "Port 8000/3000 already in use"
```powershell
# Find and kill existing process
netstat -ano | findstr :8000
taskkill /PID [PID_NUMBER] /F

netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

### Ports are still in use?
Change ports in `.env` files:
- `backend/.env` - Change `API_PORT=8001`
- `frontend/.env.local` - Change `NEXT_PUBLIC_API_URL=http://localhost:8001`

---

## 📋 Installation Checklist

- [ ] Python 3.11+ installed
- [ ] Node.js 18+ installed  
- [ ] Ran `pip install -r requirements.txt`
- [ ] Ran `npm install --prefix frontend`
- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:3000
- [ ] QA tests all passing

---

## 🆘 Still Need Help?

The scripts created for you:

| File | Purpose |
|------|---------|
| `install.ps1` | PowerShell installer (auto-downloads Python & Node) |
| `quick-install.bat` | Batch installer (simpler alternative) |
| `start-all.bat` | Starts all services + QA tests |
| `diagnose.bat` | Checks what's installed |
| `qa_test.py` | Automated testing script |

Run `diagnose.bat` to see what's currently installed:
```cmd
cd C:\Users\tasmu\Queue_Can
diagnose.bat
```

---

## ✨ What Happens After Installation

### The System Will:
1. ✅ Start Backend FastAPI server (Monte Carlo simulation engine)
2. ✅ Start Frontend React/Next.js dashboard  
3. ✅ Run comprehensive QA tests
4. ✅ Display all test results
5. ✅ Show you public access instructions

### You'll Then Have:
- Interactive queue management dashboard
- Real-time simulation results
- Multiple strategy testing
- Professional analytics charts
- Public shareable links

---

**Ready? Start with Method 1 (Automatic Install) above!** 🚀
