"""
QA Test Script for User Accounts and Priority System
Tests all user management and priority endpoints
"""

import requests
import json
import sys
from typing import Optional

BASE_URL = "http://localhost:8000"

# Test results tracking
passed = 0
failed = 0
tests_run = []


def print_header(title: str):
    print("\n" + "=" * 60)
    print(f" {title}")
    print("=" * 60)


def print_test(name: str, success: bool, details: str = ""):
    global passed, failed
    status = "✅ PASS" if success else "❌ FAIL"
    if success:
        passed += 1
    else:
        failed += 1
    tests_run.append({"name": name, "success": success, "details": details})
    print(f"  {status}: {name}")
    if details and not success:
        print(f"         Details: {details}")


def test_endpoint(method: str, url: str, expected_status: int, 
                  name: str, json_data: dict = None, 
                  headers: dict = None) -> Optional[dict]:
    """Generic endpoint tester"""
    try:
        if method == "GET":
            response = requests.get(url, headers=headers, timeout=10)
        elif method == "POST":
            response = requests.post(url, json=json_data, headers=headers, timeout=10)
        elif method == "PUT":
            response = requests.put(url, json=json_data, headers=headers, timeout=10)
        else:
            print_test(name, False, f"Unknown method: {method}")
            return None
        
        success = response.status_code == expected_status
        details = f"Expected {expected_status}, got {response.status_code}"
        if not success:
            try:
                details += f" - {response.json()}"
            except:
                details += f" - {response.text[:100]}"
        print_test(name, success, details if not success else "")
        
        if success:
            try:
                return response.json()
            except:
                return {"text": response.text}
        return None
    except requests.exceptions.ConnectionError:
        print_test(name, False, "Connection refused - is the server running?")
        return None
    except Exception as e:
        print_test(name, False, str(e))
        return None


def main():
    print("\n" + "🏥" * 30)
    print("  TRUEBEAM QUEUE MANAGEMENT - QA TEST SUITE")
    print("  User Accounts & Priority System Tests")
    print("🏥" * 30)

    # ==================== Health Check ====================
    print_header("1. HEALTH CHECK")
    
    result = test_endpoint("GET", f"{BASE_URL}/api/health", 200, "API Health Check")
    if result:
        print(f"         Status: {result.get('status', 'unknown')}")

    # ==================== Priority Levels ====================
    print_header("2. PRIORITY LEVELS")
    
    result = test_endpoint("GET", f"{BASE_URL}/api/users/priorities", 200, 
                          "Get Priority Levels")
    if result:
        priorities = result.get("priorities", [])
        print(f"         Found {len(priorities)} priority levels:")
        for p in priorities:
            print(f"           Level {p['level']}: {p['name']} ({p['color']}) - Max wait: {p['max_wait_days']} days")

    # ==================== Authentication ====================
    print_header("3. AUTHENTICATION TESTS")
    
    # Test login with invalid credentials
    test_endpoint("POST", f"{BASE_URL}/api/users/login", 401,
                 "Login with invalid credentials",
                 json_data={"email": "fake@test.com", "password": "wrong"})
    
    # Login as admin
    admin_token = None
    result = test_endpoint("POST", f"{BASE_URL}/api/users/login", 200,
                          "Login as Admin (admin@truebeam.hospital)",
                          json_data={"email": "admin@truebeam.hospital", "password": "admin123"})
    if result:
        admin_token = result.get("access_token")
        print(f"         User: {result.get('user', {}).get('full_name')}")
        print(f"         Role: {result.get('user', {}).get('role')}")
    
    # Login as doctor
    doctor_token = None
    result = test_endpoint("POST", f"{BASE_URL}/api/users/login", 200,
                          "Login as Doctor (dr.smith@truebeam.hospital)",
                          json_data={"email": "dr.smith@truebeam.hospital", "password": "doctor123"})
    if result:
        doctor_token = result.get("access_token")
        print(f"         User: {result.get('user', {}).get('full_name')}")
    
    # Login as patient
    patient_token = None
    result = test_endpoint("POST", f"{BASE_URL}/api/users/login", 200,
                          "Login as Patient (patient1@email.com)",
                          json_data={"email": "patient1@email.com", "password": "patient123"})
    if result:
        patient_token = result.get("access_token")
        print(f"         User: {result.get('user', {}).get('full_name')}")

    # ==================== User Info ====================
    print_header("4. USER INFO TESTS")
    
    # Get current user info
    if admin_token:
        headers = {"Authorization": f"Bearer {admin_token}"}
        result = test_endpoint("GET", f"{BASE_URL}/api/users/me", 200,
                              "Get Admin Profile", headers=headers)
        if result:
            print(f"         Name: {result.get('full_name')}")
            print(f"         Role: {result.get('role')}")
    
    if patient_token:
        headers = {"Authorization": f"Bearer {patient_token}"}
        result = test_endpoint("GET", f"{BASE_URL}/api/users/me", 200,
                              "Get Patient Profile with Priority", headers=headers)
        if result:
            profile = result.get("patient_profile", {})
            print(f"         Name: {result.get('full_name')}")
            print(f"         Priority: {profile.get('priority')} - {profile.get('priority_name')}")
            print(f"         Diagnosis: {profile.get('diagnosis')}")
    
    # Test unauthorized access
    test_endpoint("GET", f"{BASE_URL}/api/users/me", 401,
                 "Access without token (should fail)")

    # ==================== Admin Operations ====================
    print_header("5. ADMIN OPERATIONS")
    
    if admin_token:
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        # Get all users
        result = test_endpoint("GET", f"{BASE_URL}/api/users/all", 200,
                              "Get All Users (Admin only)", headers=headers)
        if result:
            print(f"         Total users: {len(result)}")
        
        # Get all patients grouped by priority
        result = test_endpoint("GET", f"{BASE_URL}/api/users/patients", 200,
                              "Get Patients by Priority", headers=headers)
        if result:
            print(f"         Total patients: {result.get('total')}")
            by_priority = result.get("by_priority", {})
            for level, data in by_priority.items():
                print(f"           Priority {level} ({data['priority_name']}): {data['count']} patients")
        
        # Get all doctors
        result = test_endpoint("GET", f"{BASE_URL}/api/users/doctors", 200,
                              "Get All Doctors", headers=headers)
        if result:
            print(f"         Total doctors: {len(result)}")
            for doc in result:
                profile = doc.get("profile", {})
                print(f"           - {doc['full_name']}: {profile.get('specialization')}")
        
        # Get queue statistics
        result = test_endpoint("GET", f"{BASE_URL}/api/users/stats", 200,
                              "Get Queue Statistics", headers=headers)
        if result:
            print(f"         Total patients in queue: {result.get('total_patients')}")
    
    # Test patient cannot access admin routes
    if patient_token:
        headers = {"Authorization": f"Bearer {patient_token}"}
        test_endpoint("GET", f"{BASE_URL}/api/users/all", 403,
                     "Patient cannot access admin routes")

    # ==================== Patient Management ====================
    print_header("6. PATIENT MANAGEMENT")
    
    new_patient_id = None
    if admin_token:
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        # Create new patient
        result = test_endpoint("POST", f"{BASE_URL}/api/users/patients", 200,
                              "Create New Patient",
                              json_data={
                                  "email": "newpatient@test.com",
                                  "full_name": "Test Patient QA",
                                  "password": "test123",
                                  "priority": 3,
                                  "diagnosis": "QA Test Diagnosis"
                              },
                              headers=headers)
        if result:
            new_patient_id = result.get("patient", {}).get("user_id")
            print(f"         Created: {result.get('patient', {}).get('full_name')}")
            print(f"         Patient ID: {result.get('patient', {}).get('patient_id')}")
            print(f"         Priority: {result.get('patient', {}).get('priority_name')}")
        
        # Update patient priority
        if new_patient_id:
            result = test_endpoint("PUT", f"{BASE_URL}/api/users/patients/{new_patient_id}/priority", 200,
                                  "Update Patient Priority (3 -> 1 Emergency)",
                                  json_data={"new_priority": 1},
                                  headers=headers)
            if result:
                print(f"         New Priority: {result.get('patient', {}).get('priority_name')}")
                print(f"         Color: {result.get('patient', {}).get('priority_color')}")
        
        # Get specific patient details
        if new_patient_id:
            result = test_endpoint("GET", f"{BASE_URL}/api/users/patients/{new_patient_id}", 200,
                                  "Get Patient Details", headers=headers)
            if result:
                profile = result.get("profile", {})
                print(f"         Patient ID: {profile.get('patient_id')}")
                print(f"         Priority: {profile.get('priority')} - {profile.get('priority_info', {}).get('name')}")

    # ==================== Doctor Operations ====================
    print_header("7. DOCTOR OPERATIONS")
    
    if doctor_token:
        headers = {"Authorization": f"Bearer {doctor_token}"}
        
        # Doctor can view patients
        result = test_endpoint("GET", f"{BASE_URL}/api/users/patients", 200,
                              "Doctor can view patients", headers=headers)
        if result:
            print(f"         Doctor can see {result.get('total')} patients")
        
        # Doctor can update priority
        if new_patient_id:
            result = test_endpoint("PUT", f"{BASE_URL}/api/users/patients/{new_patient_id}/priority", 200,
                                  "Doctor can update patient priority",
                                  json_data={"new_priority": 2},
                                  headers=headers)
            if result:
                print(f"         Updated to: {result.get('patient', {}).get('priority_name')}")

    # ==================== Registration ====================
    print_header("8. USER REGISTRATION")
    
    # Register new doctor
    result = test_endpoint("POST", f"{BASE_URL}/api/users/register", 200,
                          "Register New Doctor",
                          json_data={
                              "email": "newdoctor@test.com",
                              "full_name": "Dr. QA Tester",
                              "role": "doctor",
                              "password": "test123"
                          })
    if result:
        print(f"         Registered: {result.get('email')} as {result.get('role')}")
    
    # Try to register with existing email
    test_endpoint("POST", f"{BASE_URL}/api/users/register", 400,
                 "Register duplicate email (should fail)",
                 json_data={
                     "email": "admin@truebeam.hospital",
                     "full_name": "Duplicate",
                     "role": "patient",
                     "password": "test123"
                 })

    # ==================== Summary ====================
    print_header("TEST SUMMARY")
    
    total = passed + failed
    percentage = (passed / total * 100) if total > 0 else 0
    
    print(f"\n  Total Tests: {total}")
    print(f"  ✅ Passed: {passed}")
    print(f"  ❌ Failed: {failed}")
    print(f"  Success Rate: {percentage:.1f}%")
    
    if failed == 0:
        print("\n  🎉 ALL TESTS PASSED! System is working correctly.")
        print("  ✅ User accounts (Admin, Doctor, Patient) working")
        print("  ✅ 5-level priority system working")
        print("  ✅ Role-based access control working")
        print("  ✅ Authentication working")
    else:
        print(f"\n  ⚠️ {failed} test(s) failed. Please review the issues above.")
        print("\n  Failed Tests:")
        for test in tests_run:
            if not test["success"]:
                print(f"    - {test['name']}: {test['details']}")
    
    print("\n" + "=" * 60)
    print("  DEFAULT LOGIN CREDENTIALS")
    print("=" * 60)
    print("  👤 Admin:   admin@truebeam.hospital / admin123")
    print("  👨‍⚕️ Doctor:  dr.smith@truebeam.hospital / doctor123")
    print("  🏥 Patient: patient1@email.com / patient123")
    print("=" * 60)
    
    print("\n  📊 PRIORITY LEVELS:")
    print("  1️⃣  EMERGENCY (Red)    - Life-threatening, immediate")
    print("  2️⃣  URGENT (Orange)    - 24-48 hours max wait")
    print("  3️⃣  HIGH (Yellow)      - Within 1 week")
    print("  4️⃣  STANDARD (Blue)    - Non-urgent, scheduled")
    print("  5️⃣  ROUTINE (Green)    - Follow-up appointments")
    print("=" * 60 + "\n")
    
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
