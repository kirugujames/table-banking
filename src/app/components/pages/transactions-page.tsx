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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Search,
  Download,
  Filter,
  Upload,
  Eye,
  Calendar,
} from 'lucide-react';

const transactions = [
  {
    id: 'TXN-00501',
    date: 'Jan 19, 2026',
    time: '10:30 AM',
    member: 'Sarah Johnson',
    memberId: 'MEM-00045',
    type: 'Savings Deposit',
    category: 'Savings',
    amount: 1200,
    balanceAfter: 12450,
    reference: 'SAV-DEP-456',
    status: 'completed',
  },
  {
    id: 'TXN-00502',
    date: 'Jan 19, 2026',
    time: '11:15 AM',
    member: 'Michael Chen',
    memberId: 'MEM-00082',
    type: 'Loan Repayment',
    category: 'Loan',
    amount: 450,
    balanceAfter: 8920,
    reference: 'LOAN-REP-189',
    status: 'completed',
  },
  {
    id: 'TXN-00503',
    date: 'Jan 19, 2026',
    time: '02:20 PM',
    member: 'Emily Brown',
    memberId: 'MEM-00123',
    type: 'Withdrawal',
    category: 'Withdrawal',
    amount: -800,
    balanceAfter: 5340,
    reference: 'WITH-342',
    status: 'completed',
  },
  {
    id: 'TXN-00504',
    date: 'Jan 18, 2026',
    time: '09:45 AM',
    member: 'David Wilson',
    memberId: 'MEM-00156',
    type: 'Welfare Contribution',
    category: 'Welfare',
    amount: 50,
    balanceAfter: 15780,
    reference: 'WEL-CON-234',
    status: 'completed',
  },
  {
    id: 'TXN-00505',
    date: 'Jan 18, 2026',
    time: '03:30 PM',
    member: 'Jennifer Lee',
    memberId: 'MEM-00201',
    type: 'Loan Disbursement',
    category: 'Loan',
    amount: -5000,
    balanceAfter: 18200,
    reference: 'LOAN-DIS-457',
    status: 'pending',
  },
  {
    id: 'TXN-00506',
    date: 'Jan 17, 2026',
    time: '01:15 PM',
    member: 'Chris Anderson',
    memberId: 'MEM-00178',
    type: 'Savings Deposit',
    category: 'Savings',
    amount: 800,
    balanceAfter: 9200,
    reference: 'SAV-DEP-458',
    status: 'completed',
  },
];

export function TransactionsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Transactions</h1>
          <p className="text-muted-foreground">Complete transaction history and management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Import Transactions
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Today's Transactions</div>
            <div className="mt-2 text-2xl font-bold">48</div>
            <div className="mt-1 text-xs text-green-600">+12 from yesterday</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Total In</div>
            <div className="mt-2 text-2xl font-bold text-green-600">$15,240</div>
            <div className="mt-1 text-xs text-muted-foreground">Today</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Total Out</div>
            <div className="mt-2 text-2xl font-bold text-red-600">$8,350</div>
            <div className="mt-1 text-xs text-muted-foreground">Today</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Net Flow</div>
            <div className="mt-2 text-2xl font-bold text-primary">$6,890</div>
            <div className="mt-1 text-xs text-muted-foreground">Today</div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Transaction History</CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-10"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="loan">Loan</SelectItem>
                  <SelectItem value="welfare">Welfare</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all-status">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-status">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
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
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Balance After</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell className="font-mono text-sm font-medium">{txn.id}</TableCell>
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
                    <TableCell className="text-sm">{txn.type}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{txn.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          txn.amount > 0
                            ? 'font-semibold text-green-600 dark:text-green-400'
                            : 'font-semibold text-red-600 dark:text-red-400'
                        }
                      >
                        {txn.amount > 0 ? '+' : ''}${Math.abs(txn.amount).toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${txn.balanceAfter.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {txn.reference}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={txn.status === 'completed' ? 'default' : 'secondary'}
                      >
                        {txn.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
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
