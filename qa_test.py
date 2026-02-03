#!/usr/bin/env python3
"""
TrueBeam Queue Management System - QA Testing & Verification
Tests all endpoints and features
"""

import requests
import time
import json
import sys

class QATest:
    def __init__(self, api_url="http://localhost:8000", frontend_url="http://localhost:3000"):
        self.api_url = api_url
        self.frontend_url = frontend_url
        self.passed = 0
        self.failed = 0
        self.results = []
    
    def test(self, name, func):
        """Run a test and track results"""
        try:
            func()
            self.passed += 1
            self.results.append(f"✅ {name}")
            print(f"✅ {name}")
            return True
        except Exception as e:
            self.failed += 1
            self.results.append(f"❌ {name}: {str(e)}")
            print(f"❌ {name}: {str(e)}")
            return False
    
    def test_api_health(self):
        """Test 1: API Health Check"""
        response = requests.get(f"{self.api_url}/api/health", timeout=5)
        assert response.status_code == 200
        data = response.json()
        assert data['status'] == 'healthy'
    
    def test_api_docs(self):
        """Test 2: API Documentation Available"""
        response = requests.get(f"{self.api_url}/docs", timeout=5)
        assert response.status_code == 200
    
    def test_simulate_default(self):
        """Test 3: Simulation with Default Parameters"""
        response = requests.post(
            f"{self.api_url}/api/simulate",
            json={
                "n_simulations": 100,
                "p_no_show": 0.10,
                "scheduled_patients": 66
            },
            timeout=30
        )
        assert response.status_code == 200
        data = response.json()
        assert 'average_wait_time' in data
        assert 'occupancy_percentage' in data
        assert 'risk_of_overload' in data
    
    def test_simulate_custom(self):
        """Test 4: Simulation with Custom Parameters"""
        response = requests.post(
            f"{self.api_url}/api/simulate",
            json={
                "n_simulations": 500,
                "p_no_show": 0.15,
                "scheduled_patients": 66,
                "overbooking_percentage": 10
            },
            timeout=30
        )
        assert response.status_code == 200
        data = response.json()
        assert data['actual_patients_scheduled'] > 0
    
    def test_frontend_loads(self):
        """Test 5: Frontend Dashboard Loads"""
        response = requests.get(self.frontend_url, timeout=5)
        assert response.status_code == 200
        assert 'html' in response.text.lower()
    
    def test_cors_headers(self):
        """Test 6: CORS Headers Present"""
        response = requests.get(f"{self.api_url}/api/health", timeout=5)
        assert 'access-control-allow-origin' in response.headers
    
    def test_response_format(self):
        """Test 7: Response Format Valid"""
        response = requests.post(
            f"{self.api_url}/api/simulate",
            json={
                "n_simulations": 100,
                "p_no_show": 0.10,
                "scheduled_patients": 66
            },
            timeout=30
        )
        data = response.json()
        assert isinstance(data['average_wait_time'], (int, float))
        assert isinstance(data['occupancy_percentage'], (int, float))
        assert isinstance(data['wait_time_distribution'], dict)
    
    def run_all_tests(self):
        """Run all QA tests"""
        print("\n" + "="*60)
        print("TrueBeam Queue Management - QA Test Suite")
        print("="*60 + "\n")
        
        tests = [
            ("API Health Check", self.test_api_health),
            ("API Documentation", self.test_api_docs),
            ("Simulation (Default)", self.test_simulate_default),
            ("Simulation (Custom)", self.test_simulate_custom),
            ("Frontend Loads", self.test_frontend_loads),
            ("CORS Configuration", self.test_cors_headers),
            ("Response Format", self.test_response_format),
        ]
        
        for name, func in tests:
            self.test(name, func)
            time.sleep(0.5)
        
        print("\n" + "="*60)
        print(f"RESULTS: {self.passed} Passed ✅  |  {self.failed} Failed ❌")
        print("="*60 + "\n")
        
        if self.failed == 0:
            print("🎉 ALL TESTS PASSED! System is ready! 🎉\n")
            return True
        else:
            print(f"⚠️  {self.failed} test(s) failed. See details above.\n")
            return False


def main():
    # Wait for services to start
    print("Waiting for services to start...\n")
    time.sleep(3)
    
    # Run QA tests
    qa = QATest()
    success = qa.run_all_tests()
    
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
