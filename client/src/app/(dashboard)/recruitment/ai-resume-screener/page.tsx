'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import aiApi, { uploadResume } from '@/lib/ai-api';
import { Upload, FileText, Target, Clock, CheckCircle, XCircle, AlertTriangle, ThumbsUp, ThumbsDown } from 'lucide-react';

interface ResumeData {
  content: string;
  filename: string;
  format: string;
  // Optional storage metadata when uploaded to Azure Blob via AI service
  blobName?: string;
  blobUrl?: string;
}

interface JobRequirements {
  title: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experienceYears: number;
  educationLevel: string;
}

interface ScreeningResult {
  passed: boolean;
  score: number;
  breakdown: {
    skills_match: {
      score: number;
      matched_skills: string[];
      missing_skills: string[];
    };
    experience: {
      score: number;
      years_found: number;
      relevance: string;
    };
    education: {
      score: number;
      level: string;
      relevance: string;
    };
    red_flags: {
      found: boolean;
      issues: string[];
    };
  };
  recommendations: string[];
  red_flags: string[];
  strengths: string[];
}

export default function AIResumeScreener() {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [jobRequirements, setJobRequirements] = useState<JobRequirements>({
    title: '',
    description: '',
    requiredSkills: [],
    preferredSkills: [],
    experienceYears: 0,
    educationLevel: ''
  });
  const [screeningResult, setScreeningResult] = useState<ScreeningResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const DEFAULT_TEMPLATES: any = {
    software_engineer: {
      title: 'Software Engineer',
      description: 'Develop and maintain software applications using modern technologies',
      required_skills: ['JavaScript', 'Python', 'React', 'Node.js', 'Git'],
      preferred_skills: ['TypeScript', 'AWS', 'Docker', 'Kubernetes', 'MongoDB'],
      experience_years: 3,
      education_level: "Bachelor's Degree",
    },
    data_scientist: {
      title: 'Data Scientist',
      description: 'Analyze complex data sets to help organizations make better decisions',
      required_skills: ['Python', 'SQL', 'Machine Learning', 'Statistics', 'Pandas'],
      preferred_skills: ['TensorFlow', 'PyTorch', 'AWS', 'Spark', 'Tableau'],
      experience_years: 2,
      education_level: "Master's Degree",
    },
    product_manager: {
      title: 'Product Manager',
      description: 'Lead product development and strategy for software products',
      required_skills: ['Product Strategy', 'Agile', 'User Research', 'Data Analysis', 'Stakeholder Management'],
      preferred_skills: ['SQL', 'A/B Testing', 'Design Thinking', 'Technical Background'],
      experience_years: 4,
      education_level: "Bachelor's Degree",
    },
    hr_specialist: {
      title: 'HR Specialist',
      description: 'Manage human resources functions including recruitment, employee relations, and compliance',
      required_skills: ['Recruitment', 'Employee Relations', 'HR Policies', 'Compliance', 'Communication'],
      preferred_skills: ['HRIS', 'Benefits Administration', 'Training', 'Performance Management'],
      experience_years: 3,
      education_level: "Bachelor's Degree",
    },
  };
  const [jobTemplates, setJobTemplates] = useState<any>(DEFAULT_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [newSkill, setNewSkill] = useState({ required: '', preferred: '' });
  const [isLoadingTemplates, setIsLoadingTemplates] = useState<boolean>(false);
  const [templatesError, setTemplatesError] = useState<string | null>(null);

  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load job templates on component mount
  useEffect(() => {
    loadJobTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadJobTemplates = async () => {
    setIsLoadingTemplates(true);
    setTemplatesError(null);
    try {
      const response = await aiApi.getJobTemplates();
      const templates = response?.templates || {};
      if (templates && Object.keys(templates).length > 0) {
        setJobTemplates(templates);
      } else {
        setJobTemplates(DEFAULT_TEMPLATES);
      }
    } catch (error: any) {
      console.error('Failed to load job templates:', error);
      setTemplatesError('Could not load templates from AI service. Using defaults.');
      setJobTemplates(DEFAULT_TEMPLATES);
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);
    try {
      // 1) Extract text first so screening can proceed immediately
      const resumeData = await aiApi.extractTextFromFile(file);
      setResume(resumeData);
      setError(null);

      // 2) Upload to storage in background and patch metadata when done
      uploadResume(file)
        .then(uploadResp => {
          setResume(prev => prev ? ({
            ...prev,
            blobName: uploadResp?.blob_name || uploadResp?.blobName,
            blobUrl: uploadResp?.sas_url || uploadResp?.url || uploadResp?.sasUrl,
          }) : prev);
        })
        .catch(err => {
          console.error(`Upload failed for ${file.name}:`, err);
        });
    } catch (error) {
      console.error(`Failed to process file ${file.name}:`, error);
      setError(`Failed to process file ${file.name}`);
    } finally {
      setIsUploading(false);
      // Reset input to allow re-uploading the same file
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeResume = () => {
    setResume(null);
    setScreeningResult(null);
  };

  const handleTemplateSelect = (templateKey: string) => {
    const template = jobTemplates[templateKey];
    if (template) {
      setJobRequirements({
        title: template.title,
        description: template.description,
        requiredSkills: template.required_skills,
        preferredSkills: template.preferred_skills,
        experienceYears: template.experience_years,
        educationLevel: template.education_level
      });
      setSelectedTemplate(templateKey);
    }
  };

  const addSkill = (type: 'required' | 'preferred') => {
    const skill = type === 'required' ? newSkill.required : newSkill.preferred;
    if (skill.trim()) {
      setJobRequirements(prev => ({
        ...prev,
        [type === 'required' ? 'requiredSkills' : 'preferredSkills']: [
          ...prev[type === 'required' ? 'requiredSkills' : 'preferredSkills'],
          skill.trim()
        ]
      }));
      setNewSkill(prev => ({ ...prev, [type]: '' }));
    }
  };

  const removeSkill = (type: 'required' | 'preferred', index: number) => {
    setJobRequirements(prev => ({
      ...prev,
      [type === 'required' ? 'requiredSkills' : 'preferredSkills']: 
        prev[type === 'required' ? 'requiredSkills' : 'preferredSkills'].filter((_, i) => i !== index)
    }));
  };

  const handleScreenResume = async () => {
    if (!resume) {
      setError('Please upload a resume');
      return;
    }

    if (!jobRequirements.title || !jobRequirements.description || jobRequirements.requiredSkills.length === 0) {
      setError('Please fill in all required job information');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await aiApi.screenResume(resume, jobRequirements);
      setScreeningResult(result.result);
    } catch (error: any) {
      setError(error.message || 'Failed to screen resume');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Resume Screener</h1>
          <p className="text-muted-foreground">
            Upload a resume and get AI-powered screening results with detailed analysis
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-blue-600" />
          <span className="text-sm text-muted-foreground">
            {resume ? 'Resume uploaded' : 'No resume uploaded'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job Requirements Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Job Requirements</span>
            </CardTitle>
            <CardDescription>
              Define the job requirements to screen the resume against
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Job Template Selector */}
            <div className="space-y-2">
              <Label>Job Template (Optional)</Label>
              <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingTemplates ? 'Loading templates...' : 'Select a job template'} />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(jobTemplates).length === 0 && !isLoadingTemplates ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">No templates available</div>
                  ) : (
                    Object.keys(jobTemplates).map(key => (
                      <SelectItem key={key} value={key}>
                        {jobTemplates[key].title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {templatesError && (
                <p className="text-xs text-yellow-700">{templatesError}</p>
              )}
            </div>

            {/* Job Title */}
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title *</Label>
              <Input
                id="jobTitle"
                value={jobRequirements.title}
                onChange={(e) => setJobRequirements(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Software Engineer"
              />
            </div>

            {/* Job Description */}
            <div className="space-y-2">
              <Label htmlFor="jobDescription">Job Description *</Label>
              <Textarea
                id="jobDescription"
                value={jobRequirements.description}
                onChange={(e) => setJobRequirements(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the role and responsibilities..."
                rows={4}
              />
            </div>

            {/* Required Skills */}
            <div className="space-y-2">
              <Label>Required Skills *</Label>
              <div className="flex space-x-2">
                <Input
                  value={newSkill.required}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, required: e.target.value }))}
                  placeholder="Add required skill"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill('required')}
                />
                <Button onClick={() => addSkill('required')} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {jobRequirements.requiredSkills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeSkill('required', index)}>
                    {skill} ×
                  </Badge>
                ))}
              </div>
            </div>

            {/* Preferred Skills */}
            <div className="space-y-2">
              <Label>Preferred Skills</Label>
              <div className="flex space-x-2">
                <Input
                  value={newSkill.preferred}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, preferred: e.target.value }))}
                  placeholder="Add preferred skill"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill('preferred')}
                />
                <Button onClick={() => addSkill('preferred')} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {jobRequirements.preferredSkills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="cursor-pointer" onClick={() => removeSkill('preferred', index)}>
                    {skill} ×
                  </Badge>
                ))}
              </div>
            </div>

            {/* Experience and Education */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experienceYears">Experience (Years)</Label>
                <Input
                  id="experienceYears"
                  type="number"
                  value={jobRequirements.experienceYears}
                  onChange={(e) => setJobRequirements(prev => ({ ...prev, experienceYears: parseInt(e.target.value) || 0 }))}
                  placeholder="3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="educationLevel">Education Level</Label>
                <Input
                  id="educationLevel"
                  value={jobRequirements.educationLevel}
                  onChange={(e) => setJobRequirements(prev => ({ ...prev, educationLevel: e.target.value }))}
                  placeholder="Bachelor's Degree"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resume Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Upload Resume</span>
            </CardTitle>
            <CardDescription>
              Upload a single resume file to screen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!resume ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-4">
                  Drag and drop a resume file here, or click to browse
                </p>
                <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                  Choose File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">{resume.filename}</span>
                    <Badge variant="outline" className="text-xs">
                      {resume.format.toUpperCase()}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeResume}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>

                {/* Resume Preview */}
                <div className="space-y-2">
                  <Label>Resume Preview</Label>
                  <div className="max-h-40 overflow-y-auto p-3 bg-gray-50 rounded-lg text-sm">
                    <pre className="whitespace-pre-wrap text-gray-700">
                      {resume.content.substring(0, 500)}
                      {resume.content.length > 500 && '...'}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Screen Button */}
            <Button
              onClick={handleScreenResume}
              disabled={isLoading || !resume}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Screening Resume...
                </>
              ) : (
                <>
                  <Target className="h-4 w-4 mr-2" />
                  Screen Resume
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      {screeningResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {screeningResult.passed ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span>Screening Results</span>
              <Badge variant={screeningResult.passed ? "default" : "destructive"}>
                {screeningResult.passed ? 'PASSED' : 'FAILED'}
              </Badge>
            </CardTitle>
            <CardDescription>
              AI analysis of the resume against job requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getScoreBgColor(screeningResult.score)} mb-4`}>
                  <span className={`text-2xl font-bold ${getScoreColor(screeningResult.score)}`}>
                    {screeningResult.score.toFixed(0)}%
                  </span>
                </div>
                <h3 className="text-lg font-semibold">Overall Score</h3>
              </div>

              {/* Score Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Skills Match</span>
                    <span className={`text-sm font-bold ${getScoreColor(screeningResult.breakdown.skills_match.score)}`}>
                      {screeningResult.breakdown.skills_match.score.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={screeningResult.breakdown.skills_match.score} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    <p>Matched: {screeningResult.breakdown.skills_match.matched_skills.join(', ') || 'None'}</p>
                    <p>Missing: {screeningResult.breakdown.skills_match.missing_skills.join(', ') || 'None'}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Experience</span>
                    <span className={`text-sm font-bold ${getScoreColor(screeningResult.breakdown.experience.score)}`}>
                      {screeningResult.breakdown.experience.score.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={screeningResult.breakdown.experience.score} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    <p>Years: {screeningResult.breakdown.experience.years_found}</p>
                    <p>Relevance: {screeningResult.breakdown.experience.relevance}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Education</span>
                    <span className={`text-sm font-bold ${getScoreColor(screeningResult.breakdown.education.score)}`}>
                      {screeningResult.breakdown.education.score.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={screeningResult.breakdown.education.score} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    <p>Level: {screeningResult.breakdown.education.level}</p>
                    <p>Relevance: {screeningResult.breakdown.education.relevance}</p>
                  </div>
                </div>
              </div>

              {/* Strengths and Red Flags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {screeningResult.strengths.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <ThumbsUp className="h-4 w-4 text-green-600" />
                      <h4 className="font-medium">Strengths</h4>
                    </div>
                    <ul className="space-y-1">
                      {screeningResult.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {screeningResult.red_flags.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <h4 className="font-medium">Red Flags</h4>
                    </div>
                    <ul className="space-y-1">
                      {screeningResult.red_flags.map((flag, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Recommendations */}
              {screeningResult.recommendations.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <h4 className="font-medium">Recommendations</h4>
                  </div>
                  <ul className="space-y-1">
                    {screeningResult.recommendations.map((recommendation, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
