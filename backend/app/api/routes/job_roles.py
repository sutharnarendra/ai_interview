from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from app.data.job_roles import get_all_job_roles, get_job_role, calculate_compatibility

router = APIRouter()

class CompatibilityRequest(BaseModel):
    resumeSkills: List[str]
    jobRoleId: str
    experienceYears: Optional[int] = 0

class CompatibilityResponse(BaseModel):
    score: int
    matchedRequired: List[str]
    missingRequired: List[str]
    matchedPreferred: List[str]
    missingPreferred: List[str]
    jobTitle: str
    recommendation: str

@router.get("/job-roles")
async def list_job_roles():
    """Get all available job roles"""
    roles = get_all_job_roles()
    
    # Format for frontend
    formatted_roles = []
    for role_id, role_data in roles.items():
        formatted_roles.append({
            'id': role_id,
            'title': role_data['title'],
            'description': role_data['description'],
            'requiredSkills': role_data['requiredSkills'],
            'preferredSkills': role_data['preferredSkills']
        })
    
    return {
        'success': True,
        'roles': formatted_roles
    }

@router.get("/job-roles/{role_id}")
async def get_job_role_details(role_id: str):
    """Get details of a specific job role"""
    role = get_job_role(role_id)
    
    if not role:
        raise HTTPException(404, f"Job role '{role_id}' not found")
    
    return {
        'success': True,
        'role': {
            'id': role_id,
            **role
        }
    }

@router.post("/job-roles/compatibility", response_model=CompatibilityResponse)
async def check_compatibility(request: CompatibilityRequest):
    """
    Calculate compatibility between resume and job role
    """
    compatibility = calculate_compatibility(
        resume_skills=request.resumeSkills,
        job_role_id=request.jobRoleId,
        experience_years=request.experienceYears
    )
    
    if not compatibility:
        raise HTTPException(404, f"Job role '{request.jobRoleId}' not found")
    
    job_role = get_job_role(request.jobRoleId)
    
    # Generate recommendation
    score = compatibility['score']
    if score >= 80:
        recommendation = "Excellent match! You have most required skills."
    elif score >= 60:
        recommendation = "Good match. Focus on missing skills during interview."
    elif score >= 40:
        recommendation = "Moderate match. Be prepared to discuss skill gaps."
    else:
        recommendation = "Low match. Consider upskilling before applying."
    
    return CompatibilityResponse(
        score=compatibility['score'],
        matchedRequired=compatibility['matchedRequired'],
        missingRequired=compatibility['missingRequired'],
        matchedPreferred=compatibility['matchedPreferred'],
        missingPreferred=compatibility['missingPreferred'],
        jobTitle=job_role['title'],
        recommendation=recommendation
    )