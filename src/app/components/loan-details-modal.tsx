import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/app/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import { loanService, LoanApplication } from '@/app/lib/loan-service';
import { StatusBadge } from '@/app/components/status-badge';
import { Loader2, Banknote, Calendar, CreditCard, Info, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface LoanDetailsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    loanId: string | null;
}

export function LoanDetailsModal({ open, onOpenChange, loanId }: LoanDetailsModalProps) {
    const [loan, setLoan] = useState<LoanApplication | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && loanId) {
            fetchLoanDetails();
        } else {
            setLoan(null);
        }
    }, [open, loanId]);

    const fetchLoanDetails = async () => {
        if (!loanId) return;
        try {
            setLoading(true);
            const data = await loanService.getLoanApplicationById(loanId);
            setLoan(data);
        } catch (error) {
            console.error('Error fetching loan details:', error);
            toast.error('Failed to load loan details');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return 'KSh ' + new Intl.NumberFormat('en-KE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl lg:max-w-[60vw] max-h-[90vh] overflow-y-auto p-0 border-none bg-transparent shadow-2xl [&>button:last-child]:top-10 [&>button:last-child]:right-10 [&>button:last-child]:bg-white/50 [&>button:last-child]:backdrop-blur-sm [&>button:last-child]:rounded-full [&>button:last-child]:p-2">
                <div className="bg-background rounded-2xl border shadow-2xl flex flex-col overflow-hidden m-4">
                    <DialogHeader className="p-8 bg-white border-b relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Banknote className="h-24 w-24 -rotate-12" />
                        </div>
                        <DialogTitle className="text-3xl font-extrabold flex items-center gap-4 text-foreground">
                            <div className="bg-primary p-3 rounded-2xl text-primary-foreground shadow-lg shadow-primary/20">
                                <Info className="h-7 w-7" />
                            </div>
                            <div className="flex flex-col text-left">
                                <span>Loan Details {loan ? `- ${loan.member_name}` : ''}</span>
                                <span className="text-sm font-medium text-muted-foreground mt-1">
                                    {loading ? 'Loading...' : loan ? loan.loan_id || (loan as any).name : 'No loan selected'}
                                </span>
                            </div>
                        </DialogTitle>
                        {loan && (
                            <div className="text-xs font-bold text-muted-foreground mt-4 flex items-center gap-3">
                                <Badge variant="secondary" className="font-mono px-3 py-1 rounded-full">{loan.status}</Badge>
                                <span className="uppercase tracking-widest opacity-60">Status: {loan.status}</span>
                            </div>
                        )}
                    </DialogHeader>

                    <div className="p-8 space-y-8">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 gap-4">
                                <div className="relative">
                                    <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                                    <Loader2 className="h-6 w-6 text-primary animate-pulse absolute top-3 left-3" />
                                </div>
                                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Fetching details...</p>
                            </div>
                        ) : !loan ? (
                            <div className="text-center py-24 border-2 border-dashed rounded-3xl bg-muted/30">
                                <Info className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-foreground">No data found</h3>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* Info Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                                        <div className="flex items-center gap-3 text-primary">
                                            <User className="h-5 w-5" />
                                            <h4 className="font-black text-[10px] uppercase tracking-widest">Member Information</h4>
                                        </div>
                                        <div>
                                            <div className="text-lg font-black text-foreground">{loan.member_name}</div>
                                            <div className="text-xs font-medium text-muted-foreground">{loan.member_id || (loan as any).member}</div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                                        <div className="flex items-center gap-3 text-primary">
                                            <CreditCard className="h-5 w-5" />
                                            <h4 className="font-black text-[10px] uppercase tracking-widest">Loan Product</h4>
                                        </div>
                                        <div>
                                            <div className="text-lg font-black text-foreground">{loan.loan_product}</div>
                                            <div className="text-xs font-medium text-muted-foreground">{loan.interest_rate}% Interest Rate</div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                                        <div className="flex items-center gap-3 text-primary">
                                            <Calendar className="h-5 w-5" />
                                            <h4 className="font-black text-[10px] uppercase tracking-widest">Terms</h4>
                                        </div>
                                        <div>
                                            <div className="text-lg font-black text-foreground">{loan.repayment_period} Months</div>
                                            <div className="text-xs font-medium text-muted-foreground">Repayment Period</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Financials Card */}
                                <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 grid grid-cols-2 lg:grid-cols-4 gap-8">
                                    {[
                                        { label: 'Loan Amount', value: formatCurrency(loan.amount_applied || (loan as any).loan_amount), color: 'text-foreground' },
                                        { label: 'Total Repayable', value: formatCurrency(loan.total_repayable || 0), color: 'text-primary' },
                                        { label: 'Outstanding Balance', value: formatCurrency(loan.outstanding_balance || 0), color: 'text-orange-600' },
                                        { label: 'Repayment Progress', value: `${loan.payment_progress || 0}%`, color: 'text-primary' },
                                    ].map((stat, i) => (
                                        <div key={i} className="space-y-1">
                                            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">{stat.label}</div>
                                            <div className={`text-2xl font-black tracking-tighter ${stat.color}`}>{stat.value}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Repayment Schedule */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-primary whitespace-nowrap">
                                            Repayment Schedule
                                        </h3>
                                        <div className="h-px w-full bg-gradient-to-r from-primary/20 to-transparent" />
                                    </div>

                                    <div className="rounded-2xl border bg-white overflow-hidden shadow-sm">
                                        <Table>
                                            <TableHeader className="bg-muted/40">
                                                <TableRow className="hover:bg-transparent border-none">
                                                    <TableHead className="text-[10px] uppercase tracking-widest font-black py-4 pl-6">#</TableHead>
                                                    <TableHead className="text-[10px] uppercase tracking-widest font-black text-center">Due Date</TableHead>
                                                    <TableHead className="text-right text-[10px] uppercase tracking-widest font-black">Principal</TableHead>
                                                    <TableHead className="text-right text-[10px] uppercase tracking-widest font-black">Interest</TableHead>
                                                    <TableHead className="text-right text-[10px] uppercase tracking-widest font-black">Total</TableHead>
                                                    <TableHead className="text-right text-[10px] uppercase tracking-widest font-black text-primary pr-6">Balance After</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {loan.repayment_schedule && loan.repayment_schedule.length > 0 ? (
                                                    loan.repayment_schedule.map((item, index) => (
                                                        <TableRow key={index} className="hover:bg-primary/[0.05] transition-colors border-b border-primary/5 last:border-0 group/row">
                                                            <TableCell className="text-muted-foreground font-mono text-xs py-4 pl-6">{index + 1}</TableCell>
                                                            <TableCell className="font-bold text-center text-xs">{item.payment_date}</TableCell>
                                                            <TableCell className="text-right font-mono text-xs text-muted-foreground group-hover/row:text-foreground transition-colors">{formatCurrency(item.principal)}</TableCell>
                                                            <TableCell className="text-right font-mono text-xs text-muted-foreground group-hover/row:text-foreground transition-colors">{formatCurrency(item.interest)}</TableCell>
                                                            <TableCell className="text-right font-mono font-black text-xs">{formatCurrency(item.amount)}</TableCell>
                                                            <TableCell className="text-right font-mono font-black text-primary text-xs pr-6">{formatCurrency(item.balance_after)}</TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                                            No repayment schedule available
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
