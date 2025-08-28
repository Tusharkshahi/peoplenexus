import openai
from openai import AzureOpenAI
import time
from typing import List, Dict, Any
from config import settings
import asyncio
import random
import json

class AzureOpenAIClient:
    def __init__(self):
        self._validate_config()
        self.client = AzureOpenAI(
            api_key=settings.azure_openai_api_key,
            api_version=settings.azure_openai_api_version,
            azure_endpoint=settings.azure_openai_endpoint
        )
        self.deployment_name = settings.azure_openai_deployment_name
        # concurrency limiter
        self._semaphore = asyncio.Semaphore(settings.ai_max_concurrency)

    def _validate_config(self) -> None:
        missing = []
        if not settings.azure_openai_api_key:
            missing.append("AZURE_OPENAI_API_KEY")
        if not settings.azure_openai_endpoint:
            missing.append("AZURE_OPENAI_ENDPOINT")
        if not settings.azure_openai_deployment_name:
            missing.append("AZURE_OPENAI_DEPLOYMENT_NAME")
        if missing:
            raise ValueError(
                f"Missing Azure OpenAI configuration values: {', '.join(missing)}. "
                "Please set them in your .env file."
            )

    async def analyze_resume_for_ranking(self, resume_content: str, job_requirements: Dict[str, Any], criteria: List[str]) -> Dict[str, Any]:
        """
        Analyze a single resume for ranking purposes
        """
        prompt = self._create_ranking_prompt(resume_content, job_requirements, criteria)
        
        try:
            response = await self._with_retries(lambda: self.client.chat.completions.create(
                model=self.deployment_name,
                messages=[
                    {"role": "system", "content": "You are an expert HR recruiter and resume analyst. Analyze resumes objectively and provide detailed scoring."},
                    {"role": "user", "content": prompt}
                ]
            ))
            
            result = response.choices[0].message.content
            return self._parse_ranking_response(result)
            
        except Exception as e:
            raise Exception(f"Azure OpenAI ranking request failed: {str(e)}")

    async def screen_resume(self, resume_content: str, job_requirements: Dict[str, Any], criteria: List[str]) -> Dict[str, Any]:
        """
        Screen a single resume for pass/fail decision
        """
        prompt = self._create_screening_prompt(resume_content, job_requirements, criteria)
        
        try:
            response = await self._with_retries(lambda: self.client.chat.completions.create(
                model=self.deployment_name,
                messages=[
                    {"role": "system", "content": "You are an expert HR recruiter conducting initial resume screening. Be thorough but fair in your assessment."},
                    {"role": "user", "content": prompt}
                ]
            ))
            
            result = response.choices[0].message.content
            return self._parse_screening_response(result)
            
        except Exception as e:
            raise Exception(f"Azure OpenAI screening request failed: {str(e)}")

    def connectivity_check(self) -> Dict[str, Any]:
        """Perform a lightweight connectivity check to Azure OpenAI."""
        try:
            resp = self.client.chat.completions.create(
                model=self.deployment_name,
                messages=[
                    {"role": "system", "content": "You are a healthy system checker."},
                    {"role": "user", "content": "Reply with OK"}
                ]
            )
            content = resp.choices[0].message.content.strip()
            return {
                "ok": True,
                "reply": content
            }
        except Exception as e:
            return {
                "ok": False,
                "error": str(e)
            }

    def _create_ranking_prompt(self, resume_content: str, job_requirements: Dict[str, Any], criteria: List[str]) -> str:
        # Provide safe defaults for missing fields
        title = job_requirements.get('title', 'Position')
        description = job_requirements.get('description', 'No description provided')
        required_skills = job_requirements.get('required_skills', [])
        preferred_skills = job_requirements.get('preferred_skills', [])
        experience_years = job_requirements.get('experience_years', 'Not specified')
        education_level = job_requirements.get('education_level', 'Not specified')
        
        # Convert skills to strings if they're lists
        required_skills_str = ', '.join(required_skills) if required_skills else 'None specified'
        preferred_skills_str = ', '.join(preferred_skills) if preferred_skills else 'None specified'
        
        return f"""
Please analyze the following resume for ranking purposes based on the job requirements.

JOB REQUIREMENTS:
Title: {title}
Description: {description}
Required Skills: {required_skills_str}
Preferred Skills: {preferred_skills_str}
Experience Required: {experience_years} years
Education Level: {education_level}

RESUME CONTENT:
{resume_content}

RANKING CRITERIA: {', '.join(criteria)}

Please provide a detailed analysis in the following JSON format:
{{
    "overall_score": <float between 0-100>,
    "breakdown": {{
        "skills_match": <float between 0-100>,
        "experience": <float between 0-100>,
        "education": <float between 0-100>,
        "overall_fit": <float between 0-100>
    }},
    "reasoning": "<detailed explanation of the ranking>"
}}

Focus on:
1. Skills match with required and preferred skills
2. Relevant experience and years of experience
3. Education level and relevance
4. Overall fit for the position
"""

    def _create_screening_prompt(self, resume_content: str, job_requirements: Dict[str, Any], criteria: List[str]) -> str:
        # Provide safe defaults for missing fields
        title = job_requirements.get('title', 'Position')
        description = job_requirements.get('description', 'No description provided')
        required_skills = job_requirements.get('required_skills', [])
        preferred_skills = job_requirements.get('preferred_skills', [])
        experience_years = job_requirements.get('experience_years', 'Not specified')
        education_level = job_requirements.get('education_level', 'Not specified')
        
        # Convert skills to strings if they're lists
        required_skills_str = ', '.join(required_skills) if required_skills else 'None specified'
        preferred_skills_str = ', '.join(preferred_skills) if preferred_skills else 'None specified'
        
        return f"""
Please screen the following resume for the job position and provide a pass/fail decision with detailed analysis.

JOB REQUIREMENTS:
Title: {title}
Description: {description}
Required Skills: {required_skills_str}
Preferred Skills: {preferred_skills_str}
Experience Required: {experience_years} years
Education Level: {education_level}

RESUME CONTENT:
{resume_content}

SCREENING CRITERIA: {', '.join(criteria)}

Please provide a detailed screening analysis in the following JSON format:
{{
    "passed": <boolean>,
    "overall_score": <float between 0-100>,
    "breakdown": {{
        "skills_match": {{
            "score": <float between 0-100>,
            "matched_skills": ["skill1", "skill2"],
            "missing_skills": ["skill1", "skill2"]
        }},
        "experience": {{
            "score": <float between 0-100>,
            "years_found": <int>,
            "relevance": "<high/medium/low>"
        }},
        "education": {{
            "score": <float between 0-100>,
            "level": "<degree level>",
            "relevance": "<high/medium/low>"
        }},
        "red_flags": {{
            "found": <boolean>,
            "issues": ["issue1", "issue2"]
        }}
    }},
    "recommendations": ["recommendation1", "recommendation2"],
    "red_flags": ["flag1", "flag2"],
    "strengths": ["strength1", "strength2"]
}}

Focus on:
1. Whether the candidate meets minimum requirements
2. Skills gap analysis
3. Experience relevance and duration
4. Education requirements
5. Any red flags or concerns
6. Candidate strengths
"""

    def _parse_ranking_response(self, response: str) -> Dict[str, Any]:
        try:
            # Extract JSON from response
            start_idx = response.find('{')
            end_idx = response.rfind('}') + 1
            json_str = response[start_idx:end_idx]
            
            data = json.loads(json_str)
            return data
        except Exception as e:
            raise Exception(f"Error parsing ranking response: {str(e)}")

    def _parse_screening_response(self, response: str) -> Dict[str, Any]:
        try:
            # Extract JSON from response
            start_idx = response.find('{')
            end_idx = response.rfind('}') + 1
            json_str = response[start_idx:end_idx]
            
            data = json.loads(json_str)
            return data
        except Exception as e:
            raise Exception(f"Error parsing screening response: {str(e)}")

    async def _with_retries(self, func):
        """Run a callable with concurrency limit and retries on 429/5xx."""
        retries = settings.ai_max_retries
        delay = settings.ai_retry_base_seconds
        timeout = settings.ai_request_timeout_seconds
        async with self._semaphore:
            for attempt in range(retries + 1):
                try:
                    # Run potentially blocking sync call off the event loop and enforce timeout
                    return await asyncio.wait_for(asyncio.to_thread(func), timeout=timeout)
                except Exception as e:
                    message = str(e)
                    is_429 = '429' in message or 'Too Many Requests' in message
                    is_5xx = any(code in message for code in ['500', '502', '503', '504'])
                    is_timeout = isinstance(e, asyncio.TimeoutError) or 'TimeoutError' in message or 'timed out' in message
                    if is_timeout:
                        # On timeout, bubble up immediately (handled as 504 in FastAPI layer)
                        raise
                    if attempt < retries and (is_429 or is_5xx):
                        # jittered exponential backoff
                        backoff = delay * (2 ** attempt) + random.uniform(0, 0.5)
                        await asyncio.sleep(backoff)
                        continue
                    raise
