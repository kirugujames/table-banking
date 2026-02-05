import { useState, useEffect, useCallback } from 'react';
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
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import {
  transactionService,
  Transaction,
  TransactionDashboardData,
  TransactionPagination
} from '@/app/lib/transaction-service';
import { TransactionDetailModal } from '@/app/components/transaction-detail-modal';

export function TransactionsPage() {
  const [dashboardData, setDashboardData] = useState<TransactionDashboardData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<TransactionPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);

  // Modal state
  const [selectedTxnId, setSelectedTxnId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filters and Pagination state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all-status');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  const handleViewDetails = (id: string) => {
    setSelectedTxnId(id);
    setIsDetailModalOpen(true);
  };

  const fetchDashboardData = async () => {
    try {
      const data = await transactionService.getTransactionDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchTransactions = useCallback(async () => {
    setTableLoading(true);
    try {
      const params = {
        limit_start: (currentPage - 1) * pageSize,
        limit_page_length: pageSize,
        search: search || undefined,
        category: category !== 'all' ? category : undefined,
        status: status !== 'all-status' ? status : undefined,
      };
      const response = await transactionService.getAllTransactions(params);
      setTransactions(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setTableLoading(false);
      setLoading(false);
    }
  }, [currentPage, search, category, status]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    setCurrentPage(1);
  };

  const totalPages = pagination ? Math.ceil(pagination.total / pageSize) : 0;

  if (loading && !dashboardData) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
            <div className="mt-2 text-2xl font-bold">
              {dashboardData?.today_transactions_amount.toLocaleString() || 0}
            </div>
            <div className="mt-1 text-xs text-green-600">Recent volume</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Total In</div>
            <div className="mt-2 text-2xl font-bold text-green-600">
              KSH {dashboardData?.total_in.toLocaleString() || 0}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Cumulative</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Total Out</div>
            <div className="mt-2 text-2xl font-bold text-red-600">
              KSH {dashboardData?.total_out.toLocaleString() || 0}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Cumulative</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Net Flow</div>
            <div className="mt-2 text-2xl font-bold text-primary">
              KSH {dashboardData?.net_flow.toLocaleString() || 0}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Overall Balance</div>
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
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Savings">Savings</SelectItem>
                  <SelectItem value="Loan Repayment">Loan Repayment</SelectItem>
                  <SelectItem value="Registration Fee">Registration Fee</SelectItem>
                  <SelectItem value="Share Capital">Share Capital</SelectItem>
                  <SelectItem value="Welfare">Welfare</SelectItem>
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-status">All Status</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            {tableLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.map((txn) => (
                    <TableRow key={txn.transaction_id}>
                      <TableCell className="font-mono text-sm font-medium">{txn.transaction_id}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{txn.date}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{txn.member_name}</div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <Badge variant={txn.type === 'In' ? 'default' : txn.type === 'Out' ? 'destructive' : 'secondary'}>
                          {txn.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{txn.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            txn.type === 'In'
                              ? 'font-semibold text-green-600 dark:text-green-400'
                              : txn.type === 'Out'
                                ? 'font-semibold text-red-600 dark:text-red-400'
                                : 'font-semibold'
                          }
                        >
                          {txn.type === 'In' ? '+' : txn.type === 'Out' ? '-' : ''}KSH {Math.abs(txn.amount).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate font-mono text-sm text-muted-foreground" title={txn.reference}>
                        {txn.reference}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={txn.status === 'Completed' ? 'default' : 'secondary'}
                        >
                          {txn.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleViewDetails(txn.transaction_id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {pagination && pagination.total > 0 && (
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Showing{' '}
                <span className="font-medium">
                  {Math.min((currentPage - 1) * pageSize + 1, pagination.total)}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, pagination.total)}
                </span>{' '}
                of <span className="font-medium">{pagination.total}</span> results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || tableLoading}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Simple pagination logic to show around current page
                    let pageNum = currentPage;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setCurrentPage(pageNum)}
                        disabled={tableLoading}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || tableLoading}
                >
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <TransactionDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        transactionId={selectedTxnId}
      />
    </div>
  );
}

