# PeopleNexus AI Resume Services - Setup Guide

This guide will help you set up the AI-powered resume ranking and screening system for your PeopleNexus HR platform.

## 🎯 Overview

The system consists of:
- **FastAPI Backend** (`ai-services/`) - AI-powered resume analysis APIs
- **Next.js Frontend** (`client/`) - HR dashboard with AI tools integration
- **Azure OpenAI Integration** - Powered by Azure OpenAI models

## 📋 Prerequisites

1. **Python 3.8+** installed on your system
2. **Node.js 18+** and npm/yarn installed
3. **Azure OpenAI Account** with API access
4. **Git** for version control

## 🚀 Quick Start

### 1. Clone and Setup Repository

```bash
# Clone the repository (if not already done)
git clone <your-repo-url>
cd PeopleNexus

# Install frontend dependencies
cd client
npm install

# Install AI services dependencies
cd ../ai-services
pip install -r requirements.txt
```

### 2. Configure Azure OpenAI

1. **Get Azure OpenAI Credentials:**
   - Go to [Azure Portal](https://portal.azure.com)
   - Navigate to your Azure OpenAI resource
   - Go to "Keys and Endpoint" section
   - Copy the API key and endpoint URL

2. **Configure Environment Variables:**
   ```bash
   cd ai-services
   cp env.example .env
   ```

3. **Edit `.env` file:**
   ```env
   # Azure OpenAI Configuration
   AZURE_OPENAI_API_KEY=your_actual_api_key_here
   AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
   AZURE_OPENAI_API_VERSION=2023-12-01-preview
   AZURE_OPENAI_DEPLOYMENT_NAME=your_deployment_name
   
   # Server Configuration
   HOST=0.0.0.0
   PORT=8000
   DEBUG=True
   
   # CORS Configuration
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
   ```

### 3. Start the Services

#### Option A: Using the Startup Script (Recommended)

```bash
cd ai-services
python start.py
```

#### Option B: Manual Start

**Terminal 1 - AI Services:**
```bash
cd ai-services
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 4. Access the Application

- **Frontend Dashboard:** http://localhost:3000
- **AI Services API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs
- **AI Resume Ranker:** http://localhost:3000/recruitment/ai-resume-ranker
- **AI Resume Screener:** http://localhost:3000/recruitment/ai-resume-screener

## 🔧 Detailed Setup

### AI Services Configuration

The AI services are located in the `ai-services/` directory:

```
ai-services/
├── main.py              # FastAPI application
├── config.py            # Configuration settings
├── models.py            # Pydantic models
├── ai_client.py         # Azure OpenAI client
├── resume_ranker.py     # Resume ranking service
├── resume_screener.py   # Resume screening service
├── requirements.txt     # Python dependencies
├── env.example          # Environment variables template
├── start.py            # Startup script
└── README.md           # AI services documentation
```

### Frontend Integration

The frontend components are integrated into the recruitment section:

- **AI API Client:** `client/src/lib/ai-api.js`
- **Resume Ranker Page:** `client/src/app/(dashboard)/recruitment/ai-resume-ranker/page.tsx`
- **Resume Screener Page:** `client/src/app/(dashboard)/recruitment/ai-resume-screener/page.tsx`
- **Updated Recruitment Page:** `client/src/app/(dashboard)/recruitment/page.tsx`

## 🧪 Testing the System

### 1. Test API Health

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "services": {
    "resume_ranker": "available",
    "resume_screener": "available"
  },
  "config": {
    "azure_openai_configured": true,
    "cors_origins": ["http://localhost:3000"]
  }
}
```

### 2. Test Job Templates

```bash
curl http://localhost:8000/api/v1/job-templates
```

### 3. Test Resume Screening

```bash
curl -X POST http://localhost:8000/api/v1/resume/screen \
  -H "Content-Type: application/json" \
  -d '{
    "resume": {
      "content": "John Doe\nSoftware Engineer\n5 years experience in Python, React, Node.js",
      "filename": "john_doe.txt",
      "format": "text"
    },
    "job_requirements": {
      "title": "Software Engineer",
      "description": "Develop web applications",
      "required_skills": ["JavaScript", "React", "Node.js"],
      "preferred_skills": ["TypeScript", "AWS"],
      "experience_years": 3,
      "education_level": "Bachelor's Degree"
    }
  }'
```

## 🎨 Using the Frontend

### 1. Navigate to Recruitment

1. Go to http://localhost:3000
2. Log in to your HR dashboard
3. Navigate to "Recruitment" in the sidebar

### 2. Access AI Tools

You'll see two new AI-powered tools in the recruitment section:

- **AI Resume Ranker** - For ranking multiple resumes
- **AI Resume Screener** - For screening individual resumes

### 3. Using the AI Resume Ranker

1. Click on "AI Resume Ranker"
2. Fill in job requirements (or select a template)
3. Upload multiple resume files
4. Click "Rank Resumes"
5. View detailed ranking results

### 4. Using the AI Resume Screener

1. Click on "AI Resume Screener"
2. Fill in job requirements (or select a template)
3. Upload a single resume file
4. Click "Screen Resume"
5. View detailed screening results

## 🔍 Troubleshooting

### Common Issues

#### 1. AI Services Won't Start

**Error:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**
```bash
cd ai-services
pip install -r requirements.txt
```

#### 2. Azure OpenAI Connection Error

**Error:** `Error analyzing resume: Invalid API key`

**Solution:**
- Check your `.env` file has correct Azure OpenAI credentials
- Verify your Azure OpenAI resource is active
- Ensure your deployment name is correct

#### 3. CORS Errors

**Error:** `Access to fetch at 'http://localhost:8000' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution:**
- Ensure AI services are running on port 8000
- Check `ALLOWED_ORIGINS` in your `.env` file includes `http://localhost:3000`

#### 4. Frontend Can't Connect to AI Services

**Error:** `Failed to fetch`

**Solution:**
- Ensure AI services are running (`python start.py`)
- Check the API base URL in `client/src/lib/ai-api.js`
- Verify both services are running on correct ports

### Debug Mode

Enable debug mode for more detailed error messages:

```env
DEBUG=True
```

### Logs

Check the console output for both services:
- **AI Services:** Terminal running `python start.py`
- **Frontend:** Terminal running `npm run dev`

## 🔒 Security Considerations

1. **API Keys:** Never commit your `.env` file to version control
2. **CORS:** Configure `ALLOWED_ORIGINS` to only include trusted domains
3. **Rate Limiting:** Consider implementing rate limiting for production use
4. **Input Validation:** The system includes comprehensive input validation

## 📈 Production Deployment

For production deployment:

1. **Environment Variables:**
   - Set `DEBUG=False`
   - Configure production CORS origins
   - Use production Azure OpenAI endpoints

2. **Process Management:**
   - Use PM2 or similar for Node.js processes
   - Use Gunicorn for Python FastAPI
   - Set up proper logging

3. **Security:**
   - Use HTTPS
   - Implement authentication
   - Add rate limiting
   - Set up monitoring

## 🤝 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the console logs for both services
3. Verify your Azure OpenAI configuration
4. Test the API endpoints directly using curl or the Swagger UI

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Azure OpenAI Documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/)
- [Next.js Documentation](https://nextjs.org/docs)
- [API Documentation](http://localhost:8000/docs) (when running)
