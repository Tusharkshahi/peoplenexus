# PeopleNexus AI Services

AI-powered resume ranking and screening services for the PeopleNexus HR platform, built with FastAPI and Azure OpenAI.

## 🚀 Features

- **Resume Ranking**: Rank multiple resumes based on job requirements
- **Resume Screening**: Screen individual resumes with detailed analysis
- **Azure Blob Storage**: Secure file storage for resumes
- **Job Templates**: Predefined job requirement templates
- **RESTful API**: Clean, documented API endpoints

## 🛠️ Technology Stack

- **Framework**: FastAPI
- **AI Services**: Azure OpenAI
- **Storage**: Azure Blob Storage
- **Authentication**: Azure Storage authentication
- **Documentation**: Auto-generated OpenAPI docs

## 📋 Prerequisites

- Python 3.8+
- Azure OpenAI account with API access
- Azure Storage account with Blob Storage
- pip package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   cd ai-services
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Environment Configuration**
   Copy the example environment file and configure your settings:
   ```bash
   cp env.example .env
   ```

   Update the `.env` file with your Azure credentials:
   ```env
   # Azure OpenAI Configuration
   AZURE_OPENAI_API_KEY=your_azure_openai_api_key_here
   AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
   AZURE_OPENAI_API_VERSION=2024-02-15-preview
   AZURE_OPENAI_DEPLOYMENT_NAME=your_deployment_name

   # Server Configuration
   HOST=0.0.0.0
   PORT=8000
   ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

   # Azure Blob Storage Configuration
   AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=your_storage_account;AccountKey=your_account_key;EndpointSuffix=core.windows.net
   AZURE_STORAGE_CONTAINER_NAME=resumes
   AZURE_STORAGE_ACCOUNT_NAME=your_storage_account
   AZURE_STORAGE_ACCOUNT_KEY=your_account_key
   ```

## 🗄️ Azure Storage Setup

1. **Create Azure Storage Account**
   - Go to Azure Portal → Storage accounts
   - Create a new storage account
   - Note down the account name and access keys

2. **Create Blob Container**
   - In your storage account, go to Containers
   - Create a new container named `resumes`
   - Set access level to "Private" for security

3. **Get Connection String**
   - In your storage account, go to Access keys
   - Copy the connection string or account name/key

## 🚀 Running the Server

### Development Mode
```bash
python start.py
```

### Production Mode
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

The server will start on `http://localhost:8000` (or your configured HOST:PORT).

## 📚 API Endpoints

### Health Check
- `GET /health` - Check service health and connectivity

### File Management
- `POST /api/v1/resume/upload` - Upload resume file to Azure Blob Storage
- `GET /api/v1/resume/list` - List all uploaded resumes
- `DELETE /api/v1/resume/{blob_name}` - Delete a resume file

### AI Services
- `POST /api/v1/resume/rank` - Rank multiple resumes
- `POST /api/v1/resume/screen` - Screen a single resume

### Templates
- `GET /api/v1/job-templates` - Get available job templates

## 📁 File Upload

### Supported Formats
- PDF (`application/pdf`)
- DOCX (`application/vnd.openxmlformats-officedocument.wordprocessingml.document`)
- TXT (`text/plain`)

### File Size Limits
- Maximum file size: 10MB

### Upload Example
```bash
curl -X POST "http://localhost:8000/api/v1/resume/upload" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@resume.pdf"
```

## 🔐 Security

- **CORS**: Configured to allow specific origins
- **File Validation**: Type and size validation for uploads
- **Azure Storage**: Secure blob storage with private access
- **SAS Tokens**: Temporary access URLs for file downloads

## 📊 Storage Structure

Resumes are stored in Azure Blob Storage with the following structure:
```
resumes/
├── 2024/
│   ├── 01/
│   │   ├── 15/
│   │   │   ├── uuid1.pdf
│   │   │   └── uuid2.docx
│   │   └── 16/
│   │       └── uuid3.txt
│   └── 02/
│       └── ...
└── ...
```

## 🧪 Testing

### Health Check
```bash
curl http://localhost:8000/health
```

### List Resumes
```bash
curl http://localhost:8000/api/v1/resume/list
```

### Job Templates
```bash
curl http://localhost:8000/api/v1/job-templates
```

## 📖 API Documentation

Once the server is running, you can access:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `AZURE_OPENAI_API_KEY` | Azure OpenAI API key | Required |
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI endpoint URL | Required |
| `AZURE_OPENAI_DEPLOYMENT_NAME` | Model deployment name | Required |
| `AZURE_STORAGE_CONNECTION_STRING` | Azure Storage connection string | Required |
| `AZURE_STORAGE_CONTAINER_NAME` | Blob container name | `resumes` |
| `HOST` | Server host | `0.0.0.0` |
| `PORT` | Server port | `8000` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000` |

## 🚨 Troubleshooting

### Common Issues

1. **Azure Storage Connection Failed**
   - Verify connection string or account credentials
   - Ensure container exists and is accessible
   - Check network connectivity

2. **File Upload Fails**
   - Verify file type is supported
   - Check file size (max 10MB)
   - Ensure Azure Storage is properly configured

3. **CORS Errors**
   - Verify `ALLOWED_ORIGINS` includes your frontend URL
   - Check browser console for specific CORS errors

4. **Azure OpenAI Errors**
   - Verify API key and endpoint
   - Check deployment name
   - Ensure model is available in your region

### Logs
Check the console output for detailed error messages and logs.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
