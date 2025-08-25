// AI Services API Base URL
const AI_API_BASE_URL = 'http://localhost:8000';

// AI Services API Client
class AIResumeAPI {
  constructor(baseURL = AI_API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      console.log('Making request to:', url, 'with config:', config);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { detail: errorText };
        }
        throw new Error(errorData.detail || errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response received:', data);
      return data;
    } catch (error) {
      console.error('AI API Request Error:', {
        url,
        error: error.message,
        stack: error.stack,
        config
      });
      
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error(`Network error: Unable to connect to AI service at ${url}. Please check if the service is running.`);
      }
      
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body });
  }

  // Test connectivity
  async testConnectivity() {
    try {
      const response = await this.get('/health');
      console.log('Connectivity test successful:', response);
      return response;
    } catch (error) {
      console.error('Connectivity test failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.get('/health');
  }

  // Get job templates
  async getJobTemplates() {
    return this.get('/api/v1/job-templates');
  }

  // Rank resumes
  async rankResumes(resumes, jobRequirements, rankingCriteria = null) {
    console.log('rankResumes called with:', { resumes, jobRequirements, rankingCriteria });
    
  const clamp = (text) => this.sanitizeContent(text);
    const payload = {
      resumes: resumes.map(resume => ({
    content: clamp(resume.content),
        filename: resume.filename,
        format: resume.format || 'text',
        // pass through optional storage metadata (server may ignore if unsupported)
        blob_name: resume.blobName || resume.blob_name || undefined,
        blob_url: resume.blobUrl || resume.blob_url || undefined,
      })),
      job_requirements: {
        title: jobRequirements.title,
        description: jobRequirements.description,
        required_skills: jobRequirements.requiredSkills,
        preferred_skills: jobRequirements.preferredSkills || [],
        experience_years: jobRequirements.experienceYears,
        education_level: jobRequirements.educationLevel
      }
    };

    if (rankingCriteria) {
      payload.ranking_criteria = rankingCriteria;
    }

    console.log('Sending payload:', payload);
    return this.post('/api/v1/resume/rank', payload);
  }

  // Screen resume
  async screenResume(resume, jobRequirements, screeningCriteria = null) {
    const payload = {
      resume: {
  content: this.sanitizeContent(resume.content),
        filename: resume.filename,
  format: resume.format || 'text',
  // optional storage metadata
  blob_name: resume.blobName || resume.blob_name || undefined,
  blob_url: resume.blobUrl || resume.blob_url || undefined,
      },
      job_requirements: {
        title: jobRequirements.title,
        description: jobRequirements.description,
        required_skills: jobRequirements.requiredSkills,
        preferred_skills: jobRequirements.preferredSkills || [],
        experience_years: jobRequirements.experienceYears,
        education_level: jobRequirements.educationLevel
      }
    };

    if (screeningCriteria) {
      payload.screening_criteria = screeningCriteria;
    }

    return this.post('/api/v1/resume/screen', payload);
  }

  // Helper method to extract text from file
  async extractTextFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          resolve({
            content: content,
            filename: file.name,
            format: this.getFileFormat(file.name)
          });
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      if (file.type === 'text/plain' || file.type === 'text/csv') {
        reader.readAsText(file);
      } else {
        // For other file types, we'll need to implement proper parsing
        // For now, we'll read as text and let the AI handle it
        reader.readAsText(file);
      }
    });
  }

  // Helper method to get file format
  getFileFormat(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'pdf';
      case 'docx':
      case 'doc':
        return 'docx';
      case 'txt':
      case 'csv':
      default:
        return 'text';
    }
  }

  // Helper method to validate job requirements
  validateJobRequirements(requirements) {
    const errors = [];
    
    if (!requirements.title?.trim()) {
      errors.push('Job title is required');
    }
    
    if (!requirements.description?.trim()) {
      errors.push('Job description is required');
    }
    
    if (!requirements.requiredSkills?.length) {
      errors.push('At least one required skill is needed');
    }
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
    
    return true;
  }

  // Helper method to validate resume data
  validateResumeData(resume) {
    if (!resume.content?.trim()) {
      throw new Error('Resume content cannot be empty');
    }
    
    if (!resume.filename?.trim()) {
      throw new Error('Resume filename is required');
    }
    
    return true;
  }

  // Reduce payload size and remove binary noise
  sanitizeContent(text, maxLen = 20000) {
    if (!text) return '';
    // Remove NULs and non-printable extremes, collapse excessive whitespace
    let t = String(text).replace(/\u0000/g, '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ' ');
    if (t.length > maxLen) t = t.slice(0, maxLen);
    return t;
  }
}

// Create and export AI API instance
const aiApi = new AIResumeAPI();

export default aiApi;

// Also export the class for custom instances
export { AIResumeAPI };

// File upload functions
export const uploadResume = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${AI_API_BASE_URL}/api/v1/resume/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to upload resume');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading resume:', error);
    throw error;
  }
};

export const listResumes = async () => {
  try {
    const response = await fetch(`${AI_API_BASE_URL}/api/v1/resume/list`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to list resumes');
    }

    return await response.json();
  } catch (error) {
    console.error('Error listing resumes:', error);
    throw error;
  }
};

export const deleteResume = async (blobName) => {
  try {
    const response = await fetch(`${AI_API_BASE_URL}/api/v1/resume/${encodeURIComponent(blobName)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete resume');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting resume:', error);
    throw error;
  }
};

// Usage Examples:
/*
// Health check
try {
  const health = await aiApi.healthCheck();
  console.log('AI Services Health:', health);
} catch (error) {
  console.error('AI Services not available:', error.message);
}

// Get job templates
try {
  const templates = await aiApi.getJobTemplates();
  console.log('Job Templates:', templates.templates);
} catch (error) {
  console.error('Failed to fetch templates:', error.message);
}

// Rank resumes
try {
  const rankingResult = await aiApi.rankResumes(
    [
      {
        content: "John Doe\nSoftware Engineer\n5 years experience...",
        filename: "john_doe.txt",
        format: "text"
      }
    ],
    {
      title: "Software Engineer",
      description: "Develop web applications",
      requiredSkills: ["JavaScript", "React", "Node.js"],
      preferredSkills: ["TypeScript", "AWS"],
      experienceYears: 3,
      educationLevel: "Bachelor's Degree"
    }
  );
  console.log('Ranking Results:', rankingResult);
} catch (error) {
  console.error('Failed to rank resumes:', error.message);
}

// Screen resume
try {
  const screeningResult = await aiApi.screenResume(
    {
      content: "Jane Smith\nData Scientist\n3 years experience...",
      filename: "jane_smith.txt",
      format: "text"
    },
    {
      title: "Data Scientist",
      description: "Analyze data and build ML models",
      requiredSkills: ["Python", "Machine Learning", "SQL"],
      preferredSkills: ["TensorFlow", "AWS"],
      experienceYears: 2,
      educationLevel: "Master's Degree"
    }
  );
  console.log('Screening Results:', screeningResult);
} catch (error) {
  console.error('Failed to screen resume:', error.message);
}
*/
