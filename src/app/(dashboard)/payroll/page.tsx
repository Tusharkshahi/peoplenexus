'use client';

import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, DollarSign, TrendingUp, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Employee {
  id: string;
  name: string;
  position: string;
  salary: number;
  status: 'active' | 'inactive';
  lastPayslip: string;
}

interface Payslip {
  id: string;
  employeeName: string;
  month: string;
  year: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'generated' | 'sent' | 'paid';
  generatedDate: string;
}

export default function PayrollPage() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'John Doe',
      position: 'Software Engineer',
      salary: 75000,
      status: 'active',
      lastPayslip: '2024-01',
    },
    {
      id: '2',
      name: 'Jane Smith',
      position: 'Product Manager',
      salary: 85000,
      status: 'active',
      lastPayslip: '2024-01',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      position: 'UX Designer',
      salary: 65000,
      status: 'active',
      lastPayslip: '2024-01',
    },
  ]);

  const [payslips, setPayslips] = useState<Payslip[]>([
    {
      id: '1',
      employeeName: 'John Doe',
      month: 'January',
      year: '2024',
      basicSalary: 75000,
      allowances: 5000,
      deductions: 3000,
      netSalary: 77000,
      status: 'paid',
      generatedDate: '2024-01-31',
    },
    {
      id: '2',
      employeeName: 'Jane Smith',
      month: 'January',
      year: '2024',
      basicSalary: 85000,
      allowances: 6000,
      deductions: 4000,
      netSalary: 87000,
      status: 'paid',
      generatedDate: '2024-01-31',
    },
  ]);

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePayslips = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const currentMonth = new Date().toLocaleString('default', { month: 'long' });
      const currentYear = new Date().getFullYear().toString();

      const newPayslips: Payslip[] = employees.map(employee => ({
        id: Date.now().toString() + Math.random(),
        employeeName: employee.name,
        month: currentMonth,
        year: currentYear,
        basicSalary: employee.salary,
        allowances: Math.floor(employee.salary * 0.1), // 10% allowances
        deductions: Math.floor(employee.salary * 0.05), // 5% deductions
        netSalary: employee.salary + Math.floor(employee.salary * 0.1) - Math.floor(employee.salary * 0.05),
        status: 'generated',
        generatedDate: new Date().toISOString().split('T')[0],
      }));

      setPayslips(prev => [...newPayslips, ...prev]);
      toast.success('Payslips generated successfully!');
    } catch (error) {
      toast.error('Failed to generate payslips');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPayslip = (payslip: Payslip) => {
    // Simulate download
    toast.success(`Downloading payslip for ${payslip.employeeName}`);
  };

  const handleViewPayslip = (payslip: Payslip) => {
    // Simulate viewing payslip
    toast.info(`Viewing payslip for ${payslip.employeeName}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'sent':
        return <Badge className="bg-blue-100 text-blue-800">Sent</Badge>;
      case 'generated':
        return <Badge className="bg-yellow-100 text-yellow-800">Generated</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const totalPayroll = employees.reduce((sum, emp) => sum + emp.salary, 0);
  const averageSalary = totalPayroll / employees.length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <PageHeader title="Payroll" />
        <Button onClick={handleGeneratePayslips} disabled={isGenerating}>
          <FileText className="h-4 w-4 mr-2" />
          {isGenerating ? 'Generating...' : 'Generate Payslips'}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPayroll.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageSalary.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Per employee
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payslips Generated</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payslips.length}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Employee Payroll</CardTitle>
            <CardDescription>
              Current employee salary information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Payslip</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>${employee.salary.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{employee.lastPayslip}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Payslips</CardTitle>
            <CardDescription>
              Latest payroll transactions and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Net Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payslips.slice(0, 5).map((payslip) => (
                  <TableRow key={payslip.id}>
                    <TableCell className="font-medium">{payslip.employeeName}</TableCell>
                    <TableCell>{payslip.month} {payslip.year}</TableCell>
                    <TableCell>${payslip.netSalary.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(payslip.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPayslip(payslip)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadPayslip(payslip)}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 