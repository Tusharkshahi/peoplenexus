import asyncio
import time
from typing import List, Dict, Any
from models import ResumeRankingRequest, ResumeRankingResponse, ResumeRankingResult, RankingScore
from ai_client import AzureOpenAIClient

class ResumeRanker:
    def __init__(self, ai_client: AzureOpenAIClient = None):
        self.ai_client = ai_client or AzureOpenAIClient()

    async def rank_resumes(self, resumes: List, job_requirements) -> ResumeRankingResponse:
        """
        Rank multiple resumes based on job requirements
        """
        start_time = time.time()
        
        try:
            # Convert job requirements to dict for AI client
            job_req_dict = job_requirements.dict() if hasattr(job_requirements, 'dict') else job_requirements
            
            # Analyze each resume
            async def analyze(filename: str, content: str):
                try:
                    res = await self._analyze_single_resume(content, job_req_dict, ["skills_match", "experience", "education", "overall_fit"])
                    return filename, res, None
                except Exception as e:
                    return filename, None, str(e)

            tasks = [analyze(r.filename, r.content) for r in resumes]
            gathered = await asyncio.gather(*tasks, return_exceptions=False)

            results = []
            for filename, result, error in gathered:
                if error is None and result is not None:
                    results.append((filename, result))
                else:
                    results.append((filename, {
                        "overall_score": 0.0,
                        "breakdown": {
                            "skills_match": 0.0,
                            "experience": 0.0,
                            "education": 0.0,
                            "overall_fit": 0.0
                        },
                        "reasoning": f"Analysis failed: {error}"
                    }))
            
            # Sort results by overall score (descending)
            results.sort(key=lambda x: x[1]["overall_score"], reverse=True)
            
            # Create ranking results
            ranked_resumes = []
            for rank, (filename, analysis) in enumerate(results, 1):
                ranking_score = RankingScore(
                    score=analysis["overall_score"],
                    breakdown=analysis["breakdown"],
                    reasoning=analysis["reasoning"]
                )
                
                ranked_result = ResumeRankingResult(
                    filename=filename,
                    ranking=ranking_score,
                    rank=rank
                )
                ranked_resumes.append(ranked_result)
            
            processing_time = time.time() - start_time
            
            return ResumeRankingResponse(
                ranked_resumes=ranked_resumes,
                total_resumes=len(resumes),
                processing_time=processing_time
            )
            
        except Exception as e:
            raise Exception(f"Error ranking resumes: {str(e)}")

    async def _analyze_single_resume(self, content: str, job_requirements: Dict[str, Any], criteria: List[str]) -> Dict[str, Any]:
        """
        Analyze a single resume using the AI client
        """
        return await self.ai_client.analyze_resume_for_ranking(content, job_requirements, criteria)

    def _validate_request(self, request: ResumeRankingRequest) -> None:
        """
        Validate the ranking request
        """
        if not request.resumes:
            raise ValueError("At least one resume must be provided")
        
        if len(request.resumes) > 50:
            raise ValueError("Maximum 50 resumes can be ranked at once")
        
        if not request.job_requirements.required_skills:
            raise ValueError("At least one required skill must be specified")
        
        for resume in request.resumes:
            if not resume.content.strip():
                raise ValueError(f"Resume {resume.filename} has empty content")
