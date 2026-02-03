"""
User and Authentication Routes
"""

from fastapi import APIRouter, HTTPException, Header, Depends
from typing import Optional, List
from app.models.user import (
    UserCreate, UserLogin, UserResponse, UserRole,
    PatientCreate, PatientResponse, PatientProfile,
    PriorityLevel, PriorityUpdate, PRIORITY_DESCRIPTIONS,
    DoctorProfile
)
from app.database import db

router = APIRouter(prefix="/api/users", tags=["Users"])


def get_current_user(authorization: Optional[str] = Header(None)):
    """Dependency to get current authenticated user"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.replace("Bearer ", "")
    user = db.get_user_by_token(token)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return user


def require_role(allowed_roles: List[UserRole]):
    """Dependency to require specific roles"""
    def role_checker(current_user: dict = Depends(get_current_user)):
        if current_user["role"] not in [r.value for r in allowed_roles]:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return current_user
    return role_checker


# ==================== Authentication ====================

@router.post("/register", response_model=dict)
async def register_user(user_data: UserCreate):
    """Register a new user"""
    # Check if email already exists
    existing = db.get_user_by_email(user_data.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = db.create_user(user_data)
    
    # Create patient profile if patient role
    if user_data.role == UserRole.PATIENT:
        db.patient_profiles[user["id"]] = PatientProfile(
            user_id=user["id"],
            priority=PriorityLevel.STANDARD
        )
    
    return {
        "message": "User registered successfully",
        "user_id": user["id"],
        "email": user["email"],
        "role": user["role"]
    }


@router.post("/login", response_model=dict)
async def login(credentials: UserLogin):
    """Login and get authentication token"""
    user = db.authenticate_user(credentials.email, credentials.password)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not user["is_active"]:
        raise HTTPException(status_code=403, detail="Account is deactivated")
    
    token = db.create_token(user["id"])
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"]
        }
    }


@router.get("/me", response_model=dict)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current logged-in user information"""
    response = {
        "id": current_user["id"],
        "email": current_user["email"],
        "full_name": current_user["full_name"],
        "role": current_user["role"],
        "is_active": current_user["is_active"]
    }
    
    # Add profile info based on role
    if current_user["role"] == UserRole.PATIENT.value:
        profile = db.get_patient_profile(current_user["id"])
        if profile:
            response["patient_profile"] = {
                "patient_id": profile.patient_id,
                "priority": profile.priority.value,
                "priority_name": PRIORITY_DESCRIPTIONS[profile.priority]["name"],
                "diagnosis": profile.diagnosis,
                "treatment_plan": profile.treatment_plan
            }
    elif current_user["role"] == UserRole.DOCTOR.value:
        profile = db.get_doctor_profile(current_user["id"])
        if profile:
            response["doctor_profile"] = {
                "specialization": profile.specialization,
                "license_number": profile.license_number,
                "department": profile.department
            }
    
    return response


# ==================== Admin Routes ====================

@router.get("/all", response_model=List[dict])
async def get_all_users(
    role: Optional[str] = None,
    current_user: dict = Depends(require_role([UserRole.ADMIN]))
):
    """Get all users (Admin only)"""
    filter_role = UserRole(role) if role else None
    users = db.get_all_users(filter_role)
    
    # Remove password hashes
    return [{k: v for k, v in u.items() if k != "password_hash"} for u in users]


@router.get("/doctors", response_model=List[dict])
async def get_all_doctors(current_user: dict = Depends(get_current_user)):
    """Get all doctors"""
    doctors = db.get_all_users(UserRole.DOCTOR)
    
    result = []
    for doc in doctors:
        profile = db.get_doctor_profile(doc["id"])
        result.append({
            "id": doc["id"],
            "full_name": doc["full_name"],
            "email": doc["email"],
            "profile": {
                "specialization": profile.specialization if profile else None,
                "department": profile.department if profile else None
            } if profile else None
        })
    
    return result


@router.get("/patients", response_model=dict)
async def get_all_patients(
    current_user: dict = Depends(require_role([UserRole.ADMIN, UserRole.DOCTOR]))
):
    """Get all patients grouped by priority (Admin/Doctor only)"""
    patients_by_priority = db.get_patients_by_priority()
    
    result = {
        "total": len(db.patient_profiles),
        "by_priority": {}
    }
    
    for priority, patients in patients_by_priority.items():
        result["by_priority"][priority.value] = {
            "priority_name": PRIORITY_DESCRIPTIONS[priority]["name"],
            "priority_color": PRIORITY_DESCRIPTIONS[priority]["color"],
            "description": PRIORITY_DESCRIPTIONS[priority]["description"],
            "max_wait_days": PRIORITY_DESCRIPTIONS[priority]["max_wait_days"],
            "count": len(patients),
            "patients": [{
                "id": p["user"]["id"],
                "full_name": p["user"]["full_name"],
                "email": p["user"]["email"],
                "patient_id": p["profile"].patient_id,
                "diagnosis": p["profile"].diagnosis,
                "assigned_doctor_id": p["profile"].assigned_doctor_id
            } for p in patients]
        }
    
    return result


# ==================== Patient Management ====================

@router.post("/patients", response_model=dict)
async def create_patient(
    patient_data: PatientCreate,
    current_user: dict = Depends(require_role([UserRole.ADMIN, UserRole.DOCTOR]))
):
    """Create a new patient (Admin/Doctor only)"""
    # Check if email already exists
    existing = db.get_user_by_email(patient_data.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user = db.create_user(UserCreate(
        email=patient_data.email,
        full_name=patient_data.full_name,
        role=UserRole.PATIENT,
        password=patient_data.password
    ))
    
    # Create patient profile
    profile = PatientProfile(
        user_id=user["id"],
        priority=patient_data.priority,
        diagnosis=patient_data.diagnosis,
        treatment_plan=patient_data.treatment_plan,
        assigned_doctor_id=patient_data.assigned_doctor_id
    )
    db.patient_profiles[user["id"]] = profile
    
    return {
        "message": "Patient created successfully",
        "patient": {
            "user_id": user["id"],
            "patient_id": profile.patient_id,
            "full_name": user["full_name"],
            "email": user["email"],
            "priority": profile.priority.value,
            "priority_name": PRIORITY_DESCRIPTIONS[profile.priority]["name"]
        }
    }


@router.put("/patients/{user_id}/priority", response_model=dict)
async def update_patient_priority(
    user_id: str,
    priority_data: PriorityUpdate,
    current_user: dict = Depends(require_role([UserRole.ADMIN, UserRole.DOCTOR]))
):
    """Update patient priority (Admin/Doctor only)"""
    profile = db.update_patient_priority(user_id, priority_data.new_priority)
    
    if not profile:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    user = db.get_user_by_id(user_id)
    
    return {
        "message": "Priority updated successfully",
        "patient": {
            "user_id": user_id,
            "full_name": user["full_name"] if user else None,
            "new_priority": priority_data.new_priority.value,
            "priority_name": PRIORITY_DESCRIPTIONS[priority_data.new_priority]["name"],
            "priority_color": PRIORITY_DESCRIPTIONS[priority_data.new_priority]["color"]
        }
    }


@router.get("/patients/{user_id}", response_model=dict)
async def get_patient_details(
    user_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get patient details"""
    # Patients can only view their own info
    if current_user["role"] == UserRole.PATIENT.value and current_user["id"] != user_id:
        raise HTTPException(status_code=403, detail="Cannot view other patients")
    
    user = db.get_user_by_id(user_id)
    if not user or user["role"] != UserRole.PATIENT.value:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    profile = db.get_patient_profile(user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Patient profile not found")
    
    # Get assigned doctor info
    doctor_info = None
    if profile.assigned_doctor_id:
        doctor = db.get_user_by_id(profile.assigned_doctor_id)
        if doctor:
            doctor_info = {
                "id": doctor["id"],
                "full_name": doctor["full_name"]
            }
    
    return {
        "user": {
            "id": user["id"],
            "email": user["email"],
            "full_name": user["full_name"]
        },
        "profile": {
            "patient_id": profile.patient_id,
            "priority": profile.priority.value,
            "priority_info": PRIORITY_DESCRIPTIONS[profile.priority],
            "diagnosis": profile.diagnosis,
            "treatment_plan": profile.treatment_plan,
            "assigned_doctor": doctor_info,
            "created_at": profile.created_at.isoformat() if profile.created_at else None
        }
    }


# ==================== Priority Information ====================

@router.get("/priorities", response_model=dict)
async def get_priority_levels():
    """Get all priority levels and their descriptions"""
    return {
        "priorities": [
            {
                "level": priority.value,
                "name": info["name"],
                "description": info["description"],
                "max_wait_days": info["max_wait_days"],
                "color": info["color"]
            }
            for priority, info in PRIORITY_DESCRIPTIONS.items()
        ]
    }


@router.get("/stats", response_model=dict)
async def get_queue_statistics(
    current_user: dict = Depends(require_role([UserRole.ADMIN, UserRole.DOCTOR]))
):
    """Get queue statistics by priority"""
    return db.get_queue_stats()
