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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { StatCard } from '@/app/components/stat-card';
import { RecordExpenseModal } from '@/app/components/record-expense-modal';
import { ExpenseDetailModal } from '@/app/components/expense-detail-modal';
import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Download,
  Plus,
  Receipt,
  TrendingDown,
  AlertCircle,
  Banknote,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
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
import {
  expenseService,
  ExpenseDashboardStats,
  ExpenseByCategory,
  MonthlyExpenseTrend,
  ExpenseTransaction,
  ExpensePagination
} from '@/app/lib/expense-service';
import { toast } from 'react-hot-toast';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6B7280', '#EF4444', '#06B6D4'];

export function ExpensesPage() {
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);

  const [stats, setStats] = useState<ExpenseDashboardStats | null>(null);
  const [categories, setCategories] = useState<ExpenseByCategory[]>([]);
  const [trends, setTrends] = useState<MonthlyExpenseTrend[]>([]);
  const [transactions, setTransactions] = useState<ExpenseTransaction[]>([]);
  const [pagination, setPagination] = useState<ExpensePagination>({ limit_start: 0, limit_page_length: 7, total: 0 });

  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchDashboardData = async () => {
    try {
      const [statsData, categoriesData, trendsData] = await Promise.all([
        expenseService.getExpenseDashboardStats(),
        expenseService.getExpensesByCategory(),
        expenseService.getMonthlyExpenseTrends()
      ]);
      setStats(statsData);
      setCategories(categoriesData);
      setTrends(trendsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load expense summary');
    }
  };

  const fetchTransactions = useCallback(async () => {
    setTableLoading(true);
    try {
      const params = {
        limit_start: pagination.limit_start,
        limit_page_length: pagination.limit_page_length,
        search: search || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter
      };
      const response = await expenseService.getAllExpenseTransactions(params);
      setTransactions(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load expenses');
    } finally {
      setTableLoading(false);
    }
  }, [pagination.limit_start, pagination.limit_page_length, search, statusFilter]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchDashboardData(), fetchTransactions()]);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTransactions();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, statusFilter, pagination.limit_start]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(amount);
  };

  const handlePageChange = (direction: 'prev' | 'next') => {
    const newStart = direction === 'next'
      ? pagination.limit_start + pagination.limit_page_length
      : Math.max(0, pagination.limit_start - pagination.limit_page_length);
    setPagination(prev => ({ ...prev, limit_start: newStart }));
  };

  const handleViewDetails = (id: string) => {
    setSelectedExpenseId(id);
    setIsDetailModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

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
          <Button className="gap-2" onClick={() => setIsRecordModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Record Expense
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Expenses (MTD)"
          value={formatCurrency(stats?.total_expense_mtd || 0)}
          icon={Receipt}
          iconColor="text-red-600"
          iconBgColor="bg-red-100 dark:bg-red-900/20"
        />
        <StatCard
          title="Pending Payments"
          value={stats?.pending_payments.toString() || "0"}
          icon={AlertCircle}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-100 dark:bg-amber-900/20"
        />
        <StatCard
          title="Largest Expense"
          value={formatCurrency(stats?.largest_expense || 0)}
          icon={Banknote}
          iconColor="text-primary"
          iconBgColor="bg-primary/10"
        />
        <StatCard
          title="Budget Remaining"
          value={formatCurrency(stats?.budget_remaining || 0)}
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
            <div className="h-[300px] w-full">
              {categories.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Expense Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expense Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {trends.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trends}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted opacity-50" vertical={false} />
                    <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `KSH ${value / 1000}k`} />
                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} formatter={(value: number) => formatCurrency(value)} />
                    <Bar dataKey="total" fill="#DC2626" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Expenses Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Expense Transactions</CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto min-h-[400px]">
            {tableLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[1px] dark:bg-slate-950/50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      No expense transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-mono text-xs font-medium">{expense.id}</TableCell>
                      <TableCell className="text-sm">{expense.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">{expense.category}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                        {expense.description}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{expense.vendor || '-'}</TableCell>
                      <TableCell className="font-bold text-red-600">
                        {formatCurrency(expense.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={expense.status === 'Completed' ? 'default' : 'secondary'}
                          className="font-medium"
                        >
                          {expense.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleViewDetails(expense.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{pagination.limit_start + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(pagination.limit_start + pagination.limit_page_length, pagination.total)}
              </span>{' '}
              of <span className="font-medium">{pagination.total}</span> entries
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange('prev')}
                disabled={pagination.limit_start === 0 || tableLoading}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange('next')}
                disabled={pagination.limit_start + pagination.limit_page_length >= pagination.total || tableLoading}
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <RecordExpenseModal
        open={isRecordModalOpen}
        onOpenChange={setIsRecordModalOpen}
        onSuccess={() => {
          fetchDashboardData();
          fetchTransactions();
        }}
      />
      <ExpenseDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        expenseId={selectedExpenseId}
      />
    </div>
  );
}