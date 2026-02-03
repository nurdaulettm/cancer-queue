"""
Queue Management API Routes
"""

from fastapi import APIRouter, HTTPException
from app.models.queue import SimulationRequest, SimulationResult
from app.simulator import QueueSimulator, SimulationConfig

router = APIRouter(prefix="/api", tags=["simulation"])


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "TrueBeam Queue Management API",
        "version": "1.0.0"
    }


@router.post("/simulate", response_model=SimulationResult)
async def run_simulation(request: SimulationRequest):
    """
    Run Monte Carlo simulation for queue optimization
    
    Parameters:
    - n_simulations: Number of simulation runs (default: 1000)
    - p_no_show: Probability of patient no-show (0-1, default: 0.10)
    - scheduled_patients: Number of patients to schedule (default: 66)
    - overbooking_percentage: Overbooking strategy (0-20%, default: 0)
    - mean_service_time: Average treatment time in minutes (default: 15)
    - std_service_time: Standard deviation of treatment time (default: 5)
    """
    
    try:
        # Validate inputs
        if request.n_simulations < 100 or request.n_simulations > 10000:
            raise HTTPException(
                status_code=400,
                detail="n_simulations must be between 100 and 10000"
            )
        
        if request.p_no_show < 0 or request.p_no_show > 1:
            raise HTTPException(
                status_code=400,
                detail="p_no_show must be between 0 and 1"
            )
        
        if request.overbooking_percentage < 0 or request.overbooking_percentage > 20:
            raise HTTPException(
                status_code=400,
                detail="overbooking_percentage must be between 0 and 20"
            )
        
        # Adjust scheduled patients based on overbooking
        overbooking_factor = 1 + (request.overbooking_percentage / 100)
        adjusted_patients = int(request.scheduled_patients * overbooking_factor)
        
        # Create simulator config
        config = SimulationConfig(
            n_simulations=request.n_simulations,
            p_no_show=request.p_no_show,
            scheduled_patients=adjusted_patients,
            mean_service_time=request.mean_service_time,
            std_service_time=request.std_service_time,
            overbooking_percentage=request.overbooking_percentage
        )
        
        # Run simulation
        simulator = QueueSimulator(config)
        results = simulator.run_simulation()
        
        # Return formatted result
        return SimulationResult(
            average_wait_time=results['average_wait_time'],
            occupancy_percentage=results['occupancy_percentage'],
            risk_of_overload=results['risk_of_overload'],
            optimal_booking_count=results['optimal_booking_count'],
            wait_time_distribution=results['wait_time_distribution'],
            actual_patients_scheduled=adjusted_patients,
            actual_patients_showed_up=results['actual_patients_showed_up'],
            machine_idle_percentage=results['machine_idle_percentage'],
            buffer_slots=results['buffer_slots'],
            simulation_metadata=results['simulation_metadata']
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Simulation failed: {str(e)}"
        )
