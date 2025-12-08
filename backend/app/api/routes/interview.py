from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime
import uuid

from app.utils.firebase_admin import get_firestore_client
from app.data.job_roles import get_job_role

router = APIRouter()

class StartInterviewRequest(BaseModel):
    userId: str
    resumeId: str
    jobRole: str
    jobRoleId: str
    experienceLevel: str
    compatibility: Dict

class InterviewSession(BaseModel):
    interviewId: str
    userId: str
    resumeId: str
    jobRole: str
    status: str
    startTime: datetime

@router.post("/interview/start")
async def start_interview(request: StartInterviewRequest):
    """
    Initialize a new interview session
    """
    try:
        # Generate unique interview ID
        interview_id = str(uuid.uuid4())
        
        # Get job role details
        job_role_data = get_job_role(request.jobRoleId)
        
        # Create interview session data
        interview_data = {
            'interviewId': interview_id,
            'userId': request.userId,
            'resumeId': request.resumeId,
            'jobRole': request.jobRole,
            'jobRoleId': request.jobRoleId,
            'experienceLevel': request.experienceLevel,
            'compatibility': request.compatibility,
            'status': 'initialized',
            'startTime': datetime.utcnow(),
            'endTime': None,
            'currentRound': 'hr',
            'rounds': {
                'hr': {'status': 'pending', 'duration': 300},  # 5 minutes
                'technical': {'status': 'pending', 'duration': 600},  # 10 minutes
                'aptitude': {'status': 'pending', 'duration': 300}  # 5 minutes
            },
            'transcript': [],
            'behavioralData': [],
            'scores': {}
        }
        
        # Store in Firestore
        db = get_firestore_client()
        if db:
            db.collection('interviews').document(interview_id).set(interview_data)
        
        return {
            'success': True,
            'interviewId': interview_id,
            'roomName': f'interview_{interview_id}',
            'message': 'Interview session initialized'
        }
        
    except Exception as e:
        raise HTTPException(500, f"Error starting interview: {str(e)}")

@router.get("/interview/{interview_id}")
async def get_interview(interview_id: str):
    """
    Get interview session details
    """
    try:
        db = get_firestore_client()
        if not db:
            raise HTTPException(500, "Database not available")
        
        doc = db.collection('interviews').document(interview_id).get()
        
        if not doc.exists:
            raise HTTPException(404, "Interview not found")
        
        return {
            'success': True,
            'interview': doc.to_dict()
        }
        
    except Exception as e:
        raise HTTPException(500, f"Error fetching interview: {str(e)}")

@router.post("/interview/{interview_id}/transcript")
async def add_transcript_entry(interview_id: str, entry: dict):
    """
    Add a transcript entry to the interview
    """
    try:
        db = get_firestore_client()
        if not db:
            return {'success': False, 'message': 'Database not available'}
        
        # Add timestamp if not present
        if 'timestamp' not in entry:
            entry['timestamp'] = datetime.utcnow()
        
        # Update Firestore
        db.collection('interviews').document(interview_id).update({
            'transcript': firestore.ArrayUnion([entry])
        })
        
        return {'success': True}
        
    except Exception as e:
        return {'success': False, 'message': str(e)}

@router.post("/interview/{interview_id}/end")
async def end_interview(interview_id: str):
    """
    End an interview session and calculate final scores
    """
    try:
        db = get_firestore_client()
        if not db:
            raise HTTPException(500, "Database not available")
        
        # Get interview data
        doc = db.collection('interviews').document(interview_id).get()
        if not doc.exists:
            raise HTTPException(404, "Interview not found")
        
        interview_data = doc.to_dict()
        
        # Calculate scores (placeholder - will be enhanced)
        scores = {
            'overall': 75,  # Will be calculated based on actual performance
            'rounds': {
                'hr': {'score': 80, 'feedback': 'Good communication skills'},
                'technical': {'score': 70, 'feedback': 'Solid technical knowledge'},
                'aptitude': {'score': 75, 'feedback': 'Good problem-solving'}
            },
            'behavioral': {
                'confidence': 78,
                'focus': 72,
                'communication': 85
            }
        }
        
        # Update interview
        db.collection('interviews').document(interview_id).update({
            'status': 'completed',
            'endTime': datetime.utcnow(),
            'scores': scores
        })
        
        return {
            'success': True,
            'scores': scores,
            'message': 'Interview completed'
        }
        
    except Exception as e:
        raise HTTPException(500, f"Error ending interview: {str(e)}")