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
import { LoanDetailsModal } from '@/app/components/loan-details-modal';
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
  Banknote,
  Send,
  Wallet,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

import { useEffect, useState } from 'react';
import { loanService, type LoanDashboardStats } from '@/app/lib/loan-service';
import { toast } from 'react-hot-toast';



export function LoansPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [dashboardStats, setDashboardStats] = useState<LoanDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({ limit_start: 0, limit_page_length: 7, total: 0 });
  const [isAppsLoading, setIsAppsLoading] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, searchQuery, pagination.limit_start]);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      const data = await loanService.getLoanDashboard();
      setDashboardStats(data);
    } catch (error) {
      console.error('Error fetching loan dashboard stats:', error);
      toast.error('Failed to load loan statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setIsAppsLoading(true);
      const isMemberId = searchQuery.startsWith('MEM-');
      const isLoanId = searchQuery.startsWith('LN-');

      const params: any = {
        limit_start: pagination.limit_start,
        limit_page_length: pagination.limit_page_length,
      };

      if (statusFilter !== 'all') {
        params.status = statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1);
      }
      if (searchQuery) {
        if (isMemberId) params.member_id = searchQuery;
        else if (isLoanId) params.loan_id = searchQuery;
        else params.member_name = searchQuery;
      }

      const response = await loanService.getLoanApplications(params);
      setApplications(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching loan applications:', error);
      toast.error('Failed to load loan applications');
    } finally {
      setIsAppsLoading(false);
    }
  };

  const handleLoanAction = async (action: 'submit' | 'approve' | 'disburse', loanId: string) => {
    try {
      setIsAppsLoading(true);
      let response;
      if (action === 'submit') {
        response = await loanService.submitLoanApplication(loanId);
      } else if (action === 'approve') {
        response = await loanService.approveLoanApplication(loanId);
      } else if (action === 'disburse') {
        response = await loanService.disburseLoan(loanId);
      }

      if (response && (response.status === 'success' || response.status === 'ok')) {
        toast.success(response.message || `Loan ${action}ed successfully`);
        fetchApplications();
        fetchDashboardStats();
      }
    } catch (error: any) {
      console.error(`Error performing ${action} on loan:`, error);
      toast.error(error.message || `Failed to ${action} loan`);
    } finally {
      setIsAppsLoading(false);
    }
  };

  const handlePageChange = (newStart: number) => {
    setPagination((prev: any) => ({ ...prev, limit_start: newStart }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(amount);
  };



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
          value={isLoading ? "..." : dashboardStats?.total_pending_applications.toString() || "0"}
          icon={AlertCircle}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-100 dark:bg-amber-900/20"
        />
        <StatCard
          title="Loans Active"
          value={isLoading ? "..." : dashboardStats?.active_loans_count.toString() || "0"}
          icon={CreditCard}
          iconColor="text-primary"
          iconBgColor="bg-primary/10"
        />
        <StatCard
          title="Total Active Amount"
          value={isLoading ? "..." : formatCurrency(dashboardStats?.active_loans_amount || 0)}
          icon={Banknote}
          iconColor="text-secondary"
          iconBgColor="bg-secondary/10"
        />
        <StatCard
          title="Default Rate"
          value={isLoading ? "..." : `${(dashboardStats?.default_rate || 0).toFixed(1)}%`}
          icon={TrendingUp}
          iconColor="text-red-600"
          iconBgColor="bg-red-100 dark:bg-red-900/20"
        />
      </div>


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
                {isAppsLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        <span>Loading applications...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : applications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No loans found
                    </TableCell>
                  </TableRow>
                ) : (
                  applications.map((loan) => (
                    <TableRow key={loan.loan_id}>
                      <TableCell className="font-mono text-sm font-medium">{loan.loan_id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{loan.member_name || 'N/A'}</div>
                          <div className="text-sm text-muted-foreground">{loan.member_id}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">{formatCurrency(loan.amount_applied)}</TableCell>
                      <TableCell>{loan.interest_rate}%</TableCell>
                      <TableCell>
                        <StatusBadge status={loan.status.toLowerCase()} />
                      </TableCell>
                      <TableCell className="text-sm">{loan.purpose || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="space-y-2 min-w-[150px]">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground whitespace-nowrap">
                              Progress: {loan.payment_progress}%
                            </span>
                          </div>
                          <Progress value={loan.payment_progress} className="h-2" />
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
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedLoanId(loan.loan_id);
                                setIsDetailsModalOpen(true);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>

                            {loan.status.toLowerCase() === 'draft' && (
                              <DropdownMenuItem
                                onClick={() => handleLoanAction('submit', loan.loan_id)}
                                className="text-primary font-medium"
                              >
                                <Send className="mr-2 h-4 w-4" />
                                Submit Application
                              </DropdownMenuItem>
                            )}

                            {['pending approval', 'pending'].includes(loan.status.toLowerCase()) && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleLoanAction('approve', loan.loan_id)}
                                  className="text-green-600 font-medium"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve Loan
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject Loan
                                </DropdownMenuItem>
                              </>
                            )}

                            {loan.status.toLowerCase() === 'approved' && (
                              <DropdownMenuItem
                                onClick={() => handleLoanAction('disburse', loan.loan_id)}
                                className="text-secondary font-medium"
                              >
                                <Wallet className="mr-2 h-4 w-4" />
                                Disburse Loan
                              </DropdownMenuItem>
                            )}

                            {loan.status.toLowerCase() === 'active' && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedLoan(loan);
                                  setIsPaymentModalOpen(true);
                                }}
                              >
                                <Banknote className="mr-2 h-4 w-4" />
                                Pay Loan
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

          {/* Pagination Controls */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {pagination.limit_start + 1} to {Math.min(pagination.limit_start + pagination.limit_page_length, pagination.total)} of {pagination.total} entries
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.limit_start === 0 || isAppsLoading}
                onClick={() => handlePageChange(Math.max(0, pagination.limit_start - pagination.limit_page_length))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.limit_start + pagination.limit_page_length >= pagination.total || isAppsLoading}
                onClick={() => handlePageChange(pagination.limit_start + pagination.limit_page_length)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Modals */}
      <LoanApplicationModal
        open={isLoanModalOpen}
        onOpenChange={setIsLoanModalOpen}
      />
      <LoanDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        loanId={selectedLoanId}
      />
      <RecordPaymentModal
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        onSuccess={() => {
          fetchApplications();
          fetchDashboardStats();
        }}
        loan={selectedLoan ? {
          id: selectedLoan.loan_id,
          memberName: selectedLoan.member_name,
          memberId: selectedLoan.member_id,
          loanAmount: formatCurrency(selectedLoan.total_repayable || selectedLoan.amount_applied),
          outstandingBalance: formatCurrency(selectedLoan.outstanding_balance || 0),
        } : null}
      />
    </div>
  );
}