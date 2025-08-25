from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class ResumeFormat(str, Enum):
    TEXT = "text"
    PDF = "pdf"
    DOCX = "docx"

class JobRequirement(BaseModel):
    title: str = Field(..., description="Job title")
    description: str = Field(..., description="Job description")
    required_skills: List[str] = Field(..., description="Required skills")
    preferred_skills: Optional[List[str]] = Field(default=[], description="Preferred skills")
    experience_years: Optional[int] = Field(default=None, description="Required years of experience")
    education_level: Optional[str] = Field(default=None, description="Required education level")

class ResumeData(BaseModel):
    content: str = Field(..., description="Resume content (text extracted from file)")
    filename: str = Field(..., description="Original filename")
    format: ResumeFormat = Field(..., description="Resume format")

class FileUploadResponse(BaseModel):
    """Response model for file upload operations"""
    success: bool
    blob_name: Optional[str] = None
    blob_url: Optional[str] = None
    original_filename: Optional[str] = None
    size: Optional[int] = None
    uploaded_at: Optional[str] = None
    sas_url: Optional[str] = None
    error: Optional[str] = None

class ResumeStorageInfo(BaseModel):
    """Model for resume storage information"""
    blob_name: str
    original_filename: str
    content_type: Optional[str] = None
    size: int
    uploaded_at: str
    sas_url: Optional[str] = None

class ResumeRankingRequest(BaseModel):
    """Request model for resume ranking"""
    resumes: List[ResumeData]
    job_requirements: JobRequirement
    ranking_criteria: Optional[List[str]] = Field(
        default=["skills_match", "experience", "education", "overall_fit"],
        description="Criteria to use for ranking"
    )

class ResumeScreeningRequest(BaseModel):
    """Request model for resume screening"""
    resume: ResumeData
    job_requirements: JobRequirement
    screening_criteria: Optional[List[str]] = Field(
        default=["skills_match", "experience", "education", "red_flags"],
        description="Criteria to use for screening"
    )

class RankingScore(BaseModel):
    score: float = Field(..., description="Overall ranking score (0-100)")
    breakdown: Dict[str, float] = Field(..., description="Breakdown of scores by criteria")
    reasoning: str = Field(..., description="Explanation for the ranking")

class ResumeRankingResult(BaseModel):
    filename: str = Field(..., description="Resume filename")
    ranking: RankingScore = Field(..., description="Ranking details")
    rank: int = Field(..., description="Position in ranking (1-based)")

class ResumeRankingResponse(BaseModel):
    ranked_resumes: List[ResumeRankingResult] = Field(..., description="Ranked list of resumes")
    total_resumes: int = Field(..., description="Total number of resumes processed")
    processing_time: float = Field(..., description="Processing time in seconds")

class ScreeningResult(BaseModel):
    passed: bool = Field(..., description="Whether the resume passed screening")
    score: float = Field(..., description="Overall screening score (0-100)")
    breakdown: Dict[str, Any] = Field(..., description="Detailed breakdown of screening results")
    recommendations: List[str] = Field(..., description="Recommendations for the candidate")
    red_flags: List[str] = Field(..., description="Any red flags found")
    strengths: List[str] = Field(..., description="Candidate strengths")

class ResumeScreeningResponse(BaseModel):
    result: ScreeningResult = Field(..., description="Screening results")
    processing_time: float = Field(..., description="Processing time in seconds")

class ErrorResponse(BaseModel):
    error: str = Field(..., description="Error message")
    details: Optional[str] = Field(default=None, description="Additional error details")
