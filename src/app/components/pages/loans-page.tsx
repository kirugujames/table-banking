import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { StatusBadge } from '@/app/components/status-badge';
import { StatCard } from '@/app/components/stat-card';
import { LoanApplicationModal } from '@/app/components/loan-application-modal';
import { RecordPaymentModal } from '@/app/components/record-payment-modal';
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  CreditCard,
  TrendingUp,
  AlertCircle,
  DollarSign,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';

const loans = [
  {
    id: 'LN-001',
    memberId: 'MEM-00045',
    memberName: 'Alice Martinez',
    amount: '$15,000',
    interestRate: '12%',
    status: 'active' as const,
    approvalProgress: 100,
    purpose: 'Business Expansion',
    disbursementDate: 'Dec 15, 2025',
    dueDate: 'Dec 15, 2026',
    repaidAmount: '$6,500',
    repaymentProgress: 43,
  },
  {
    id: 'LN-002',
    memberId: 'MEM-00082',
    memberName: 'Robert Taylor',
    amount: '$8,500',
    interestRate: '10%',
    status: 'pending' as const,
    approvalProgress: 60,
    purpose: 'Education',
    disbursementDate: '-',
    dueDate: '-',
    repaidAmount: '-',
    repaymentProgress: 0,
  },
  {
    id: 'LN-003',
    memberId: 'MEM-00123',
    memberName: 'Jennifer Lee',
    amount: '$12,000',
    interestRate: '12%',
    status: 'defaulted' as const,
    approvalProgress: 100,
    purpose: 'Personal',
    disbursementDate: 'Aug 10, 2025',
    dueDate: 'Aug 10, 2026',
    repaidAmount: '$3,200',
    repaymentProgress: 27,
  },
  {
    id: 'LN-004',
    memberId: 'MEM-00156',
    memberName: 'Chris Anderson',
    amount: '$20,000',
    interestRate: '11%',
    status: 'approved' as const,
    approvalProgress: 100,
    purpose: 'Home Improvement',
    disbursementDate: 'Jan 22, 2026',
    dueDate: '-',
    repaidAmount: '-',
    repaymentProgress: 0,
  },
  {
    id: 'LN-005',
    memberId: 'MEM-00201',
    memberName: 'Patricia Brown',
    amount: '$5,000',
    interestRate: '9%',
    status: 'completed' as const,
    approvalProgress: 100,
    purpose: 'Emergency',
    disbursementDate: 'Mar 1, 2025',
    dueDate: 'Sep 1, 2025',
    repaidAmount: '$5,450',
    repaymentProgress: 100,
  },
  {
    id: 'LN-006',
    memberId: 'MEM-00178',
    memberName: 'Daniel Kim',
    amount: '$18,000',
    interestRate: '12%',
    status: 'draft' as const,
    approvalProgress: 0,
    purpose: 'Business',
    disbursementDate: '-',
    dueDate: '-',
    repaidAmount: '-',
    repaymentProgress: 0,
  },
];

export function LoansPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<typeof loans[0] | null>(null);

  const filteredLoans = loans.filter((loan) => {
    const matchesSearch =
      loan.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.memberId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus =
      statusFilter === 'all' || loan.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Loan Management</h1>
          <p className="text-muted-foreground">Track and manage all loan applications and repayments</p>
        </div>
        <Button className="gap-2" onClick={() => setIsLoanModalOpen(true)}>
          <Plus className="h-4 w-4" />
          New Loan Application
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Applications Pending"
          value="28"
          icon={AlertCircle}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-100 dark:bg-amber-900/20"
        />
        <StatCard
          title="Loans Active"
          value="342"
          change={{ value: '+8%', trend: 'up' }}
          icon={CreditCard}
          iconColor="text-primary"
          iconBgColor="bg-primary/10"
        />
        <StatCard
          title="Amount Disbursed"
          value="$2.8M"
          change={{ value: '+12%', trend: 'up' }}
          icon={DollarSign}
          iconColor="text-secondary"
          iconBgColor="bg-secondary/10"
        />
        <StatCard
          title="Default Rate"
          value="2.4%"
          change={{ value: '-0.5%', trend: 'down' }}
          icon={TrendingUp}
          iconColor="text-red-600"
          iconBgColor="bg-red-100 dark:bg-red-900/20"
        />
      </div>

      {/* Loan Status Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Loans</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="defaulted">Defaulted</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>All Loan Applications</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <div className="relative flex-1 sm:w-80">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search loans..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="defaulted">Defaulted</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
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
                      <TableHead>Loan ID</TableHead>
                      <TableHead>Member</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Interest Rate</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Repayment Progress</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLoans.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No loans found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLoans.map((loan) => (
                        <TableRow key={loan.id}>
                          <TableCell className="font-mono text-sm font-medium">{loan.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{loan.memberName}</div>
                              <div className="text-sm text-muted-foreground">{loan.memberId}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">{loan.amount}</TableCell>
                          <TableCell>{loan.interestRate}</TableCell>
                          <TableCell>
                            <StatusBadge status={loan.status} />
                          </TableCell>
                          <TableCell className="text-sm">{loan.purpose}</TableCell>
                          <TableCell>
                            <div className="space-y-2 min-w-[150px]">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">
                                  {loan.repaymentProgress}%
                                </span>
                                <span className="font-medium">{loan.repaidAmount}</span>
                              </div>
                              <Progress value={loan.repaymentProgress} className="h-2" />
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                {loan.status === 'pending' && (
                                  <>
                                    <DropdownMenuItem className="text-green-600">
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Approve Loan
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">
                                      <XCircle className="mr-2 h-4 w-4" />
                                      Reject Loan
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {loan.status === 'active' && (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedLoan(loan);
                                      setIsPaymentModalOpen(true);
                                    }}
                                  >
                                    <DollarSign className="mr-2 h-4 w-4" />
                                    Record Payment
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <LoanApplicationModal 
        open={isLoanModalOpen} 
        onOpenChange={setIsLoanModalOpen}
      />
      <RecordPaymentModal 
        open={isPaymentModalOpen} 
        onOpenChange={setIsPaymentModalOpen}
        loan={selectedLoan ? {
          id: selectedLoan.id,
          memberName: selectedLoan.memberName,
          memberId: selectedLoan.memberId,
          loanAmount: selectedLoan.amount,
          outstandingBalance: selectedLoan.amount, // You would calculate this in real scenario
          nextPaymentDue: selectedLoan.dueDate,
          monthlyPayment: '$650', // You would calculate this in real scenario
        } : null}
      />
    </div>
  );
}