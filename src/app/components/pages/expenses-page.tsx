import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { StatCard } from '@/app/components/stat-card';
import { RecordExpenseModal } from '@/app/components/record-expense-modal';
import { useState } from 'react';
import {
  Search,
  Download,
  Plus,
  Receipt,
  TrendingDown,
  AlertCircle,
  DollarSign,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const expenseCategories = [
  { name: 'Salaries', value: 45000, color: '#2563EB' },
  { name: 'Rent', value: 12000, color: '#10B981' },
  { name: 'Utilities', value: 5000, color: '#F59E0B' },
  { name: 'Marketing', value: 8000, color: '#8B5CF6' },
  { name: 'Supplies', value: 4000, color: '#EC4899' },
  { name: 'Other', value: 6000, color: '#6B7280' },
];

const monthlyExpenses = [
  { month: 'Jul', amount: 72000 },
  { month: 'Aug', amount: 78000 },
  { month: 'Sep', amount: 75000 },
  { month: 'Oct', amount: 81000 },
  { month: 'Nov', amount: 79000 },
  { month: 'Dec', amount: 82000 },
  { month: 'Jan', amount: 80000 },
];

const recentExpenses = [
  {
    id: 'EXP-001',
    date: 'Jan 19, 2026',
    category: 'Salaries',
    description: 'Staff Salaries - January 2026',
    amount: 45000,
    status: 'paid' as const,
    vendor: 'Payroll Department',
  },
  {
    id: 'EXP-002',
    date: 'Jan 15, 2026',
    category: 'Rent',
    description: 'Office Rent - January 2026',
    amount: 12000,
    status: 'paid' as const,
    vendor: 'Property Management',
  },
  {
    id: 'EXP-003',
    date: 'Jan 12, 2026',
    category: 'Utilities',
    description: 'Electricity & Water Bill',
    amount: 2500,
    status: 'paid' as const,
    vendor: 'Utility Company',
  },
  {
    id: 'EXP-004',
    date: 'Jan 10, 2026',
    category: 'Marketing',
    description: 'Social Media Advertising',
    amount: 3000,
    status: 'pending' as const,
    vendor: 'Digital Marketing Agency',
  },
  {
    id: 'EXP-005',
    date: 'Jan 8, 2026',
    category: 'Supplies',
    description: 'Office Supplies & Stationery',
    amount: 1200,
    status: 'paid' as const,
    vendor: 'Office Supplies Store',
  },
];

export function ExpensesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Expense Management</h1>
          <p className="text-muted-foreground">Track and manage SACCO operational expenses</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Record Expense
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Expenses (MTD)"
          value="$80,000"
          change={{ value: '-2.4%', trend: 'down' }}
          icon={Receipt}
          iconColor="text-red-600"
          iconBgColor="bg-red-100 dark:bg-red-900/20"
        />
        <StatCard
          title="Pending Payments"
          value="$12,500"
          icon={AlertCircle}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-100 dark:bg-amber-900/20"
        />
        <StatCard
          title="Largest Expense"
          value="$45,000"
          icon={DollarSign}
          iconColor="text-primary"
          iconBgColor="bg-primary/10"
        />
        <StatCard
          title="Budget Remaining"
          value="$120,000"
          change={{ value: '+5%', trend: 'up' }}
          icon={TrendingDown}
          iconColor="text-secondary"
          iconBgColor="bg-secondary/10"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Expense by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Expense by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Expense Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expense Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyExpenses}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#DC2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Expenses Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Recent Expenses</CardTitle>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Expense ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-mono text-sm font-medium">{expense.id}</TableCell>
                    <TableCell>{expense.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{expense.category}</Badge>
                    </TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{expense.vendor}</TableCell>
                    <TableCell className="font-semibold text-red-600">
                      ${expense.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={expense.status === 'paid' ? 'default' : 'secondary'}
                      >
                        {expense.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Record Expense Modal */}
      <RecordExpenseModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}