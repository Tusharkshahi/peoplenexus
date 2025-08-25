import os
import uuid
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
from azure.core.exceptions import ResourceNotFoundError, ClientAuthenticationError
from config import settings
import logging

logger = logging.getLogger(__name__)

class AzureBlobStorageClient:
    def __init__(self):
        self.connection_string = settings.azure_storage_connection_string
        self.container_name = settings.azure_storage_container_name
        self.account_name = settings.azure_storage_account_name
        self.account_key = settings.azure_storage_account_key
        
        if not self.connection_string and (not self.account_name or not self.account_key):
            raise ValueError("Either connection string or account name/key must be provided")
        
        try:
            if self.connection_string:
                self.blob_service_client = BlobServiceClient.from_connection_string(self.connection_string)
            else:
                # Use account name and key
                account_url = f"https://{self.account_name}.blob.core.windows.net"
                self.blob_service_client = BlobServiceClient(
                    account_url=account_url,
                    credential=self.account_key
                )
            
            self.container_client = self.blob_service_client.get_container_client(self.container_name)
            
        except Exception as e:
            logger.error(f"Failed to initialize Azure Blob Storage client: {e}")
            raise
    
    def upload_resume(self, file_content: bytes, original_filename: str, content_type: str = None) -> Dict[str, Any]:
        """
        Upload a resume file to Azure Blob Storage
        
        Args:
            file_content: The file content as bytes
            original_filename: Original filename
            content_type: MIME type of the file
            
        Returns:
            Dict containing blob URL, blob name, and metadata
        """
        try:
            # Generate unique blob name
            file_extension = os.path.splitext(original_filename)[1].lower()
            blob_name = f"resumes/{datetime.now().strftime('%Y/%m/%d')}/{uuid.uuid4()}{file_extension}"
            
            # Get blob client
            blob_client = self.container_client.get_blob_client(blob_name)
            
            # Set content type if provided
            content_settings = None
            if content_type:
                from azure.storage.blob import ContentSettings
                content_settings = ContentSettings(content_type=content_type)
            
            # Upload the file
            blob_client.upload_blob(
                file_content,
                overwrite=True,
                content_settings=content_settings
            )
            
            # Generate SAS token for temporary access (optional)
            sas_token = self._generate_sas_token(blob_name)
            
            return {
                "blob_url": blob_client.url,
                "blob_name": blob_name,
                "original_filename": original_filename,
                "content_type": content_type,
                "size": len(file_content),
                "uploaded_at": datetime.now().isoformat(),
                "sas_url": f"{blob_client.url}?{sas_token}" if sas_token else None
            }
            
        except Exception as e:
            logger.error(f"Failed to upload resume {original_filename}: {e}")
            raise
    
    def download_resume(self, blob_name: str) -> Optional[bytes]:
        """
        Download a resume file from Azure Blob Storage
        
        Args:
            blob_name: Name of the blob to download
            
        Returns:
            File content as bytes or None if not found
        """
        try:
            blob_client = self.container_client.get_blob_client(blob_name)
            download_stream = blob_client.download_blob()
            return download_stream.readall()
            
        except ResourceNotFoundError:
            logger.warning(f"Resume blob not found: {blob_name}")
            return None
        except Exception as e:
            logger.error(f"Failed to download resume {blob_name}: {e}")
            raise
    
    def delete_resume(self, blob_name: str) -> bool:
        """
        Delete a resume file from Azure Blob Storage
        
        Args:
            blob_name: Name of the blob to delete
            
        Returns:
            True if deleted successfully, False otherwise
        """
        try:
            blob_client = self.container_client.get_blob_client(blob_name)
            blob_client.delete_blob()
            logger.info(f"Successfully deleted resume: {blob_name}")
            return True
            
        except ResourceNotFoundError:
            logger.warning(f"Resume blob not found for deletion: {blob_name}")
            return False
        except Exception as e:
            logger.error(f"Failed to delete resume {blob_name}: {e}")
            return False
    
    def get_resume_url(self, blob_name: str, expires_in_hours: int = 24) -> Optional[str]:
        """
        Generate a temporary URL for accessing a resume
        
        Args:
            blob_name: Name of the blob
            expires_in_hours: Hours until URL expires
            
        Returns:
            Temporary URL or None if failed
        """
        try:
            blob_client = self.container_client.get_blob_client(blob_name)
            sas_token = self._generate_sas_token(blob_name, expires_in_hours)
            return f"{blob_client.url}?{sas_token}" if sas_token else None
            
        except Exception as e:
            logger.error(f"Failed to generate URL for resume {blob_name}: {e}")
            return None
    
    def _generate_sas_token(self, blob_name: str, expires_in_hours: int = 24) -> Optional[str]:
        """
        Generate a Shared Access Signature token for temporary access
        
        Args:
            blob_name: Name of the blob
            expires_in_hours: Hours until token expires
            
        Returns:
            SAS token string or None if failed
        """
        try:
            from azure.storage.blob import generate_blob_sas, BlobSasPermissions
            from datetime import datetime, timedelta
            
            # Set expiration time
            expiry = datetime.utcnow() + timedelta(hours=expires_in_hours)
            
            # Generate SAS token
            sas_token = generate_blob_sas(
                account_name=self.account_name,
                container_name=self.container_name,
                blob_name=blob_name,
                account_key=self.account_key,
                permission=BlobSasPermissions(read=True),
                expiry=expiry
            )
            
            return sas_token
            
        except Exception as e:
            logger.error(f"Failed to generate SAS token: {e}")
            return None
    
    def list_resumes(self, prefix: str = "resumes/") -> list:
        """
        List all resumes in the container
        
        Args:
            prefix: Prefix to filter blobs
            
        Returns:
            List of blob information
        """
        try:
            blobs = []
            for blob in self.container_client.list_blobs(name_starts_with=prefix):
                blobs.append({
                    "name": blob.name,
                    "size": blob.size,
                    "created": blob.creation_time.isoformat() if blob.creation_time else None,
                    "content_type": blob.content_settings.content_type if blob.content_settings else None
                })
            return blobs
            
        except Exception as e:
            logger.error(f"Failed to list resumes: {e}")
            return []
    
    def health_check(self) -> Dict[str, Any]:
        """
        Check the health of the Azure Blob Storage connection
        
        Returns:
            Health status information
        """
        try:
            # Try to list containers to test connection
            containers = list(self.blob_service_client.list_containers())
            
            # Check if our container exists
            container_exists = self.container_client.exists()
            
            return {
                "status": "healthy",
                "connection": "successful",
                "container_exists": container_exists,
                "container_name": self.container_name,
                "account_name": self.account_name
            }
            
        except ClientAuthenticationError:
            return {
                "status": "unhealthy",
                "error": "authentication_failed",
                "message": "Invalid credentials or connection string"
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": "connection_failed",
                "message": str(e)
            }
