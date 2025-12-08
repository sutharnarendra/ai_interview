from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import FileResponse
import os
import uuid
from pathlib import Path
from datetime import datetime

from app.config import settings
from app.models.resume import ResumeAnalysisResponse
from app.services.resume_parser import resume_parser
from app.services.ats_scorer import ats_scorer
from app.utils.firebase_admin import get_firestore_client

router = APIRouter()

# Ensure upload directory exists
UPLOAD_DIR = Path(settings.UPLOAD_DIR)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/upload-resume", response_model=ResumeAnalysisResponse)
async def upload_resume(
    file: UploadFile = File(...),
    userId: str = Form(...)
):
    """
    Upload and analyze resume
    
    Steps:
    1. Validate file
    2. Save to disk
    3. Parse resume (extract text, skills, etc.)
    4. Calculate ATS score
    5. Store metadata in Firestore
    6. Return analysis results
    """
    
    # Validate file type
    if not file.filename.endswith('.pdf'):
        raise HTTPException(400, "Only PDF files are allowed")
    
    # Validate file size
    file_content = await file.read()
    if len(file_content) > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(400, f"File too large. Maximum size: {settings.MAX_UPLOAD_SIZE / (1024*1024)}MB")
    
    # Generate unique ID and save file
    resume_id = str(uuid.uuid4())
    file_extension = file.filename.split('.')[-1]
    stored_filename = f"{resume_id}.{file_extension}"
    file_path = UPLOAD_DIR / stored_filename
    
    try:
        # Save file to disk
        with open(file_path, "wb") as buffer:
            buffer.write(file_content)
        
        # Parse resume
        print(f"📄 Parsing resume: {file.filename}")
        parsed_resume = resume_parser.parse_resume(str(file_path))
        
        # Calculate ATS score
        print(f"📊 Calculating ATS score...")
        ats_analysis = ats_scorer.calculate_ats_score(
            resume_text=parsed_resume.raw_text,
            resume_skills=parsed_resume.skills
        )
        
        # Prepare file URL
        file_url = f"/api/files/{resume_id}.pdf"
        
        # Store in Firestore
        db = get_firestore_client()
        if db:
            try:
                resume_data = {
                    'userId': userId,
                    'resumeId': resume_id,
                    'fileName': file.filename,
                    'fileUrl': file_url,
                    'fileSize': len(file_content),
                    'uploadedAt': datetime.utcnow(),
                    'status': 'analyzed',
                    
                    # Parsed data
                    'parsedData': {
                        'name': parsed_resume.name,
                        'email': parsed_resume.email,
                        'phone': parsed_resume.phone,
                        'education': parsed_resume.education
                    },
                    
                    # ATS analysis
                    'atsScore': ats_analysis['atsScore'],
                    'skills': parsed_resume.skills,
                    'matchedSkills': ats_analysis['matchedSkills'],
                    'missingSkills': ats_analysis['missingSkills'],
                    'totalSkillsDetected': len(parsed_resume.skills),
                    
                    # Full text (for interview context)
                    'parsedText': parsed_resume.raw_text[:5000]  # Store first 5000 chars
                }
                
                db.collection('resumes').document(resume_id).set(resume_data)
                print(f"✅ Resume data stored in Firestore")
            except Exception as e:
                print(f"⚠️  Warning: Could not store in Firestore: {e}")
        
        # Return response
        return ResumeAnalysisResponse(
            success=True,
            resumeId=resume_id,
            fileName=file.filename,
            fileUrl=file_url,
            fileSize=len(file_content),
            atsScore=ats_analysis['atsScore'],
            skills=parsed_resume.skills,
            missingSkills=ats_analysis['missingSkills'],
            matchedSkills=ats_analysis['matchedSkills'],
            parsedText=parsed_resume.raw_text[:1000],  # Return first 1000 chars
            analysis={
                'keywordMatchScore': ats_analysis['keywordMatchScore'],
                'semanticMatchScore': ats_analysis['semanticMatchScore'],
                'totalSkillsDetected': ats_analysis['totalSkillsDetected'],
                'name': parsed_resume.name,
                'email': parsed_resume.email,
                'education': parsed_resume.education
            },
            message="Resume analyzed successfully"
        )
        
    except Exception as e:
        # Clean up file if error occurs
        if file_path.exists():
            os.remove(file_path)
        raise HTTPException(500, f"Error processing resume: {str(e)}")

@router.get("/files/{resume_id}.pdf")
async def get_resume_file(resume_id: str):
    """Serve stored PDF file"""
    file_path = UPLOAD_DIR / f"{resume_id}.pdf"
    
    if not file_path.exists():
        raise HTTPException(404, "Resume not found")
    
    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=f"resume_{resume_id}.pdf"
    )

@router.delete("/files/{resume_id}.pdf")
async def delete_resume_file(resume_id: str):
    """Delete resume file"""
    file_path = UPLOAD_DIR / f"{resume_id}.pdf"
    
    if file_path.exists():
        os.remove(file_path)
        
        # Also delete from Firestore
        db = get_firestore_client()
        if db:
            try:
                db.collection('resumes').document(resume_id).delete()
            except Exception as e:
                print(f"Warning: Could not delete from Firestore: {e}")
        
        return {"success": True, "message": "Resume deleted"}
    
    raise HTTPException(404, "Resume not found")