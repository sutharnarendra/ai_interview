from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ResumeUploadResponse(BaseModel):
    """Response model for resume upload"""
    success: bool
    resumeId: str
    fileName: str
    fileUrl: str
    fileSize: int
    message: str = "Resume uploaded successfully"

class ATSAnalysisResult(BaseModel):
    """ATS analysis results"""
    atsScore: float = Field(..., ge=0, le=100, description="ATS score (0-100)")
    skills: List[str] = Field(default_factory=list, description="Detected skills")
    missingSkills: List[str] = Field(default_factory=list, description="Missing required skills")
    matchedSkills: List[str] = Field(default_factory=list, description="Matched skills")
    totalSkills: int = Field(default=0, description="Total skills detected")
    experienceYears: Optional[int] = Field(None, description="Years of experience")
    education: List[str] = Field(default_factory=list, description="Education qualifications")
    
class ResumeAnalysisResponse(BaseModel):
    """Complete resume analysis response"""
    success: bool
    resumeId: str
    fileName: str
    fileUrl: str
    fileSize: int
    atsScore: float
    skills: List[str]
    missingSkills: List[str]
    matchedSkills: List[str]
    parsedText: str
    analysis: dict
    message: str = "Resume analyzed successfully"

class ParsedResume(BaseModel):
    """Parsed resume data"""
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    experience: List[dict] = Field(default_factory=list)
    education: List[str] = Field(default_factory=list)
    raw_text: str = ""