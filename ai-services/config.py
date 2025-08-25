from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from this folder explicitly to avoid CWD issues
ENV_PATH = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=ENV_PATH)

class Settings(BaseSettings):
    # Azure OpenAI Configuration
    azure_openai_api_key: str = os.getenv("AZURE_OPENAI_API_KEY", "")
    azure_openai_endpoint: str = os.getenv("AZURE_OPENAI_ENDPOINT", "")
    azure_openai_api_version: str = os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview")
    azure_openai_deployment_name: str = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "")
    
    # Server Configuration
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8000"))
    debug: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    # CORS Configuration
    allowed_origins_str: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
    
    # Azure Blob Storage Configuration
    azure_storage_connection_string: str = os.getenv("AZURE_STORAGE_CONNECTION_STRING", "")
    azure_storage_container_name: str = os.getenv("AZURE_STORAGE_CONTAINER_NAME", "resumes")
    azure_storage_account_name: str = os.getenv("AZURE_STORAGE_ACCOUNT_NAME", "")
    azure_storage_account_key: str = os.getenv("AZURE_STORAGE_ACCOUNT_KEY", "")

    # AI Client throttling/retry
    ai_max_concurrency: int = int(os.getenv("AI_MAX_CONCURRENCY", "2"))
    ai_max_retries: int = int(os.getenv("AI_MAX_RETRIES", "3"))
    ai_retry_base_seconds: float = float(os.getenv("AI_RETRY_BASE_SECONDS", "2.0"))
    ai_request_timeout_seconds: float = float(os.getenv("AI_REQUEST_TIMEOUT_SECONDS", "25.0"))
    
    @property
    def cors_origins(self) -> List[str]:
        return [o.strip() for o in self.allowed_origins_str.split(",") if o.strip()]
    
    # Pydantic v2 settings configuration
    model_config = SettingsConfigDict(
        env_file=str(ENV_PATH),
        env_ignore_empty=True,
        extra='ignore'
    )

settings = Settings()
