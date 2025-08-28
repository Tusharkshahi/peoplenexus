import time
from typing import Dict, Any
from models import ResumeScreeningRequest, ResumeScreeningResponse, ScreeningResult
from ai_client import AzureOpenAIClient

class ResumeScreener:
    def __init__(self, ai_client: AzureOpenAIClient = None):
        self.ai_client = ai_client or AzureOpenAIClient()

    async def screen_resume(self, resume, job_requirements) -> ResumeScreeningResponse:
        """
        Screen a single resume for pass/fail decision
        """
        start_time = time.time()
        
        try:
            # Convert job requirements to dict for AI client
            job_req_dict = job_requirements.dict() if hasattr(job_requirements, 'dict') else job_requirements
            
            # Screen the resume using AI
            screening_result = await self.ai_client.screen_resume(
                resume.content,
                job_req_dict,
                ["skills_match", "experience", "education", "red_flags"]
            )
            
            # Apply reasonable pass/fail logic as a fallback
            # If AI was too strict, override based on reasonable criteria
            overall_score = screening_result.get("overall_score", 0)
            has_critical_red_flags = screening_result.get("breakdown", {}).get("red_flags", {}).get("found", False)
            
            # Override passed flag if the AI was too conservative
            if overall_score >= 60 and not has_critical_red_flags:
                screening_result["passed"] = True
            elif overall_score < 50 or has_critical_red_flags:
                screening_result["passed"] = False
            # For scores between 50-60, keep AI's decision
            
            # Create screening result object
            result = ScreeningResult(
                passed=screening_result["passed"],
                score=screening_result["overall_score"],
                breakdown=screening_result["breakdown"],
                recommendations=screening_result.get("recommendations", []),
                red_flags=screening_result.get("red_flags", []),
                strengths=screening_result.get("strengths", [])
            )
            
            processing_time = time.time() - start_time
            
            return ResumeScreeningResponse(
                result=result,
                processing_time=processing_time
            )
            
        except Exception as e:
            raise Exception(f"Error screening resume: {str(e)}")

    def _validate_request(self, request: ResumeScreeningRequest) -> None:
        """
        Validate the screening request
        """
        if not request.resume.content.strip():
            raise ValueError("Resume content cannot be empty")
        
        if not request.job_requirements.required_skills:
            raise ValueError("At least one required skill must be specified")
        
        if not request.job_requirements.title:
            raise ValueError("Job title is required")
        
        if not request.job_requirements.description:
            raise ValueError("Job description is required")

    def _format_breakdown(self, breakdown: Dict[str, Any]) -> Dict[str, Any]:
        """
        Format the breakdown data for consistent output
        """
        formatted = {}
        
        for key, value in breakdown.items():
            if isinstance(value, dict):
                formatted[key] = {
                    "score": value.get("score", 0.0),
                    "details": value
                }
            else:
                formatted[key] = value
        
        return formatted
