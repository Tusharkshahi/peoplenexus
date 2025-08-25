'use client';

import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface NewHire {
  id: string;
  name: string;
  position: string;
  startDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  tasks: OnboardingTask[];
}

interface OnboardingTask {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  dueDate: string;
}

export default function OnboardingPage() {
  const [newHires, setNewHires] = useState<NewHire[]>([
    {
      id: '1',
      name: 'John Doe',
      position: 'Software Engineer',
      startDate: '2024-01-15',
      status: 'in-progress',
      tasks: [
        { id: '1', title: 'Complete HR paperwork', status: 'completed', dueDate: '2024-01-10' },
        { id: '2', title: 'IT setup and access', status: 'completed', dueDate: '2024-01-12' },
        { id: '3', title: 'Team introduction', status: 'pending', dueDate: '2024-01-16' },
        { id: '4', title: 'Training completion', status: 'pending', dueDate: '2024-01-20' },
      ],
    },
    {
      id: '2',
      name: 'Jane Smith',
      position: 'Product Manager',
      startDate: '2024-01-20',
      status: 'completed',
      tasks: [
        { id: '5', title: 'Complete HR paperwork', status: 'completed', dueDate: '2024-01-15' },
        { id: '6', title: 'IT setup and access', status: 'completed', dueDate: '2024-01-17' },
        { id: '7', title: 'Team introduction', status: 'completed', dueDate: '2024-01-21' },
        { id: '8', title: 'Training completion', status: 'completed', dueDate: '2024-01-25' },
      ],
    },
    {
      id: '3',
      name: 'Mike Johnson',
      position: 'UX Designer',
      startDate: '2024-01-25',
      status: 'pending',
      tasks: [
        { id: '9', title: 'Complete HR paperwork', status: 'pending', dueDate: '2024-01-20' },
        { id: '10', title: 'IT setup and access', status: 'pending', dueDate: '2024-01-22' },
        { id: '11', title: 'Team introduction', status: 'pending', dueDate: '2024-01-26' },
        { id: '12', title: 'Training completion', status: 'pending', dueDate: '2024-01-30' },
      ],
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    startDate: '',
    department: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const defaultTasks: OnboardingTask[] = [
        { id: Date.now().toString() + '1', title: 'Complete HR paperwork', status: 'pending', dueDate: formData.startDate },
        { id: Date.now().toString() + '2', title: 'IT setup and access', status: 'pending', dueDate: formData.startDate },
        { id: Date.now().toString() + '3', title: 'Team introduction', status: 'pending', dueDate: formData.startDate },
        { id: Date.now().toString() + '4', title: 'Training completion', status: 'pending', dueDate: formData.startDate },
      ];

      const newHire: NewHire = {
        id: Date.now().toString(),
        name: formData.name,
        position: formData.position,
        startDate: formData.startDate,
        status: 'pending',
        tasks: defaultTasks,
      };

      setNewHires(prev => [newHire, ...prev]);
      setFormData({
        name: '',
        position: '',
        startDate: '',
        department: '',
      });
      setShowForm(false);
      toast.success('New hire added successfully!');
    } catch (error) {
      toast.error('Failed to add new hire');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskToggle = (hireId: string, taskId: string) => {
    setNewHires(prev =>
      prev.map(hire =>
        hire.id === hireId
          ? {
              ...hire,
              tasks: hire.tasks.map(task =>
                task.id === taskId
                  ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
                  : task
              ),
              status: hire.tasks.every(t => t.id === taskId ? true : t.status === 'completed') ? 'completed' : 'in-progress'
            }
          : hire
      )
    );
    toast.success('Task status updated');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTaskIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Onboarding" />
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Hire
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle>Add New Hire</CardTitle>
              <CardDescription>
                Fill in the details for the new employee
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => handleSelectChange('department', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Product">Product</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Adding...' : 'Add New Hire'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-6">
        {newHires.map((hire) => (
          <Card key={hire.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{hire.name}</CardTitle>
                  <CardDescription>
                    {hire.position} • Start Date: {hire.startDate}
                  </CardDescription>
                </div>
                {getStatusBadge(hire.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {hire.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleTaskToggle(hire.id, task.id)}
                  >
                    <div className="flex items-center space-x-3">
                      {getTaskIcon(task.status)}
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-gray-500">Due: {task.dueDate}</p>
                      </div>
                    </div>
                    <Badge
                      className={
                        task.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 