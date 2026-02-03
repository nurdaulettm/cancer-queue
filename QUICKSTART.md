# Quick Start Guide

## TL;DR - Get Running in 5 Minutes

### Prerequisites
- Python 3.8+ and Node.js 18+ already installed

### 1. Install Dependencies (2 min)
```bash
# Windows
setup.bat

# macOS/Linux  
chmod +x setup.sh && ./setup.sh
```

### 2. Start Backend (open terminal 1)
```bash
cd backend
python main.py
```
✓ Watch for: `Uvicorn running on http://0.0.0.0:8000`

### 3. Start Frontend (open terminal 2)
```bash
cd frontend
npm run dev
```
✓ Watch for: `- Local: http://localhost:3000`

### 4. Open Browser
Visit: **http://localhost:3000**

## Dashboard Tour

### Main Page (Dashboard)
- **Real-time Metrics**: Current wait times, capacity, utilization
- **Machine Utilization Gauge**: Visual bar showing occupancy %
- **Today's Timeline**: 10-minute slots from 8am-6pm
- **Sweet Spot Link**: Navigate to optimization tools

### Strategy Page
- **Overbooking Slider**: 0-20% (test scheduling strategies)
- **No-Show Rate Slider**: 0-10% (simulate patient absences)
- **Simulation Runs**: 100-5000 (accuracy vs speed trade-off)
- **Run Button**: Execute Monte Carlo simulation
- **Results**: Charts, metrics, optimal booking count

## Key Metrics Explained

| Metric | Target | Why |
|--------|--------|-----|
| **Average Wait Time** | < 10 min | Patient satisfaction |
| **Occupancy Rate** | > 85% | Machine efficiency |
| **Overload Risk** | < 20% | System stability |
| **Machine Idle** | < 15% | Revenue optimization |

## Example Scenarios

### Scenario 1: Increase Efficiency
1. Go to Strategy page
2. Set Overbooking to **10%**
3. Keep No-Show at **10%**
4. Click "Run Simulation"
5. Check results - occupancy should improve

### Scenario 2: Test Robustness
1. Set No-Show Rate to **20%** (worst case)
2. Set Overbooking to **5%**
3. Run simulation
4. Note the Overload Risk percentage

### Scenario 3: Find Sweet Spot
1. Try different overbooking levels (5%, 10%, 15%)
2. Each time click "Run Simulation"
3. Look for: **Occupancy > 85% AND Wait Time < 10 min**
4. Green indicator = optimal configuration

## Common Questions

**Q: What if I get "API offline" message?**
A: Make sure backend is running in terminal 1 with `python main.py`

**Q: Why is simulation slow?**
A: Higher simulation runs (more accurate but slower). Try 1000 for balance.

**Q: Can I access from another computer?**
A: Yes! Use your machine's IP (check `ipconfig` on Windows) instead of localhost

**Q: How do I change ports?**
A: Backend: edit `backend/.env` (`API_PORT=8000`)
   Frontend: `npm run dev -- -p 3001`

## What's Running

| Service | Port | Purpose |
|---------|------|---------|
| FastAPI Backend | 8000 | Monte Carlo simulation engine |
| React Frontend | 3000 | Web dashboard & controls |

## API Endpoints (for testing)

```bash
# Health check
curl http://localhost:8000/api/health

# Run simulation (POST)
curl -X POST http://localhost:8000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{"n_simulations":1000,"p_no_show":0.1,"scheduled_patients":66}'

# View API docs
Open: http://localhost:8000/docs
```

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Port 8000 in use | `API_PORT=8001` in backend/.env |
| Port 3000 in use | `npm run dev -- -p 3001` |
| No modules found | `pip install -r requirements.txt` && `npm install` |
| Slow simulation | Reduce `n_simulations` slider |
| CORS errors | Check API URL matches in frontend |

## Next Steps

- Read the full [README.md](README.md) for technical details
- Check [INSTALLATION.md](INSTALLATION.md) for troubleshooting
- Explore API docs at `/docs` endpoint
- Test different parameters to understand queue dynamics

---

**Need help?** Check the terminal output - error messages are usually very clear!
