"""
TrueBeam Smart Queue Management System
FastAPI Application Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import routes
from app.routes.simulation import router as simulation_router
from app.routes.users import router as users_router

# Create FastAPI app
app = FastAPI(
    title="TrueBeam Queue Management API",
    description="Monte Carlo simulation engine for radiation therapy queue optimization",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "https://cancer-queue.vercel.app",
    "https://*.vercel.app",
    os.getenv("FRONTEND_URL", "http://localhost:3000")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(simulation_router)
app.include_router(users_router)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "TrueBeam Smart Queue Management System",
        "api": "/docs for API documentation",
        "health": "/api/health for health check"
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("API_PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False
    )
