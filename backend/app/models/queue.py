from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PatientSchedule(BaseModel):
    """Model for a scheduled patient"""
    patient_id: str
    scheduled_time: datetime
    service_time: float  # in minutes
    shows_up: bool = True


class SimulationRequest(BaseModel):
    """Request model for Monte Carlo simulation"""
    n_simulations: int = 1000
    p_no_show: float = 0.10  # Probability of no-show
    scheduled_patients: int = 66
    overbooking_percentage: float = 0.0  # 0-20%
    mean_service_time: float = 15.0  # minutes
    std_service_time: float = 5.0  # minutes


class WaitTimeDistribution(BaseModel):
    """Distribution statistics for wait times"""
    mean: float
    median: float
    std: float
    min: float
    max: float
    percentile_95: float
    percentile_99: float


class SimulationResult(BaseModel):
    """Response model for simulation results"""
    average_wait_time: float
    occupancy_percentage: float
    risk_of_overload: float
    optimal_booking_count: float
    wait_time_distribution: WaitTimeDistribution
    actual_patients_scheduled: int
    actual_patients_showed_up: float
    machine_idle_percentage: float
    buffer_slots: int
    simulation_metadata: dict
