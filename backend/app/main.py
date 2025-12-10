from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import os

from app.api.routes import resume, interview, livekit_routes, behavioral, job_roles, voice
from app.config import settings

# Create FastAPI app
app = FastAPI(
    title="AI Interview System API",
    description="Backend API for AI-powered interview system",
    version="1.0.0"
)

# CORS Configuration - Allow frontend to make requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js dev server
        "http://127.0.0.1:3000",
        "http://localhost:3001",  # Alternative Next.js port
        "http://127.0.0.1:3001",
        settings.FRONTEND_URL if hasattr(settings, 'FRONTEND_URL') else "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads/resumes")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Mount static files (for serving uploaded resumes)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include API routes
app.include_router(resume.router, prefix="/api", tags=["Resume"])
app.include_router(interview.router, prefix="/api", tags=["Interview"])
app.include_router(livekit_routes.router, prefix="/api", tags=["LiveKit"])
app.include_router(behavioral.router, prefix="/api", tags=["Behavioral"])
app.include_router(job_roles.router, prefix="/api", tags=["Job Roles"])
app.include_router(voice.router, prefix="/api", tags=["Voice"])

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "running",
        "message": "AI Interview System API",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "services": {
            "api": "running",
            "firebase": "connected" if settings.FIREBASE_CREDENTIALS_PATH else "not configured",
            "groq": "configured" if settings.GROQ_API_KEY else "not configured",
            "deepgram": "configured" if settings.DEEPGRAM_API_KEY else "not configured"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )