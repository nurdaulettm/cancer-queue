# TrueBeam Queue Management System - Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT TIER (Port 3000)                   │
│                   React 18 + Next.js 14 Frontend                │
├─────────────────────────────────────────────────────────────────┤
│                         HTTP/CORS Bridge                          │
├─────────────────────────────────────────────────────────────────┤
│                     API SERVER TIER (Port 8000)                   │
│                   FastAPI + Uvicorn Backend                      │
├─────────────────────────────────────────────────────────────────┤
│                    SIMULATION ENGINE (NumPy)                     │
│                   Monte Carlo Queue Simulator                    │
└─────────────────────────────────────────────────────────────────┘
```

## Architecture Components

### 1. Frontend (React + Next.js)

#### Pages
- **Dashboard** (`/` or `/index.jsx`)
  - Real-time metrics display
  - Machine utilization gauge
  - Daily timeline view
  - API health status
  - Link to strategy page

- **Strategy Sandbox** (`/strategy`)
  - Overbooking slider (0-20%)
  - No-show rate slider (0-20%)
  - Simulation runs control (100-5000)
  - Simulation results display
  - Sweet spot indicator

#### Components
- **QueueTimeline.jsx**: Horizontal scrollable timeline (8am-6pm, 10-min slots)
- **SimulationControls.jsx**: Interactive sliders and run button
- **SimulationResults.jsx**: Results visualization with charts

#### State Management
- Local React state (`useState`)
- API calls via Axios
- No external state library (kept simple)

#### Styling
- Tailwind CSS utility classes
- Recharts for data visualization
- Responsive design (mobile-first)
- Clinical color scheme (teal/blue theme)

### 2. Backend (FastAPI + Python)

#### Project Structure
```
backend/
├── main.py                 # FastAPI entry point
├── requirements.txt        # Python dependencies
├── .env                    # Environment configuration
└── app/
    ├── __init__.py
    ├── simulator.py        # Monte Carlo engine
    ├── models/
    │   ├── __init__.py
    │   └── queue.py        # Pydantic models
    └── routes/
        ├── __init__.py
        └── simulation.py    # API endpoints
```

#### Key Files

**simulator.py** - Monte Carlo Engine
```
QueueSimulator
├── generate_patient_arrivals()    # Bernoulli + Uniform
├── generate_service_times()       # Normal distribution
├── calculate_waiting_times()      # Lindley's equation
└── run_simulation()               # Main simulation loop
```

**routes/simulation.py** - API Endpoints
```
GET  /api/health                  # Health check
POST /api/simulate                # Run Monte Carlo sim
```

**models/queue.py** - Data Validation
```
SimulationRequest              # Input validation
SimulationResult               # Output structure
WaitTimeDistribution           # Statistics model
```

### 3. Simulation Engine Details

#### Mathematical Models

**Patient Show-up**
```
Shows_up ~ Bernoulli(1 - p_no_show)
p_no_show = 0.10 (default, configurable)
```

**Arrival Time**
```
A_i = T_i + L_i
where:
  T_i = Scheduled time (10-minute slots: 480, 490, 500, ...)
  L_i ~ Uniform[0, 5] minutes
```

**Service Time**
```
S_i ~ Normal(μ=15, σ=5)
Clipped to [5, 60] minutes
```

**Waiting Time (Lindley's Recursion)**
```
W_i+1 = max(0, W_i + S_i - (A_i+1 - A_i))

Interpretation:
  W_i = Current patient's wait
  S_i = Current patient's service time
  (A_i+1 - A_i) = Next patient's inter-arrival time
```

**Optimal Booking**
```
N* = Scheduled_Slots / (1 - P_no_show)

Example:
  Slots = 66
  P_no_show = 0.10
  N* = 66 / 0.90 = 73.3 patients
```

#### Simulation Flow

```
For each Monte Carlo iteration (1000 default):
  1. Generate 66 patients with scheduled times
  2. Apply Bernoulli trial: 90% show up (10% no-show)
  3. Add lateness: Uniform(0, 5) minutes
  4. Generate service times: Normal(15, 5) minutes
  5. Calculate waiting times using Lindley's equation
  6. Track occupancy = (total_service_time / 600 minutes) * 100%
  7. Accumulate results

Results:
  - Average wait time across simulations
  - Occupancy distribution
  - Risk of overload (% of sims where occupancy > 100%)
  - Optimal booking count (N*)
  - Wait time statistics (mean, median, p95, p99)
```

### 4. API Contract

#### Request/Response Examples

**POST /api/simulate**

Request:
```json
{
  "n_simulations": 1000,
  "p_no_show": 0.10,
  "scheduled_patients": 66,
  "overbooking_percentage": 5.0,
  "mean_service_time": 15.0,
  "std_service_time": 5.0
}
```

Response:
```json
{
  "average_wait_time": 5.23,
  "occupancy_percentage": 87.5,
  "risk_of_overload": 8.3,
  "optimal_booking_count": 73.3,
  "wait_time_distribution": {
    "mean": 5.23,
    "median": 4.12,
    "std": 3.45,
    "min": 0,
    "max": 45.2,
    "percentile_95": 12.8,
    "percentile_99": 18.5
  },
  "actual_patients_scheduled": 69,
  "actual_patients_showed_up": 62.1,
  "machine_idle_percentage": 12.5,
  "buffer_slots": 3,
  "simulation_metadata": {
    "n_simulations": 1000,
    "p_no_show": 0.10,
    "scheduled_patients": 66,
    "mean_service_time": 15.0,
    "std_service_time": 5.0,
    "overbooking_percentage": 5.0
  }
}
```

### 5. Data Flow

```
User Interface (Dashboard)
         ↓
    React State
         ↓
  Axios API Call
         ↓ HTTP POST
    FastAPI Endpoint
         ↓
   Validate Input
         ↓
   Simulator Config
         ↓
   NumPy Simulation
     (1000 loops)
         ↓
   Calculate Stats
         ↓
   Pydantic Model
         ↓ HTTP Response
    JSON Response
         ↓
  React State Update
         ↓
   Recharts Display
         ↓
   User Sees Results
```

### 6. Deployment Considerations

#### Development
- Frontend: `npm run dev` (hot reload)
- Backend: `python main.py` (auto-reload with Uvicorn)
- CORS enabled for localhost:3000

#### Production
- Frontend: `npm run build && npm run start`
- Backend: `uvicorn main:app --host 0.0.0.0 --port 8000`
- Set `FASTAPI_ENV=production` in .env
- Update `FRONTEND_URL` to actual domain

#### Scaling
- Add database layer (PostgreSQL) for patient records
- Implement caching (Redis) for repeated simulations
- Use async tasks (Celery) for long-running simulations
- Add authentication (JWT tokens)

## Key Design Decisions

### 1. In-Memory Simulation
- No database for simulation state
- Fast iteration during development
- Easy testing and experimentation

### 2. Pydantic for Validation
- Type-safe API contracts
- Automatic input validation
- Automatic API documentation

### 3. Tailwind CSS
- Utility-first approach
- Small bundle size
- Rapid UI development

### 4. Recharts for Visualization
- React-native charting
- Lightweight (no external dependencies)
- Responsive by default

### 5. Fixed Random Seed
- Reproducible results across runs
- Same inputs = same outputs
- Useful for testing

## Performance Characteristics

| Operation | Time | Notes |
|-----------|------|-------|
| Health check | <10ms | Simple endpoint |
| 1000-iteration sim | 5-10s | NumPy vectorized |
| 5000-iteration sim | 25-30s | More accurate, slower |
| Frontend load | <2s | First load with cache |
| API response | <1s | After simulation complete |
| Chart render | <500ms | Recharts optimization |

## Extension Points

### Add Features
1. **Patient Management**: Add `/api/patients` endpoints
2. **Real-time Updates**: Add WebSocket support
3. **Historical Data**: Integrate PostgreSQL
4. **Advanced Analytics**: Add ML prediction models
5. **Reporting**: Generate PDF reports
6. **Multi-user**: Add authentication system

### Modify Simulation
1. Change probability distributions
2. Add more patient segments
3. Implement different queuing models
4. Add machine downtime factors
5. Model staff availability

### UI Customization
1. Add dark mode
2. Create admin dashboard
3. Implement data export
4. Add real-time queue display
5. Create mobile app

## Testing Strategy

### Backend Testing
```bash
cd backend
pytest tests/
```

### Frontend Testing
```bash
cd frontend
npm run test
```

### Integration Testing
- Manual: Use browser to test flows
- Automated: Add Cypress/Selenium tests

## Monitoring & Logging

### Backend
- Uvicorn logs all requests
- Error tracking via try/except
- CPU/Memory monitoring

### Frontend
- Browser console logs
- Network tab in DevTools
- Error boundaries (React)

## Security Considerations

- CORS configured for specific origins
- Input validation on all endpoints
- No sensitive data in logs
- Environment variables for secrets
- Add authentication before production
