"""
In-Memory Database for Users and Patients
In production, replace with actual database (PostgreSQL, MongoDB, etc.)
"""

from typing import Dict, List, Optional
from datetime import datetime
import hashlib
import secrets
from app.models.user import (
    User, UserRole, UserCreate, PatientProfile, DoctorProfile,
    PriorityLevel, QueueEntry, PRIORITY_DESCRIPTIONS
)


def hash_password(password: str) -> str:
    """Simple password hashing (use bcrypt in production)"""
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash"""
    return hash_password(password) == hashed


class Database:
    """In-memory database for demo purposes"""
    
    def __init__(self):
        self.users: Dict[str, dict] = {}
        self.patient_profiles: Dict[str, PatientProfile] = {}
        self.doctor_profiles: Dict[str, DoctorProfile] = {}
        self.queue_entries: Dict[str, QueueEntry] = {}
        self.tokens: Dict[str, str] = {}  # token -> user_id
        
        # Initialize with default users
        self._create_default_users()
    
    def _create_default_users(self):
        """Create default admin, doctors, and sample patients"""
        
        # Admin user
        admin = self.create_user(UserCreate(
            email="admin@truebeam.hospital",
            full_name="System Administrator",
            role=UserRole.ADMIN,
            password="admin123"
        ))
        
        # Doctors
        doctors_data = [
            {"email": "dr.smith@truebeam.hospital", "name": "Dr. Sarah Smith", "license": "MD-12345", "spec": "Radiation Oncology"},
            {"email": "dr.johnson@truebeam.hospital", "name": "Dr. Michael Johnson", "license": "MD-23456", "spec": "Medical Physics"},
            {"email": "dr.williams@truebeam.hospital", "name": "Dr. Emily Williams", "license": "MD-34567", "spec": "Radiation Therapy"},
        ]
        
        for doc in doctors_data:
            user = self.create_user(UserCreate(
                email=doc["email"],
                full_name=doc["name"],
                role=UserRole.DOCTOR,
                password="doctor123"
            ))
            self.doctor_profiles[user["id"]] = DoctorProfile(
                user_id=user["id"],
                specialization=doc["spec"],
                license_number=doc["license"],
                years_of_experience=10
            )
        
        # Sample patients with different priorities
        patients_data = [
            {"email": "patient1@email.com", "name": "John Anderson", "priority": PriorityLevel.EMERGENCY, "diagnosis": "Acute radiation toxicity"},
            {"email": "patient2@email.com", "name": "Maria Garcia", "priority": PriorityLevel.URGENT, "diagnosis": "Brain metastases"},
            {"email": "patient3@email.com", "name": "Robert Chen", "priority": PriorityLevel.HIGH, "diagnosis": "Lung cancer Stage III"},
            {"email": "patient4@email.com", "name": "Lisa Thompson", "priority": PriorityLevel.STANDARD, "diagnosis": "Breast cancer - adjuvant therapy"},
            {"email": "patient5@email.com", "name": "James Wilson", "priority": PriorityLevel.ROUTINE, "diagnosis": "Follow-up scan"},
            {"email": "patient6@email.com", "name": "Emma Davis", "priority": PriorityLevel.URGENT, "diagnosis": "Spinal cord compression"},
            {"email": "patient7@email.com", "name": "David Brown", "priority": PriorityLevel.HIGH, "diagnosis": "Prostate cancer"},
            {"email": "patient8@email.com", "name": "Sarah Miller", "priority": PriorityLevel.STANDARD, "diagnosis": "Head and neck cancer"},
            {"email": "patient9@email.com", "name": "Michael Lee", "priority": PriorityLevel.ROUTINE, "diagnosis": "Post-treatment follow-up"},
            {"email": "patient10@email.com", "name": "Jennifer Taylor", "priority": PriorityLevel.EMERGENCY, "diagnosis": "Superior vena cava syndrome"},
        ]
        
        doctor_ids = list(self.doctor_profiles.keys())
        
        for i, patient in enumerate(patients_data):
            user = self.create_user(UserCreate(
                email=patient["email"],
                full_name=patient["name"],
                role=UserRole.PATIENT,
                password="patient123"
            ))
            self.patient_profiles[user["id"]] = PatientProfile(
                user_id=user["id"],
                priority=patient["priority"],
                diagnosis=patient["diagnosis"],
                treatment_plan=f"Standard {PRIORITY_DESCRIPTIONS[patient['priority']]['name']} Protocol",
                assigned_doctor_id=doctor_ids[i % len(doctor_ids)]
            )
    
    def create_user(self, user_data: UserCreate) -> dict:
        """Create a new user"""
        user_id = str(len(self.users) + 1).zfill(4)
        
        user = {
            "id": user_id,
            "email": user_data.email,
            "full_name": user_data.full_name,
            "role": user_data.role,
            "password_hash": hash_password(user_data.password),
            "is_active": True,
            "created_at": datetime.now().isoformat()
        }
        
        self.users[user_id] = user
        return user
    
    def authenticate_user(self, email: str, password: str) -> Optional[dict]:
        """Authenticate user by email and password"""
        for user_id, user in self.users.items():
            if user["email"] == email and verify_password(password, user["password_hash"]):
                return user
        return None
    
    def create_token(self, user_id: str) -> str:
        """Create authentication token"""
        token = secrets.token_urlsafe(32)
        self.tokens[token] = user_id
        return token
    
    def get_user_by_token(self, token: str) -> Optional[dict]:
        """Get user by authentication token"""
        user_id = self.tokens.get(token)
        if user_id:
            return self.users.get(user_id)
        return None
    
    def get_user_by_id(self, user_id: str) -> Optional[dict]:
        """Get user by ID"""
        return self.users.get(user_id)
    
    def get_user_by_email(self, email: str) -> Optional[dict]:
        """Get user by email"""
        for user in self.users.values():
            if user["email"] == email:
                return user
        return None
    
    def get_all_users(self, role: Optional[UserRole] = None) -> List[dict]:
        """Get all users, optionally filtered by role"""
        users = list(self.users.values())
        if role:
            users = [u for u in users if u["role"] == role]
        return users
    
    def get_patient_profile(self, user_id: str) -> Optional[PatientProfile]:
        """Get patient profile"""
        return self.patient_profiles.get(user_id)
    
    def get_doctor_profile(self, user_id: str) -> Optional[DoctorProfile]:
        """Get doctor profile"""
        return self.doctor_profiles.get(user_id)
    
    def update_patient_priority(self, user_id: str, new_priority: PriorityLevel) -> Optional[PatientProfile]:
        """Update patient priority"""
        profile = self.patient_profiles.get(user_id)
        if profile:
            profile.priority = new_priority
            return profile
        return None
    
    def get_patients_by_priority(self) -> Dict[PriorityLevel, List[dict]]:
        """Get patients grouped by priority"""
        result = {p: [] for p in PriorityLevel}
        
        for user_id, profile in self.patient_profiles.items():
            user = self.users.get(user_id)
            if user:
                result[profile.priority].append({
                    "user": user,
                    "profile": profile,
                    "priority_info": PRIORITY_DESCRIPTIONS[profile.priority]
                })
        
        return result
    
    def get_queue_stats(self) -> dict:
        """Get queue statistics by priority"""
        stats = {
            "total_patients": len(self.patient_profiles),
            "by_priority": {}
        }
        
        for priority in PriorityLevel:
            count = sum(1 for p in self.patient_profiles.values() if p.priority == priority)
            stats["by_priority"][priority.value] = {
                "count": count,
                "name": PRIORITY_DESCRIPTIONS[priority]["name"],
                "color": PRIORITY_DESCRIPTIONS[priority]["color"]
            }
        
        return stats


# Global database instance
db = Database()
