"""
Monte Carlo Simulation Engine for TrueBeam Queue Management
Implements the mathematical formulas from the project report
"""

import numpy as np
from typing import Tuple, List, Dict
from dataclasses import dataclass


@dataclass
class SimulationConfig:
    """Configuration for Monte Carlo simulation"""
    n_simulations: int = 1000
    p_no_show: float = 0.10
    scheduled_patients: int = 66
    mean_service_time: float = 15.0  # minutes
    std_service_time: float = 5.0  # minutes
    overbooking_percentage: float = 0.0


class QueueSimulator:
    """
    Monte Carlo Queue Simulator using Lindley's Recursive Equation
    for waiting time calculation
    """
    
    def __init__(self, config: SimulationConfig):
        self.config = config
        self.rng = np.random.RandomState(42)  # Fixed seed for reproducibility
        
    def generate_patient_arrivals(self, n_patients: int) -> Tuple[np.ndarray, np.ndarray]:
        """
        Generate patient arrivals using Bernoulli trials and uniform lateness
        
        Arrival Time: A_i = T_i + L_i
        where:
            T_i = scheduled time (10-minute slots)
            L_i ~ Uniform[0, 5] minutes (lateness)
        
        Returns:
            arrival_times: Array of arrival times (in minutes from start)
            shows_up: Boolean array indicating patient show-up (Bernoulli trials)
        """
        # Bernoulli trials for no-shows: B(1, 1-p_ns)
        shows_up = self.rng.binomial(1, 1 - self.config.p_no_show, n_patients).astype(bool)
        
        # Scheduled times: 10-minute slots starting from 480 min (8:00 AM)
        scheduled_times = np.arange(n_patients) * 10 + 480
        
        # Lateness: L_i ~ Uniform[0, 5]
        lateness = self.rng.uniform(0, 5, n_patients)
        
        # Actual arrival times
        arrival_times = scheduled_times + lateness
        
        return arrival_times, shows_up
    
    def generate_service_times(self, n_patients: int) -> np.ndarray:
        """
        Generate service times (treatment duration) from normal distribution
        
        S_i ~ N(mean_service_time, std_service_time^2)
        Clipped at [5, 60] minutes
        """
        service_times = self.rng.normal(
            self.config.mean_service_time,
            self.config.std_service_time,
            n_patients
        )
        # Clip to realistic bounds [5, 60] minutes
        service_times = np.clip(service_times, 5, 60)
        return service_times
    
    def calculate_waiting_times(self, arrival_times: np.ndarray, 
                               service_times: np.ndarray,
                               shows_up: np.ndarray) -> np.ndarray:
        """
        Calculate waiting times using Lindley's Recursive Equation
        
        W_{i+1} = max(0, W_i + S_i - (A_{i+1} - A_i))
        
        This equation represents:
        - W_i: waiting time of patient i
        - S_i: service time of patient i
        - (A_{i+1} - A_i): inter-arrival time
        
        Returns:
            waiting_times: Array of waiting times for each patient
        """
        n_patients = len(arrival_times)
        waiting_times = np.zeros(n_patients)
        
        # Only process patients who show up
        valid_indices = np.where(shows_up)[0]
        
        if len(valid_indices) == 0:
            return waiting_times
        
        # Process only showing patients
        prev_wait = 0
        for i, idx in enumerate(valid_indices):
            if i == 0:
                # First patient waits if arriving late
                waiting_times[idx] = max(0, -arrival_times[idx])
            else:
                # Lindley's equation
                prev_idx = valid_indices[i - 1]
                inter_arrival = arrival_times[idx] - arrival_times[prev_idx]
                prev_wait = waiting_times[prev_idx]
                prev_service = service_times[prev_idx]
                
                waiting_times[idx] = max(0, prev_wait + prev_service - inter_arrival)
        
        return waiting_times
    
    def run_simulation(self) -> Dict:
        """
        Run Monte Carlo simulation
        
        Returns:
            Dictionary with simulation results
        """
        n_simulations = self.config.n_simulations
        n_patients = self.config.scheduled_patients
        
        # Arrays to store results across simulations
        avg_wait_times = np.zeros(n_simulations)
        occupancy_rates = np.zeros(n_simulations)
        actual_arrivals = np.zeros(n_simulations)
        
        for sim in range(n_simulations):
            # Generate arrivals and show-ups
            arrival_times, shows_up = self.generate_patient_arrivals(n_patients)
            service_times = self.generate_service_times(n_patients)
            
            # Calculate waiting times
            waiting_times = self.calculate_waiting_times(
                arrival_times, service_times, shows_up
            )
            
            # Only consider waiting times for patients who showed up
            valid_waits = waiting_times[shows_up]
            
            # Average wait time (only for patients who showed up)
            if len(valid_waits) > 0:
                avg_wait_times[sim] = np.mean(valid_waits)
            else:
                avg_wait_times[sim] = 0
            
            # Occupancy: (total service time) / (available machine time)
            # Available machine time: 10 hours = 600 minutes
            total_service_time = np.sum(service_times[shows_up])
            occupancy_rates[sim] = (total_service_time / 600) * 100
            
            # Actual arrivals
            actual_arrivals[sim] = np.sum(shows_up)
        
        # Calculate statistics
        mean_wait = np.mean(avg_wait_times)
        std_wait = np.std(avg_wait_times)
        median_wait = np.median(avg_wait_times)
        min_wait = np.min(avg_wait_times)
        max_wait = np.max(avg_wait_times)
        p95_wait = np.percentile(avg_wait_times, 95)
        p99_wait = np.percentile(avg_wait_times, 99)
        
        # Occupancy metrics
        mean_occupancy = np.mean(occupancy_rates)
        mean_actual_arrivals = np.mean(actual_arrivals)
        
        # Machine idle percentage
        machine_idle = 100 - min(mean_occupancy, 100)
        
        # Risk of overload: percentage of simulations where occupancy > 100%
        risk_of_overload = (np.sum(occupancy_rates > 100) / n_simulations) * 100
        
        # Optimal booking count: N* = Slots / (1 - P_ns)
        optimal_booking = n_patients / (1 - self.config.p_no_show)
        
        # Buffer slots (extra booked beyond normal capacity)
        buffer_slots = int(optimal_booking - n_patients)
        
        return {
            'average_wait_time': float(mean_wait),
            'occupancy_percentage': float(mean_occupancy),
            'occupancy_std': float(np.std(occupancy_rates)),
            'risk_of_overload': float(risk_of_overload),
            'optimal_booking_count': float(optimal_booking),
            'actual_patients_showed_up': float(mean_actual_arrivals),
            'machine_idle_percentage': float(machine_idle),
            'buffer_slots': buffer_slots,
            'wait_time_distribution': {
                'mean': float(mean_wait),
                'median': float(median_wait),
                'std': float(std_wait),
                'min': float(min_wait),
                'max': float(max_wait),
                'percentile_95': float(p95_wait),
                'percentile_99': float(p99_wait),
            },
            'simulation_metadata': {
                'n_simulations': n_simulations,
                'p_no_show': self.config.p_no_show,
                'scheduled_patients': n_patients,
                'mean_service_time': self.config.mean_service_time,
                'std_service_time': self.config.std_service_time,
                'overbooking_percentage': self.config.overbooking_percentage,
            },
            'wait_times_histogram': {
                'bins': self._create_histogram(avg_wait_times),
                'labels': self._create_bin_labels(avg_wait_times)
            }
        }
    
    def _create_histogram(self, data: np.ndarray, n_bins: int = 20) -> List[float]:
        """Create histogram data for visualization"""
        hist, _ = np.histogram(data, bins=n_bins)
        return hist.tolist()
    
    def _create_bin_labels(self, data: np.ndarray, n_bins: int = 20) -> List[str]:
        """Create bin labels for histogram"""
        hist, edges = np.histogram(data, bins=n_bins)
        labels = [f"{edges[i]:.1f}-{edges[i+1]:.1f}" for i in range(len(edges)-1)]
        return labels
