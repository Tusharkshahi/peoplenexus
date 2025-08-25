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
import { Upload, FileText, Users, Target, Clock, CheckCircle, XCircle } from 'lucide-react';

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

interface RankingResult {
  filename: string;
  ranking: {
    score: number;
    breakdown: {
      skills_match: number;
      experience: number;
      education: number;
      overall_fit: number;
    };
    reasoning: string;
  };
  rank: number;
}

export default function AIResumeRanker() {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [jobRequirements, setJobRequirements] = useState<JobRequirements>({
    title: '',
    description: '',
    requiredSkills: [],
    preferredSkills: [],
    experienceYears: 0,
    educationLevel: ''
  });
  const [rankingResults, setRankingResults] = useState<RankingResult[]>([]);
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

    setIsUploading(true);
    try {
      // 1) Extract text first so ranking can proceed immediately
      const extracted: ResumeData[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const data = await aiApi.extractTextFromFile(file);
          extracted.push(data);
        } catch (err) {
          console.error(`Failed to read file ${file.name}:`, err);
          setError(`Failed to read file ${file.name}`);
        }
      }

      if (extracted.length > 0) {
        setResumes(prev => [...prev, ...extracted]);
      }
      setError(null);

      // 2) Upload to storage in background and patch in blob metadata when ready
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        uploadResume(file)
          .then(uploadResp => {
            setResumes(prev => {
              const idx = prev.findIndex(r => r.filename === file.name && !r.blobName);
              if (idx === -1) return prev;
              const next = [...prev];
              next[idx] = {
                ...next[idx],
                blobName: uploadResp?.blob_name || uploadResp?.blobName,
                blobUrl: uploadResp?.sas_url || uploadResp?.url || uploadResp?.sasUrl,
              };
              return next;
            });
          })
          .catch(err => {
            console.error(`Upload failed for ${file.name}:`, err);
          })
          .finally(() => {
            // noop per file
          });
      }
    } finally {
      setIsUploading(false);
      // Reset input to allow re-uploading the same file(s)
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeResume = (index: number) => {
    setResumes(prev => prev.filter((_, i) => i !== index));
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

  const handleRankResumes = async () => {
    if (resumes.length === 0) {
      setError('Please upload at least one resume');
      return;
    }

    if (!jobRequirements.title || !jobRequirements.description || jobRequirements.requiredSkills.length === 0) {
      setError('Please fill in all required job information');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await aiApi.rankResumes(resumes, jobRequirements);
      setRankingResults(result.ranked_resumes);
    } catch (error: any) {
      setError(error.message || 'Failed to rank resumes');
    } finally {
      setIsLoading(false);
    }
  };

  const testConnectivity = async () => {
    try {
      const result = await aiApi.testConnectivity();
      alert('Connectivity test successful! Server is running.');
    } catch (error: any) {
      alert(`Connectivity test failed: ${error.message}`);
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
          <h1 className="text-3xl font-bold">AI Resume Ranker</h1>
          <p className="text-muted-foreground">
            Upload multiple resumes and rank them based on job requirements using AI
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={testConnectivity}>
            Test Connection
          </Button>
          <Users className="h-6 w-6 text-blue-600" />
          <span className="text-sm text-muted-foreground">
            {resumes.length} resume{resumes.length !== 1 ? 's' : ''} uploaded
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
              Define the job requirements to rank resumes against
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
              <span>Upload Resumes</span>
            </CardTitle>
            <CardDescription>
              Upload multiple resume files to rank them
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-4">
                Drag and drop resume files here, or click to browse
              </p>
              <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                Choose Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Uploaded Resumes List */}
            {resumes.length > 0 && (
              <div className="space-y-2">
                <Label>Uploaded Resumes</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {resumes.map((resume, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">{resume.filename}</span>
                        <Badge variant="outline" className="text-xs">
                          {resume.format.toUpperCase()}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeResume(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Rank Button */}
            <Button
              onClick={handleRankResumes}
              disabled={isLoading || resumes.length === 0}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Ranking Resumes...
                </>
              ) : (
                <>
                  <Target className="h-4 w-4 mr-2" />
                  Rank Resumes ({resumes.length})
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      {rankingResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Ranking Results</span>
            </CardTitle>
            <CardDescription>
              Resumes ranked by AI based on job requirements match
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rankingResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${getScoreBgColor(result.ranking.score)}`}>
                        {result.rank}
                      </div>
                      <div>
                        <h3 className="font-semibold">{result.filename}</h3>
                        <p className="text-sm text-muted-foreground">
                          Overall Score: <span className={`font-medium ${getScoreColor(result.ranking.score)}`}>
                            {result.ranking.score.toFixed(1)}%
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Skills Match</p>
                      <Progress value={result.ranking.breakdown.skills_match} className="h-2" />
                      <p className="text-xs font-medium">{result.ranking.breakdown.skills_match.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Experience</p>
                      <Progress value={result.ranking.breakdown.experience} className="h-2" />
                      <p className="text-xs font-medium">{result.ranking.breakdown.experience.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Education</p>
                      <Progress value={result.ranking.breakdown.education} className="h-2" />
                      <p className="text-xs font-medium">{result.ranking.breakdown.education.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Overall Fit</p>
                      <Progress value={result.ranking.breakdown.overall_fit} className="h-2" />
                      <p className="text-xs font-medium">{result.ranking.breakdown.overall_fit.toFixed(1)}%</p>
                    </div>
                  </div>

                  {/* Reasoning */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">{result.ranking.reasoning}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
