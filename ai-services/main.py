from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
from typing import List, Optional
import json

from config import settings
from models import (
    ResumeRankingRequest, ResumeScreeningRequest, ResumeRankingResponse, 
    ResumeScreeningResponse, ErrorResponse, FileUploadResponse, ResumeStorageInfo
)
from resume_ranker import ResumeRanker
from resume_screener import ResumeScreener
from storage_client import AzureBlobStorageClient
from ai_client import AzureOpenAIClient

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="PeopleNexus AI Services",
    description="AI-powered resume ranking and screening services for PeopleNexus HR platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
try:
    ai_client = AzureOpenAIClient()
    resume_ranker = ResumeRanker(ai_client)
    resume_screener = ResumeScreener(ai_client)
    storage_client = AzureBlobStorageClient()
    logger.info("All services initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize services: {e}")
    raise

# Job templates
JOB_TEMPLATES = {
    "software_engineer": {
        "title": "Software Engineer",
        "description": "Develop and maintain software applications using modern technologies",
        "required_skills": ["JavaScript", "Python", "React", "Node.js", "Git"],
        "preferred_skills": ["TypeScript", "AWS", "Docker", "Kubernetes", "MongoDB"],
        "experience_years": 3,
        "education_level": "Bachelor's Degree",
    },
    "data_scientist": {
        "title": "Data Scientist",
        "description": "Analyze complex data sets to help organizations make better decisions",
        "required_skills": ["Python", "SQL", "Machine Learning", "Statistics", "Pandas"],
        "preferred_skills": ["TensorFlow", "PyTorch", "AWS", "Spark", "Tableau"],
        "experience_years": 2,
        "education_level": "Master's Degree",
    },
    "product_manager": {
        "title": "Product Manager",
        "description": "Lead product development and strategy for software products",
        "required_skills": ["Product Strategy", "Agile", "User Research", "Data Analysis", "Stakeholder Management"],
        "preferred_skills": ["SQL", "A/B Testing", "Design Thinking", "Technical Background"],
        "experience_years": 4,
        "education_level": "Bachelor's Degree",
    },
    "hr_specialist": {
        "title": "HR Specialist",
        "description": "Manage human resources functions including recruitment, employee relations, and compliance",
        "required_skills": ["Recruitment", "Employee Relations", "HR Policies", "Compliance", "Communication"],
        "preferred_skills": ["HRIS", "Benefits Administration", "Training", "Performance Management"],
        "experience_years": 3,
        "education_level": "Bachelor's Degree",
    },
}

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "PeopleNexus AI Services API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "resume_ranking": "/api/v1/resume/rank",
            "resume_screening": "/api/v1/resume/screen",
            "file_upload": "/api/v1/resume/upload",
            "job_templates": "/api/v1/job-templates"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        azure_health = ai_client.connectivity_check()
        storage_health = storage_client.health_check()
        
        return {
            "status": "healthy",
            "services": {
                "azure_openai": azure_health,
                "azure_storage": storage_health
            },
            "timestamp": "2024-01-01T00:00:00Z"
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/resume/upload", response_model=FileUploadResponse)
async def upload_resume(file: UploadFile = File(...)):
    """
    Upload a resume file to Azure Blob Storage
    
    Supported formats: PDF, DOCX, TXT
    Max file size: 10MB
    """
    try:
        # Validate file type
        allowed_types = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"]
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file type. Allowed types: {', '.join(allowed_types)}"
            )
        
        # Validate file size (10MB limit)
        max_size = 10 * 1024 * 1024  # 10MB
        file_content = await file.read()
        if len(file_content) > max_size:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size is 10MB. Current size: {len(file_content)} bytes"
            )
        
        # Upload to Azure Blob Storage
        upload_result = storage_client.upload_resume(
            file_content=file_content,
            original_filename=file.filename,
            content_type=file.content_type
        )
        
        return FileUploadResponse(
            success=True,
            blob_name=upload_result["blob_name"],
            blob_url=upload_result["blob_url"],
            original_filename=upload_result["original_filename"],
            size=upload_result["size"],
            uploaded_at=upload_result["uploaded_at"],
            sas_url=upload_result["sas_url"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to upload resume: {e}")
        return FileUploadResponse(
            success=False,
            error=str(e)
        )

@app.get("/api/v1/resume/list", response_model=List[ResumeStorageInfo])
async def list_resumes():
    """List all uploaded resumes"""
    try:
        blobs = storage_client.list_resumes()
        return [
            ResumeStorageInfo(
                blob_name=blob["name"],
                original_filename=blob["name"].split("/")[-1],  # Extract filename from blob name
                content_type=blob["content_type"],
                size=blob["size"],
                uploaded_at=blob["created"] or "2024-01-01T00:00:00Z"
            )
            for blob in blobs
        ]
    except Exception as e:
        logger.error(f"Failed to list resumes: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/v1/resume/{blob_name}")
async def delete_resume(blob_name: str):
    """Delete a resume file from Azure Blob Storage"""
    try:
        success = storage_client.delete_resume(blob_name)
        if success:
            return {"message": f"Resume {blob_name} deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail=f"Resume {blob_name} not found")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete resume {blob_name}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/job-templates")
async def get_job_templates():
    """Get available job templates"""
    return {"templates": JOB_TEMPLATES}

@app.post("/api/v1/resume/rank", response_model=ResumeRankingResponse)
async def rank_resumes(request: ResumeRankingRequest):
    """Rank multiple resumes based on job requirements"""
    try:
        result = await resume_ranker.rank_resumes(request.resumes, request.job_requirements)
        return result
    except Exception as e:
        logger.error(f"Resume ranking failed: {e}")
        msg = str(e)
        if "429" in msg or "Too Many Requests" in msg:
            raise HTTPException(status_code=429, detail="Upstream rate limit from Azure OpenAI. Please retry shortly.")
        if "TimeoutError" in msg or "timed out" in msg:
            raise HTTPException(status_code=504, detail="AI request timed out. Please try again.")
        raise HTTPException(status_code=500, detail=msg)

@app.post("/api/v1/resume/screen", response_model=ResumeScreeningResponse)
async def screen_resume(request: ResumeScreeningRequest):
    """Screen a single resume based on job requirements"""
    try:
        result = await resume_screener.screen_resume(request.resume, request.job_requirements)
        return result
    except Exception as e:
        logger.error(f"Resume screening failed: {e}")
        msg = str(e)
        if "429" in msg or "Too Many Requests" in msg:
            raise HTTPException(status_code=429, detail="Upstream rate limit from Azure OpenAI. Please retry shortly.")
        if "TimeoutError" in msg or "timed out" in msg:
            raise HTTPException(status_code=504, detail="AI request timed out. Please try again.")
        raise HTTPException(status_code=500, detail=msg)

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.host, port=settings.port)
