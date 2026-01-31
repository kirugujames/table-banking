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

const topSavers = [
  { rank: 1, name: 'Robert Taylor', amount: '$28,450', change: '+$1,200' },
  { rank: 2, name: 'Sarah Johnson', amount: '$25,120', change: '+$950' },
  { rank: 3, name: 'Michael Chen', amount: '$22,890', change: '+$800' },
  { rank: 4, name: 'David Wilson', amount: '$21,340', change: '+$1,100' },
  { rank: 5, name: 'Alice Martinez', amount: '$19,750', change: '+$600' },
];

export function SavingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Savings & Transactions</h1>
          <p className="text-muted-foreground">Monitor savings and transaction activity</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Record Transaction
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Savings"
          value="$4.2M"
          change={{ value: '+15%', trend: 'up' }}
          icon={PiggyBank}
          iconColor="text-primary"
          iconBgColor="bg-primary/10"
        />
        <StatCard
          title="Monthly Deposits"
          value="$71,000"
          change={{ value: '+6%', trend: 'up' }}
          icon={ArrowUpCircle}
          iconColor="text-secondary"
          iconBgColor="bg-secondary/10"
        />
        <StatCard
          title="Monthly Withdrawals"
          value="$18,000"
          change={{ value: '+12%', trend: 'up' }}
          icon={ArrowDownCircle}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-100 dark:bg-amber-900/20"
        />
        <StatCard
          title="Active Savers"
          value="1,156"
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
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Legend />
                <Bar dataKey="deposits" fill="#10B981" name="Deposits" radius={[4, 4, 0, 0]} />
                <Bar dataKey="withdrawals" fill="#F59E0B" name="Withdrawals" radius={[4, 4, 0, 0]} />
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
              {topSavers.map((saver) => (
                <div key={saver.rank} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {saver.rank}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{saver.name}</p>
                    <p className="text-xs text-muted-foreground">{saver.change} this month</p>
                  </div>
                  <p className="text-sm font-semibold">{saver.amount}</p>
                </div>
              ))}
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
                {transactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell className="font-mono text-sm">{txn.id}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{txn.date}</div>
                        <div className="text-muted-foreground">{txn.time}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{txn.member}</div>
                        <div className="text-sm text-muted-foreground">{txn.memberId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{txn.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          txn.isCredit
                            ? 'font-semibold text-green-600 dark:text-green-400'
                            : 'font-semibold text-red-600 dark:text-red-400'
                        }
                      >
                        {txn.isCredit ? '+' : '-'}{txn.amount}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{txn.balanceAfter}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {txn.reference}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
