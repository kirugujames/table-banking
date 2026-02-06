import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  FileText,
  Download,
  Calendar,
  Printer,
  FileSpreadsheet,
} from 'lucide-react';
import { reportService, ReportData } from '@/app/lib/report-service';
import { memberService } from '@/app/lib/member-service';
import { loanService } from '@/app/lib/loan-service';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/app/components/ui/utils';


export function ReportsPage() {
  const [reportType, setReportType] = useState('profit_and_loss');
  const [fromDate, setFromDate] = useState(format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd'));
  const [toDate, setToDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>('All Accounts');
  const [selectedMember, setSelectedMember] = useState<string>('All Members');
  const [selectedLoanProduct, setSelectedLoanProduct] = useState<string>('All Products');
  const [accounts, setAccounts] = useState<{ name: string; account_name: string }[]>([]);
  const [members, setMembers] = useState<{ name: string; member_name: string }[]>([]);
  const [loanProducts, setLoanProducts] = useState<{ name: string; product_name: string }[]>([]);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [accs, mems, products] = await Promise.all([
          reportService.getAccounts().catch(() => []),
          memberService.getAllMembers().catch(() => []),
          loanService.getAllLoanProducts().catch(() => []),
        ]);
        setAccounts(accs);
        setMembers(mems);
        setLoanProducts(products);
      } catch (error) {
        console.error('Failed to load filters:', error);
      }
    };
    loadFilters();
  }, []);

  const fetchReport = async () => {
    try {
      setIsLoading(true);
      let data: ReportData | null = null;
      if (reportType === 'profit_and_loss') {
        data = await reportService.getProfitAndLoss(fromDate, toDate);
      } else if (reportType === 'balance_sheet') {
        data = await reportService.getBalanceSheet(toDate);
      } else if (reportType === 'trial_balance') {
        data = await reportService.getTrialBalance(fromDate, toDate);
      } else if (reportType === 'account_statement') {
        data = await reportService.getAccountStatement(fromDate, toDate, selectedAccount === 'All Accounts' ? undefined : selectedAccount);
      } else if (reportType === 'loan_report') {
        data = await reportService.getLoanReport(fromDate, toDate);
      } else if (reportType === 'loan_aging') {
        data = await reportService.getLoanAging(toDate);
      } else if (reportType === 'loan_ledger') {
        data = await reportService.getLoanLedger(fromDate, toDate, selectedMember === 'All Members' ? undefined : selectedMember);
      }
      setReportData(data);
      toast.success('Report generated successfully');
    } catch (error: any) {
      console.error('Error fetching report:', error);
      toast.error('Failed to generate report');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    if (!reportData) return;

    const headers = reportData.columns.filter(col => !col.hidden).map(col => col.label);
    const rows = reportData.data.map(row =>
      reportData.columns.filter(col => !col.hidden).map(col => {
        const val = row[col.fieldname];
        return typeof val === 'number' ? val.toFixed(2) : `"${val || ''}"`;
      })
    );

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${reportType}_${fromDate}_to_${toDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (value: any) => {
    if (value === null || value === undefined || value === '') return '';
    if (typeof value !== 'number') return value;
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Manage financial reports and SACCO performance metrics</p>
        </div>
      </div>

      <div className="space-y-6 pt-6">
        {/* Report Selection & Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Generate Financial Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Report" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="profit_and_loss">Profit and Loss</SelectItem>
                    <SelectItem value="balance_sheet">Balance Sheet</SelectItem>
                    <SelectItem value="trial_balance">Trial Balance</SelectItem>
                    <SelectItem value="account_statement">Account Statement</SelectItem>
                    <SelectItem value="loan_report">Loan Portfolio Report</SelectItem>
                    <SelectItem value="loan_aging">Loan Aging Report</SelectItem>
                    <SelectItem value="loan_ledger">Loan Ledger Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {reportType === 'account_statement' && (
                <div className="space-y-2">
                  <Label>Account</Label>
                  <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Accounts">All Accounts</SelectItem>
                      {accounts.map((acc) => (
                        <SelectItem key={acc.name} value={acc.name}>
                          {acc.account_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {reportType === 'loan_ledger' && (
                <div className="space-y-2">
                  <Label>Member</Label>
                  <Select value={selectedMember} onValueChange={setSelectedMember}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Member" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Members">All Members</SelectItem>
                      {members.map((mem) => (
                        <SelectItem key={mem.name} value={mem.name}>
                          {mem.member_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {reportType === 'loan_report' && (
                <div className="space-y-2">
                  <Label>Loan Product</Label>
                  <Select value={selectedLoanProduct} onValueChange={setSelectedLoanProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Products">All Products</SelectItem>
                      {loanProducts.map((p) => (
                        <SelectItem key={p.name} value={p.name}>
                          {p.product_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {reportType !== 'balance_sheet' && reportType !== 'loan_aging' && (
                <div className="space-y-2">
                  <Label>From Date</Label>
                  <Input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>To Date</Label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={fetchReport} disabled={isLoading} className="flex-1">
                  {isLoading ? 'Generating...' : 'Pull Report'}
                </Button>
                {reportData && (
                  <Button variant="outline" size="icon" onClick={handleDownloadCSV}>
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Content */}
        {reportData ? (
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30">
              <div className="space-y-1">
                <CardTitle className="text-lg">
                  {reportType === 'profit_and_loss' && 'Profit and Loss Statement'}
                  {reportType === 'balance_sheet' && 'Balance Sheet'}
                  {reportType === 'trial_balance' && 'Trial Balance'}
                  {reportType === 'account_statement' && 'Account Statement'}
                  {reportType === 'loan_report' && 'Loan Portfolio Report'}
                  {reportType === 'loan_aging' && 'Loan Aging Report'}
                  {reportType === 'loan_ledger' && 'Loan Ledger Report'}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {reportType === 'balance_sheet' || reportType === 'loan_aging'
                    ? `As of ${format(new Date(toDate), 'PPP')}`
                    : `${format(new Date(fromDate), 'PPP')} - ${format(new Date(toDate), 'PPP')}`
                  }
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2">
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadCSV} className="gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Excel
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-auto">
              <div className="min-w-[800px]">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      {reportData.columns.filter(col => !col.hidden).map((col) => (
                        <TableHead
                          key={col.fieldname}
                          className={col.fieldtype === 'Currency' ? 'text-right' : ''}
                          style={{ width: col.width }}
                        >
                          {col.label}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.data.map((row, idx) => (
                      <TableRow
                        key={idx}
                        className={row.is_group ? 'font-bold bg-muted/10' : ''}
                      >
                        {reportData.columns.filter(col => !col.hidden).map((col) => {
                          const value = row[col.fieldname];
                          const isIndented = col.fieldname === 'account' && row.indent > 0;

                          return (
                            <TableCell
                              key={col.fieldname}
                              className={col.fieldtype === 'Currency' ? 'text-right' : ''}
                              style={{
                                paddingLeft: isIndented ? `${row.indent * 1.5}rem` : undefined
                              }}
                            >
                              {col.fieldtype === 'Currency' ? formatCurrency(value) : (value || '')}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            {reportData.report_summary && (
              <div className="p-6 border-t bg-muted/5">
                <h4 className="font-semibold mb-4">Report Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {reportData.report_summary.map((item, idx) => (
                    item.type === 'separator' ? null : (
                      <div key={idx} className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase">{item.label}</p>
                        <p className={cn(
                          "text-lg font-bold",
                          item.indicator === 'Green' ? "text-emerald-600" :
                            item.indicator === 'Red' ? "text-red-600" : ""
                        )}>
                          {item.datatype === 'Currency' ? formatCurrency(item.value) : item.value}
                        </p>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-xl">
            <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">No Report Generated</h3>
            <p className="text-sm text-muted-foreground max-w-xs mt-1">
              Select a report type and date range above to pull financial data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
