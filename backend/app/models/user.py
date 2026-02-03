"""
User and Priority Models for TrueBeam Queue Management
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from enum import Enum
from datetime import datetime
import uuid


class UserRole(str, Enum):
    """User roles in the system"""
    ADMIN = "admin"
    DOCTOR = "doctor"
    PATIENT = "patient"


class PriorityLevel(int, Enum):
    """
    Patient priority levels (1-5)
    1 = Highest priority (Emergency/Critical)
    5 = Lowest priority (Routine/Follow-up)
    """
    EMERGENCY = 1       # Life-threatening, immediate treatment required
    URGENT = 2          # Serious condition, treatment within 24-48 hours
    HIGH = 3            # Significant symptoms, treatment within 1 week
    STANDARD = 4        # Non-urgent, scheduled treatment
    ROUTINE = 5         # Follow-up, routine check, flexible scheduling


PRIORITY_DESCRIPTIONS = {
    PriorityLevel.EMERGENCY: {
        "name": "Emergency",
        "description": "Life-threatening condition requiring immediate treatment",
        "max_wait_days": 0,
        "color": "#EF4444"  # Red
    },
    PriorityLevel.URGENT: {
        "name": "Urgent", 
        "description": "Serious condition requiring treatment within 24-48 hours",
        "max_wait_days": 2,
        "color": "#F97316"  # Orange
    },
    PriorityLevel.HIGH: {
        "name": "High Priority",
        "description": "Significant symptoms requiring treatment within 1 week",
        "max_wait_days": 7,
        "color": "#EAB308"  # Yellow
    },
    PriorityLevel.STANDARD: {
        "name": "Standard",
        "description": "Non-urgent scheduled treatment",
        "max_wait_days": 14,
        "color": "#3B82F6"  # Blue
    },
    PriorityLevel.ROUTINE: {
        "name": "Routine",
        "description": "Follow-up visits and routine checks",
        "max_wait_days": 30,
        "color": "#22C55E"  # Green
    }
}


class UserBase(BaseModel):
    """Base user model"""
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=100)
    role: UserRole
    is_active: bool = True


class UserCreate(UserBase):
    """Model for creating a new user"""
    password: str = Field(..., min_length=6, max_length=100)


class UserLogin(BaseModel):
    """Model for user login"""
    email: EmailStr
    password: str


class User(UserBase):
    """Full user model with ID"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.now)
    
    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    """User response model (without password)"""
    id: str
    email: EmailStr
    full_name: str
    role: UserRole
    is_active: bool
    created_at: datetime


class DoctorProfile(BaseModel):
    """Additional profile information for doctors"""
    user_id: str
    specialization: str = "Radiation Oncologist"
    license_number: str
    department: str = "Radiation Therapy"
    years_of_experience: int = 0


class PatientProfile(BaseModel):
    """Patient profile with priority information"""
    user_id: str
    patient_id: str = Field(default_factory=lambda: f"PT-{uuid.uuid4().hex[:8].upper()}")
    priority: PriorityLevel = PriorityLevel.STANDARD
    diagnosis: Optional[str] = None
    treatment_plan: Optional[str] = None
    assigned_doctor_id: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    last_visit: Optional[datetime] = None
    next_appointment: Optional[datetime] = None


class PatientCreate(BaseModel):
    """Model for creating a patient with user account"""
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=100)
    password: str = Field(..., min_length=6, max_length=100)
    priority: PriorityLevel = PriorityLevel.STANDARD
    diagnosis: Optional[str] = None
    treatment_plan: Optional[str] = None
    assigned_doctor_id: Optional[str] = None


class PatientResponse(BaseModel):
    """Patient response with full details"""
    user: UserResponse
    profile: PatientProfile
    priority_info: dict


class PriorityUpdate(BaseModel):
    """Model for updating patient priority"""
    new_priority: PriorityLevel
    reason: Optional[str] = None


class QueueEntry(BaseModel):
    """Queue entry for a patient"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    patient_id: str
    patient_name: str
    priority: PriorityLevel
    scheduled_time: datetime
    estimated_duration: int = 30  # minutes
    status: str = "waiting"  # waiting, in_progress, completed, cancelled, no_show
    assigned_doctor_id: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)


class QueueResponse(BaseModel):
    """Response model for queue with priority sorting"""
    entries: List[QueueEntry]
    total_count: int
    by_priority: dict
