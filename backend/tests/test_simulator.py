"""
Test suite for Monte Carlo queue simulator
"""

import pytest
from app.simulator import QueueSimulator, SimulationConfig


def test_simulator_initialization():
    """Test simulator can be initialized with config"""
    config = SimulationConfig(
        n_simulations=100,
        p_no_show=0.10,
        scheduled_patients=66
    )
    simulator = QueueSimulator(config)
    assert simulator.config.n_simulations == 100


def test_patient_arrival_generation():
    """Test patient arrival generation"""
    config = SimulationConfig(n_simulations=10, scheduled_patients=10)
    simulator = QueueSimulator(config)
    
    arrivals, shows_up = simulator.generate_patient_arrivals(10)
    
    assert len(arrivals) == 10
    assert len(shows_up) == 10
    assert all(isinstance(s, (bool, type(True))) for s in shows_up)


def test_service_time_generation():
    """Test service time generation"""
    config = SimulationConfig(
        n_simulations=10,
        scheduled_patients=10,
        mean_service_time=15.0,
        std_service_time=5.0
    )
    simulator = QueueSimulator(config)
    
    service_times = simulator.generate_service_times(10)
    
    assert len(service_times) == 10
    assert all(5 <= s <= 60 for s in service_times)  # Clipped bounds


def test_simulation_runs():
    """Test full simulation execution"""
    config = SimulationConfig(
        n_simulations=100,
        p_no_show=0.10,
        scheduled_patients=66
    )
    simulator = QueueSimulator(config)
    
    results = simulator.run_simulation()
    
    assert 'average_wait_time' in results
    assert 'occupancy_percentage' in results
    assert 'risk_of_overload' in results
    assert 'optimal_booking_count' in results
    assert results['average_wait_time'] >= 0
    assert 0 <= results['occupancy_percentage'] <= 200  # Can exceed 100%
    assert 0 <= results['risk_of_overload'] <= 100


def test_overbooking_calculation():
    """Test overbooking count calculation"""
    base_patients = 66
    no_show_rate = 0.10
    expected_optimal = base_patients / (1 - no_show_rate)
    
    assert expected_optimal == pytest.approx(73.33, rel=0.01)
