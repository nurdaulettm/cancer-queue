"""
Simple QA Test Script using httpx TestClient
No need to start actual server - uses ASGI test client
"""

import sys
sys.path.insert(0, '.')

from fastapi.testclient import TestClient
from main import app

# Test results tracking
passed = 0
failed = 0


def print_header(title: str):
    print("\n" + "=" * 60)
    print(f" {title}")
    print("=" * 60)


def test_result(name: str, success: bool, details: str = ""):
    global passed, failed
    status = "✅ PASS" if success else "❌ FAIL"
    if success:
        passed += 1
    else:
        failed += 1
    print(f"  {status}: {name}")
    if details:
        print(f"         {details}")


print("\n" + "🏥" * 30)
print("  TRUEBEAM QUEUE MANAGEMENT - QA TEST SUITE")
print("  User Accounts & Priority System Tests")
print("🏥" * 30)

client = TestClient(app)

# ==================== Health Check ====================
print_header("1. HEALTH CHECK")

response = client.get("/api/health")
test_result("API Health Check", response.status_code == 200, 
            f"Status: {response.json().get('status', 'unknown')}")

# ==================== Priority Levels ====================
print_header("2. PRIORITY LEVELS")

response = client.get("/api/users/priorities")
test_result("Get Priority Levels", response.status_code == 200)
if response.status_code == 200:
    priorities = response.json().get("priorities", [])
    print(f"         Found {len(priorities)} priority levels:")
    for p in priorities:
        print(f"           Level {p['level']}: {p['name']} ({p['color']}) - Max wait: {p['max_wait_days']} days")

# ==================== Authentication Tests ====================
print_header("3. AUTHENTICATION TESTS")

# Test login with invalid credentials
response = client.post("/api/users/login", json={"email": "fake@test.com", "password": "wrong"})
test_result("Login with invalid credentials (should fail)", response.status_code == 401)

# Login as admin
response = client.post("/api/users/login", json={"email": "admin@truebeam.hospital", "password": "admin123"})
test_result("Login as Admin", response.status_code == 200)
admin_token = None
if response.status_code == 200:
    admin_token = response.json().get("access_token")
    user = response.json().get("user", {})
    print(f"         User: {user.get('full_name')}, Role: {user.get('role')}")

# Login as doctor
response = client.post("/api/users/login", json={"email": "dr.smith@truebeam.hospital", "password": "doctor123"})
test_result("Login as Doctor", response.status_code == 200)
doctor_token = None
if response.status_code == 200:
    doctor_token = response.json().get("access_token")
    print(f"         User: {response.json().get('user', {}).get('full_name')}")

# Login as patient
response = client.post("/api/users/login", json={"email": "patient1@email.com", "password": "patient123"})
test_result("Login as Patient", response.status_code == 200)
patient_token = None
if response.status_code == 200:
    patient_token = response.json().get("access_token")
    print(f"         User: {response.json().get('user', {}).get('full_name')}")

# ==================== User Info Tests ====================
print_header("4. USER INFO TESTS")

# Get admin profile
if admin_token:
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = client.get("/api/users/me", headers=headers)
    test_result("Get Admin Profile", response.status_code == 200)
    if response.status_code == 200:
        print(f"         Name: {response.json().get('full_name')}, Role: {response.json().get('role')}")

# Get patient profile with priority
if patient_token:
    headers = {"Authorization": f"Bearer {patient_token}"}
    response = client.get("/api/users/me", headers=headers)
    test_result("Get Patient Profile with Priority", response.status_code == 200)
    if response.status_code == 200:
        profile = response.json().get("patient_profile", {})
        print(f"         Priority: {profile.get('priority')} - {profile.get('priority_name')}")
        print(f"         Diagnosis: {profile.get('diagnosis')}")

# Test unauthorized access
response = client.get("/api/users/me")
test_result("Access without token (should fail)", response.status_code == 401)

# ==================== Admin Operations ====================
print_header("5. ADMIN OPERATIONS")

if admin_token:
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    # Get all users
    response = client.get("/api/users/all", headers=headers)
    test_result("Get All Users (Admin only)", response.status_code == 200)
    if response.status_code == 200:
        print(f"         Total users: {len(response.json())}")
    
    # Get patients by priority
    response = client.get("/api/users/patients", headers=headers)
    test_result("Get Patients by Priority", response.status_code == 200)
    if response.status_code == 200:
        data = response.json()
        print(f"         Total patients: {data.get('total')}")
        for level, info in data.get("by_priority", {}).items():
            print(f"           Priority {level} ({info['priority_name']}): {info['count']} patients")
    
    # Get all doctors
    response = client.get("/api/users/doctors", headers=headers)
    test_result("Get All Doctors", response.status_code == 200)
    if response.status_code == 200:
        print(f"         Total doctors: {len(response.json())}")
        for doc in response.json():
            profile = doc.get("profile", {})
            print(f"           - {doc['full_name']}: {profile.get('specialization')}")
    
    # Get queue stats
    response = client.get("/api/users/stats", headers=headers)
    test_result("Get Queue Statistics", response.status_code == 200)
    if response.status_code == 200:
        print(f"         Total in queue: {response.json().get('total_patients')}")

# Test patient cannot access admin routes
if patient_token:
    headers = {"Authorization": f"Bearer {patient_token}"}
    response = client.get("/api/users/all", headers=headers)
    test_result("Patient cannot access admin routes", response.status_code == 403)

# ==================== Patient Management ====================
print_header("6. PATIENT MANAGEMENT")

new_patient_id = None
if admin_token:
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    # Create new patient
    response = client.post("/api/users/patients", json={
        "email": "newpatient@test.com",
        "full_name": "Test Patient QA",
        "password": "test123",
        "priority": 3,
        "diagnosis": "QA Test Diagnosis"
    }, headers=headers)
    test_result("Create New Patient", response.status_code == 200)
    if response.status_code == 200:
        new_patient_id = response.json().get("patient", {}).get("user_id")
        patient = response.json().get("patient", {})
        print(f"         Created: {patient.get('full_name')}")
        print(f"         Patient ID: {patient.get('patient_id')}")
        print(f"         Priority: {patient.get('priority_name')}")
    
    # Update patient priority
    if new_patient_id:
        response = client.put(f"/api/users/patients/{new_patient_id}/priority", 
                             json={"new_priority": 1}, headers=headers)
        test_result("Update Patient Priority (3 -> 1 Emergency)", response.status_code == 200)
        if response.status_code == 200:
            patient = response.json().get("patient", {})
            print(f"         New Priority: {patient.get('priority_name')} ({patient.get('priority_color')})")
    
    # Get specific patient details
    if new_patient_id:
        response = client.get(f"/api/users/patients/{new_patient_id}", headers=headers)
        test_result("Get Patient Details", response.status_code == 200)
        if response.status_code == 200:
            profile = response.json().get("profile", {})
            print(f"         Patient ID: {profile.get('patient_id')}")
            print(f"         Priority: {profile.get('priority')} - {profile.get('priority_info', {}).get('name')}")

# ==================== Doctor Operations ====================
print_header("7. DOCTOR OPERATIONS")

if doctor_token:
    headers = {"Authorization": f"Bearer {doctor_token}"}
    
    # Doctor can view patients
    response = client.get("/api/users/patients", headers=headers)
    test_result("Doctor can view patients", response.status_code == 200)
    if response.status_code == 200:
        print(f"         Doctor can see {response.json().get('total')} patients")
    
    # Doctor can update priority
    if new_patient_id:
        response = client.put(f"/api/users/patients/{new_patient_id}/priority",
                             json={"new_priority": 2}, headers=headers)
        test_result("Doctor can update patient priority", response.status_code == 200)
        if response.status_code == 200:
            print(f"         Updated to: {response.json().get('patient', {}).get('priority_name')}")

# ==================== Registration ====================
print_header("8. USER REGISTRATION")

# Register new doctor
response = client.post("/api/users/register", json={
    "email": "newdoctor@test.com",
    "full_name": "Dr. QA Tester",
    "role": "doctor",
    "password": "test123"
})
test_result("Register New Doctor", response.status_code == 200)
if response.status_code == 200:
    print(f"         Registered: {response.json().get('email')} as {response.json().get('role')}")

# Try to register with existing email
response = client.post("/api/users/register", json={
    "email": "admin@truebeam.hospital",
    "full_name": "Duplicate",
    "role": "patient",
    "password": "test123"
})
test_result("Register duplicate email (should fail)", response.status_code == 400)

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

sys.exit(0 if failed == 0 else 1)
