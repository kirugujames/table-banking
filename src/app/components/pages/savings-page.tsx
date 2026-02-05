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
import {
  Search,
  Download,
  Plus,
  TrendingUp,
  PiggyBank,
  Users,
  DollarSign,
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useEffect, useState, useCallback } from 'react';
import { savingsService, SavingsSummary, TopSaver, SavingsTrendItem, SavingsTransaction, Pagination } from '@/app/lib/savings-service';
import { toast } from 'react-hot-toast';
import { Loader2, ChevronLeft, ChevronRight, PiggyBank as PiggyBankIcon } from 'lucide-react';
import { GlobalSaveModal } from '@/app/components/global-save-modal';

const monthlyData = [
  { month: 'Jul', deposits: 48000, withdrawals: 12000 },
  { month: 'Aug', deposits: 52000, withdrawals: 15000 },
  { month: 'Sep', deposits: 49000, withdrawals: 11000 },
  { month: 'Oct', deposits: 61000, withdrawals: 14000 },
  { month: 'Nov', deposits: 58000, withdrawals: 13000 },
  { month: 'Dec', deposits: 67000, withdrawals: 16000 },
  { month: 'Jan', deposits: 71000, withdrawals: 18000 },
];

const transactions = [
  {
    id: 'TXN-00456',
    date: 'Jan 19, 2026',
    time: '10:30 AM',
    member: 'Sarah Johnson',
    memberId: 'MEM-00045',
    type: 'Savings Deposit',
    amount: '$1,200',
    balanceAfter: '$12,450',
    reference: 'SAV-DEP-456',
    isCredit: true,
  },
  {
    id: 'TXN-00457',
    date: 'Jan 19, 2026',
    time: '11:15 AM',
    member: 'Michael Chen',
    memberId: 'MEM-00082',
    type: 'Loan Repayment',
    amount: '$450',
    balanceAfter: '$8,920',
    reference: 'LOAN-REP-189',
    isCredit: true,
  },
  {
    id: 'TXN-00458',
    date: 'Jan 19, 2026',
    time: '02:20 PM',
    member: 'Emily Brown',
    memberId: 'MEM-00123',
    type: 'Withdrawal',
    amount: '$800',
    balanceAfter: '$5,340',
    reference: 'WITH-342',
    isCredit: false,
  },
  {
    id: 'TXN-00459',
    date: 'Jan 18, 2026',
    time: '09:45 AM',
    member: 'David Wilson',
    memberId: 'MEM-00156',
    type: 'Welfare Contribution',
    amount: '$50',
    balanceAfter: '$15,780',
    reference: 'WEL-CON-234',
    isCredit: true,
  },
  {
    id: 'TXN-00460',
    date: 'Jan 18, 2026',
    time: '03:30 PM',
    member: 'Jennifer Lee',
    memberId: 'MEM-00201',
    type: 'Savings Deposit',
    amount: '$2,500',
    balanceAfter: '$18,200',
    reference: 'SAV-DEP-457',
    isCredit: true,
  },
];

export function SavingsPage() {
  const [summary, setSummary] = useState<SavingsSummary | null>(null);
  const [topSavers, setTopSavers] = useState<TopSaver[]>([]);
  const [trendData, setTrendData] = useState<SavingsTrendItem[]>([]);
  const [transactions, setTransactions] = useState<SavingsTransaction[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ limit_start: 0, limit_page_length: 7, total: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [summaryData, topSaversData, trendDataResponse] = await Promise.all([
        savingsService.getSavingsDashboard(),
        savingsService.getTopSavers(),
        savingsService.getSavingsVsExpense()
      ]);
      setSummary(summaryData);
      setTopSavers(topSaversData);
      setTrendData(trendDataResponse);
    } catch (error) {
      console.error('Error fetching savings data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async (start = 0, search = '') => {
    try {
      setIsTransactionsLoading(true);
      const { data, pagination: pagData } = await savingsService.getSavingsTransactions({
        limit_start: start,
        limit_page_length: 7,
        searchTerm: search
      });
      setTransactions(data);
      setPagination(pagData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setIsTransactionsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchTransactions(0, '');
  }, [fetchData, fetchTransactions]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Debounce search if needed, but for now just call
    fetchTransactions(0, value);
  };

  const handlePageChange = (newStart: number) => {
    fetchTransactions(newStart, searchTerm);
  };

  const formatCurrency = (amount: number) => {
    return 'KSh ' + new Intl.NumberFormat('en-KE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Savings & Transactions</h1>
          <p className="text-muted-foreground">Monitor savings and transaction activity</p>
        </div>
        <Button className="gap-2 px-6 h-12 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20" onClick={() => setIsRecordModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Record Saving
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Savings"
          value={isLoading ? '...' : formatCurrency(summary?.total_savings || 0)}
          change={{ value: '+15%', trend: 'up' }}
          icon={PiggyBank}
          iconColor="text-primary"
          iconBgColor="bg-primary/10"
        />
        <StatCard
          title="Monthly Deposits"
          value={isLoading ? '...' : formatCurrency(summary?.monthly_deposits || 0)}
          change={{ value: '+6%', trend: 'up' }}
          icon={ArrowUpCircle}
          iconColor="text-secondary"
          iconBgColor="bg-secondary/10"
        />
        <StatCard
          title="Monthly Withdrawals"
          value={isLoading ? '...' : formatCurrency(summary?.monthly_withdrawals || 0)}
          change={{ value: '+12%', trend: 'up' }}
          icon={ArrowDownCircle}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-100 dark:bg-amber-900/20"
        />
        <StatCard
          title="Active Savers"
          value={isLoading ? '...' : (summary?.active_savers_count || 0).toString()}
          change={{ value: '+8%', trend: 'up' }}
          icon={Users}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100 dark:bg-purple-900/20"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Savings Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Savings Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Legend />
                <Bar dataKey="savings" fill="#10B981" name="Savings" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#EF4444" name="Expense" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Savers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Savers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSavers.length > 0 ? topSavers.map((saver, index) => (
                <div key={saver.name} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{saver.member_name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      {formatCurrency(saver.current_month_savings)} this month
                    </p>
                  </div>
                  <p className="text-sm font-black">{formatCurrency(saver.total_savings)}</p>
                </div>
              )) : (
                <div className="py-12 text-center text-muted-foreground text-sm italic">
                  No top savers found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Balance After</TableHead>
                  <TableHead>Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isTransactionsLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm font-medium text-muted-foreground">Loading transactions...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : transactions.length > 0 ? (
                  transactions.map((txn) => (
                    <TableRow key={txn.name}>
                      <TableCell className="font-mono text-xs">{txn.name}</TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <div className="font-bold">{txn.posting_date}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-bold text-sm">{txn.member_name}</div>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{txn.member}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest">{txn.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            txn.type === 'Deposit'
                              ? 'font-black text-green-600 dark:text-green-400'
                              : 'font-black text-red-600 dark:text-red-400'
                          }
                        >
                          {txn.type === 'Deposit' ? '+' : '-'}{formatCurrency(txn.amount)}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm font-black italic opacity-60">
                        {txn.payment_mode}
                      </TableCell>
                      <TableCell className="font-mono text-[10px] text-muted-foreground">
                        {txn.reference_number || '-'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center text-muted-foreground">
                      No transactions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="mt-8 flex items-center justify-between border-t border-primary/5 pt-6">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Showing <span className="text-foreground text-sm font-black">{transactions.length}</span> of <span className="text-foreground text-sm font-black">{pagination.total}</span> transactions
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="font-black text-[10px] uppercase tracking-widest h-9 px-4 rounded-xl"
                onClick={() => handlePageChange(Math.max(0, pagination.limit_start - pagination.limit_page_length))}
                disabled={pagination.limit_start === 0 || isTransactionsLoading}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Prev
              </Button>
              <div className="flex items-center gap-1 font-black text-sm px-4">
                {Math.floor(pagination.limit_start / pagination.limit_page_length) + 1}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="font-black text-[10px] uppercase tracking-widest h-9 px-4 rounded-xl"
                onClick={() => handlePageChange(pagination.limit_start + pagination.limit_page_length)}
                disabled={pagination.limit_start + pagination.limit_page_length >= pagination.total || isTransactionsLoading}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <GlobalSaveModal
        open={isRecordModalOpen}
        onOpenChange={setIsRecordModalOpen}
        onSuccess={() => {
          fetchData();
          fetchTransactions(0, searchTerm);
        }}
      />
    </div>
  );
}
