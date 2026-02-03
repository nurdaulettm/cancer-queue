# TrueBeam Smart Queue Management System

A Full-Stack Web Application for optimizing radiation therapy queue management using Monte Carlo simulation.

## Features

### 🎯 Dashboard ("Now" View)
- Real-time queue metrics (wait time, capacity, utilization)
- Horizontal scrollable timeline (08:00 - 18:00, 10-minute slots)
- Visual status indicators (empty, booked, completed, late, buffer)
- Machine utilization gauge with color coding

### 🧪 Strategy Sandbox ("Strategy" View)
- Interactive sliders for overbooking percentage (0-20%)
- No-show rate configuration (0-20%)
- Monte Carlo simulation runner (100-5000 iterations)
- Visualization of wait time distribution
- Sweet spot indicator (Occupancy > 85% AND Wait Time < 10 min)

## Technology Stack

### Backend
- **Framework**: FastAPI (Python)
- **Simulation**: NumPy with Monte Carlo engine
- **Server**: Uvicorn
- **Port**: 8000

### Frontend
- **Framework**: Next.js 14 + React 18
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Port**: 3000

## Installation

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
```

### Frontend Setup
```bash
cd frontend
npm install
```

## Running the Application

### Start Backend
```bash
cd backend
python main.py
# API runs on http://localhost:8000
# Docs available at http://localhost:8000/docs
```

### Start Frontend (in a new terminal)
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

## API Endpoints

### GET `/api/health`
Health check endpoint
```json
{
  "status": "healthy",
  "service": "TrueBeam Queue Management API"
}
```

### POST `/api/simulate`
Run Monte Carlo simulation

**Request:**
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

**Response:**
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
  "buffer_slots": 3
}
```

## Mathematical Formulas

### Patient Show-up (Bernoulli Trial)
Show-up probability: B(1, 1-p_no_show)

### Arrival Time
A_i = T_i + L_i
- T_i = Scheduled time (10-minute slots)
- L_i ~ Uniform[0, 5] (lateness in minutes)

### Waiting Time (Lindley's Recursive Equation)
W_{i+1} = max(0, W_i + S_i - (A_{i+1} - A_i))
- W_i = Waiting time of patient i
- S_i = Service time of patient i
- (A_{i+1} - A_i) = Inter-arrival time

### Optimal Booking Count
N* = Slots / (1 - P_no_show)

## Configuration

### Environment Variables

**.env** (Backend):
```
FASTAPI_ENV=development
API_PORT=8000
FRONTEND_URL=http://localhost:3000
```

**.env.local** (Frontend):
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   └── queue.py
│   │   ├── routes/
│   │   │   └── simulation.py
│   │   └── simulator.py
│   ├── requirements.txt
│   └── main.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── QueueTimeline.jsx
│   │   │   ├── SimulationControls.jsx
│   │   │   └── SimulationResults.jsx
│   │   ├── pages/
│   │   │   ├── index.jsx (Dashboard)
│   │   │   └── strategy.jsx (Sandbox)
│   │   ├── lib/
│   │   │   ├── api.js
│   │   │   └── utils.js
│   │   └── styles/
│   │       └── globals.css
│   ├── package.json
│   └── next.config.js
└── README.md
```

## Key Features Explained

### Monte Carlo Simulation
The backend implements a sophisticated Monte Carlo simulation using:
- **Bernoulli trials** for patient show-up probability
- **Uniform distribution** for lateness (0-5 minutes)
- **Normal distribution** for service times
- **Lindley's recursive equation** for accurate wait time calculation

### Optimal Overbooking Strategy
The formula N* = Slots / (1 - P_ns) suggests the optimal number of patients to schedule:
- Accounts for no-show probability
- Maximizes machine utilization (target > 85%)
- Minimizes patient wait times (target < 10 min)

### Sweet Spot Indicator
The system considers optimization successful when:
- **Occupancy > 85%** (machine stays busy)
- **Wait Time < 10 minutes** (patients don't wait long)

## Testing

### Manual Testing
1. Navigate to http://localhost:3000
2. View real-time metrics on the Dashboard
3. Go to Strategy page
4. Adjust sliders and click "Run Simulation"
5. Observe results and metrics

### API Testing
```bash
# Check health
curl http://localhost:8000/api/health

# Run simulation
curl -X POST http://localhost:8000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "n_simulations": 1000,
    "p_no_show": 0.10,
    "scheduled_patients": 66,
    "overbooking_percentage": 5
  }'
```

## Future Enhancements

- [ ] Database integration (PostgreSQL)
- [ ] Real patient data import
- [ ] Historical data analysis
- [ ] Machine learning predictions
- [ ] Mobile app
- [ ] Advanced reporting

## License

MIT License

## Support

For issues or questions, please contact the development team.
