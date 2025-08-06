'use client';

import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Target, TrendingUp, Award, Plus, Edit, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface PerformanceReview {
  id: string;
  employeeName: string;
  reviewer: string;
  period: string;
  overallScore: number;
  status: 'pending' | 'completed' | 'overdue';
  lastUpdated: string;
}

interface OKR {
  id: string;
  objective: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  status: 'on-track' | 'at-risk' | 'completed';
}

export default function PerformancePage() {
  const [reviews, setReviews] = useState<PerformanceReview[]>([
    {
      id: '1',
      employeeName: 'John Doe',
      reviewer: 'Sarah Manager',
      period: 'Q4 2023',
      overallScore: 4.2,
      status: 'completed',
      lastUpdated: '2024-01-15',
    },
    {
      id: '2',
      employeeName: 'Jane Smith',
      reviewer: 'Mike Director',
      period: 'Q4 2023',
      overallScore: 4.5,
      status: 'completed',
      lastUpdated: '2024-01-18',
    },
    {
      id: '3',
      employeeName: 'Mike Johnson',
      reviewer: 'Lisa Lead',
      period: 'Q4 2023',
      overallScore: 3.8,
      status: 'pending',
      lastUpdated: '2024-01-20',
    },
  ]);

  const [okrs, setOkrs] = useState<OKR[]>([
    {
      id: '1',
      objective: 'Increase Employee Satisfaction',
      target: 80,
      current: 75,
      unit: '%',
      deadline: '2024-03-31',
      status: 'on-track',
    },
    {
      id: '2',
      objective: 'Reduce Turnover Rate',
      target: 85,
      current: 90,
      unit: '%',
      deadline: '2024-03-31',
      status: 'completed',
    },
    {
      id: '3',
      objective: 'Complete Training Programs',
      target: 100,
      current: 60,
      unit: '%',
      deadline: '2024-03-31',
      status: 'at-risk',
    },
  ]);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: '',
    reviewer: '',
    period: '',
    overallScore: '',
    comments: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newReview: PerformanceReview = {
        id: Date.now().toString(),
        employeeName: formData.employeeName,
        reviewer: formData.reviewer,
        period: formData.period,
        overallScore: parseFloat(formData.overallScore),
        status: 'pending',
        lastUpdated: new Date().toISOString().split('T')[0],
      };

      setReviews(prev => [newReview, ...prev]);
      setFormData({
        employeeName: '',
        reviewer: '',
        period: '',
        overallScore: '',
        comments: '',
      });
      setShowReviewForm(false);
      toast.success('Performance review created successfully!');
    } catch (error) {
      toast.error('Failed to create performance review');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewReview = (review: PerformanceReview) => {
    toast.info(`Viewing review for ${review.employeeName}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getOKRStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'on-track':
        return <Badge className="bg-blue-100 text-blue-800">On Track</Badge>;
      case 'at-risk':
        return <Badge className="bg-red-100 text-red-800">At Risk</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const averageScore = reviews.reduce((sum, review) => sum + review.overallScore, 0) / reviews.length;
  const completedReviews = reviews.filter(review => review.status === 'completed').length;
  const topPerformers = reviews.filter(review => review.overallScore >= 4.0).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Performance Reviews" />
        <Button onClick={() => setShowReviewForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Review
        </Button>
      </div>

      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle>Create Performance Review</CardTitle>
              <CardDescription>
                Fill in the details for the new performance review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeName">Employee Name</Label>
                    <Input
                      id="employeeName"
                      name="employeeName"
                      value={formData.employeeName}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reviewer">Reviewer</Label>
                    <Input
                      id="reviewer"
                      name="reviewer"
                      value={formData.reviewer}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="period">Review Period</Label>
                    <Select
                      value={formData.period}
                      onValueChange={(value) => handleSelectChange('period', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Q1 2024">Q1 2024</SelectItem>
                        <SelectItem value="Q2 2024">Q2 2024</SelectItem>
                        <SelectItem value="Q3 2024">Q3 2024</SelectItem>
                        <SelectItem value="Q4 2024">Q4 2024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="overallScore">Overall Score</Label>
                    <Input
                      id="overallScore"
                      name="overallScore"
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={formData.overallScore}
                      onChange={handleInputChange}
                      placeholder="1.0 - 5.0"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comments">Comments</Label>
                  <Textarea
                    id="comments"
                    name="comments"
                    value={formData.comments}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Performance comments and feedback..."
                    disabled={isLoading}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowReviewForm(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Review'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Performance Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore.toFixed(1)}/5</div>
            <p className="text-xs text-muted-foreground">
              +0.3 from last quarter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviews Completed</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedReviews}/{reviews.length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((completedReviews / reviews.length) * 100)}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topPerformers}</div>
            <p className="text-xs text-muted-foreground">
              Exceeding expectations
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Reviews</CardTitle>
            <CardDescription>
              Current performance review status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Reviewer</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="font-medium">{review.employeeName}</TableCell>
                    <TableCell>{review.reviewer}</TableCell>
                    <TableCell>{review.period}</TableCell>
                    <TableCell>{review.overallScore}/5</TableCell>
                    <TableCell>{getStatusBadge(review.status)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewReview(review)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>OKR Tracking</CardTitle>
            <CardDescription>
              Current quarter objectives and key results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {okrs.map((okr) => (
                <div key={okr.id}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{okr.objective}</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {okr.current}/{okr.target}{okr.unit}
                      </span>
                      {getOKRStatusBadge(okr.status)}
                    </div>
                  </div>
                  <Progress value={(okr.current / okr.target) * 100} className="h-2" />
                  <p className="text-sm text-gray-500 mt-1">
                    Target: {okr.target}{okr.unit} | Current: {okr.current}{okr.unit} | Deadline: {okr.deadline}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 