'use strict';

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
import { memberService, MemberLoan, MemberListItem } from '@/app/lib/member-service';
import { StatusBadge } from '@/app/components/status-badge';
import { Loader2, ChevronDown, ChevronRight, Calendar, Banknote, Wallet, CreditCard } from 'lucide-react';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { format } from 'date-fns';
import { LoanDetailsModal } from '@/app/components/loan-details-modal';
import { Button } from '@/app/components/ui/button';
import { Eye } from 'lucide-react';

interface MemberLoansModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    member: MemberListItem | null;
}

export function MemberLoansModal({ open, onOpenChange, member }: MemberLoansModalProps) {
    const [loans, setLoans] = useState<MemberLoan[]>([]);
    const [loading, setLoading] = useState(false);
    const [expandedLoan, setExpandedLoan] = useState<string | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);

    useEffect(() => {
        if (open && member) {
            fetchLoans();
        } else {
            setLoans([]);
            setExpandedLoan(null);
        }
    }, [open, member]);

    const fetchLoans = async () => {
        if (!member) return;
        try {
            setLoading(true);
            const data = await memberService.getMemberLoans(member.name);
            setLoans(data);
        } catch (error) {
            console.error('Error fetching member loans:', error);
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

    const toggleExpand = (loanName: string) => {
        setExpandedLoan(expandedLoan === loanName ? null : loanName);
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
                                <Wallet className="h-7 w-7" />
                            </div>
                            <div className="flex flex-col">
                                <span>Loan Accounts</span>
                                <span className="text-sm font-medium text-muted-foreground mt-1">{member?.member_name}</span>
                            </div>
                        </DialogTitle>
                        <div className="text-xs font-bold text-muted-foreground mt-4 flex items-center gap-3">
                            <Badge variant="secondary" className="font-mono px-3 py-1 rounded-full">{member?.name}</Badge>
                            <span className="uppercase tracking-widest opacity-60">Verified Member Portfolio</span>
                        </div>
                    </DialogHeader>

                    <div className="p-8 space-y-8">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 gap-4">
                                <div className="relative">
                                    <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                                    <Loader2 className="h-6 w-6 text-primary animate-pulse absolute top-3 left-3" />
                                </div>
                                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Synchronizing records...</p>
                            </div>
                        ) : loans.length === 0 ? (
                            <div className="text-center py-24 border-2 border-dashed rounded-3xl bg-muted/30">
                                <div className="bg-background w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                    <Banknote className="h-8 w-8 text-muted-foreground/50" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground">No active loans found</h3>
                                <p className="text-muted-foreground max-w-xs mx-auto mt-2">This member currently has no recorded loan applications or active accounts.</p>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {loans.map((loan) => (
                                    <div
                                        key={loan.name}
                                        className={`group rounded-none border transition-all duration-300 ${expandedLoan === loan.name
                                            ? 'ring-2 ring-primary/20 border-primary/40 shadow-xl bg-white'
                                            : 'hover:border-primary/30 hover:shadow-lg bg-white'
                                            }`}
                                    >
                                        <div
                                            className="p-5 cursor-pointer flex items-center justify-between"
                                            onClick={() => toggleExpand(loan.name)}
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className={`p-2 rounded-xl transition-all duration-300 ${expandedLoan === loan.name ? 'bg-primary text-primary-foreground rotate-90' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                                                    }`}>
                                                    <ChevronRight className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className="font-black text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">{loan.name}</div>
                                                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 mt-0.5">
                                                        <CreditCard className="h-3 w-3 opacity-60" />
                                                        {loan.loan_product}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-12 text-right">
                                                <div className="hidden sm:block">
                                                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-1 opacity-60">Principal</div>
                                                    <div className="font-mono font-black text-lg text-foreground">{formatCurrency(loan.loan_amount)}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-1 opacity-60">Balance</div>
                                                    <div className="font-mono font-black text-lg text-orange-600">{formatCurrency(loan.outstanding_balance)}</div>
                                                </div>
                                                <div className="w-28 flex justify-end">
                                                    <StatusBadge status={loan.status.toLowerCase() as any} />
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedLoanId(loan.name);
                                                        setIsDetailsModalOpen(true);
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        {expandedLoan === loan.name && (
                                            <div className="p-6 pt-0 border-t bg-white animate-in fade-in slide-in-from-top-4 duration-500">
                                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-8">
                                                    {[
                                                        { label: 'Interest Rate', value: `${loan.interest_rate}%`, sub: 'Annual Rate', color: 'text-foreground' },
                                                        { label: 'Loan Term', value: `${loan.repayment_period}`, sub: 'Months', color: 'text-foreground' },
                                                        { label: 'Total Payable', value: formatCurrency(loan.total_repayable), sub: 'Inclusive of Interest', color: 'text-primary' },
                                                        { label: 'Disbursement', value: loan.creation.split(' ')[0], sub: 'Release Date', color: 'text-foreground' }
                                                    ].map((stat, i) => (
                                                        <div key={i} className="bg-white p-4 rounded-none border shadow-sm group/stat hover:shadow-md transition-all">
                                                            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 opacity-60">{stat.label}</div>
                                                            <div className={`font-black text-2xl tracking-tighter ${stat.color}`}>{stat.value}</div>
                                                            <div className="text-[10px] font-medium text-muted-foreground mt-1">{stat.sub}</div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-4">
                                                        <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-primary whitespace-nowrap">
                                                            Repayment Schedule
                                                        </h3>
                                                        <div className="h-px w-full bg-gradient-to-r from-primary/20 to-transparent" />
                                                    </div>

                                                    <div className="rounded-none border bg-white overflow-hidden shadow-inner">
                                                        <Table>
                                                            <TableHeader className="bg-muted/40">
                                                                <TableRow className="hover:bg-transparent border-none">
                                                                    <TableHead className="text-[10px] uppercase tracking-widest font-black py-4 pl-6">#</TableHead>
                                                                    <TableHead className="text-[10px] uppercase tracking-widest font-black text-center">Due Date</TableHead>
                                                                    <TableHead className="text-right text-[10px] uppercase tracking-widest font-black">Principal</TableHead>
                                                                    <TableHead className="text-right text-[10px] uppercase tracking-widest font-black">Interest</TableHead>
                                                                    <TableHead className="text-right text-[10px] uppercase tracking-widest font-black">Total</TableHead>
                                                                    <TableHead className="text-right text-[10px] uppercase tracking-widest font-black text-primary pr-6 font-black">Balance</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {loan.repayment_schedule.map((item, index) => (
                                                                    <TableRow key={index} className="hover:bg-primary/[0.05] transition-colors border-b border-primary/5 last:border-0 group/row">
                                                                        <TableCell className="text-muted-foreground font-mono text-xs py-4 pl-6">{index + 1}</TableCell>
                                                                        <TableCell className="font-bold text-center text-xs">{item.payment_date}</TableCell>
                                                                        <TableCell className="text-right font-mono text-xs text-muted-foreground group-hover/row:text-foreground transition-colors">{formatCurrency(item.principal)}</TableCell>
                                                                        <TableCell className="text-right font-mono text-xs text-muted-foreground group-hover/row:text-foreground transition-colors">{formatCurrency(item.interest)}</TableCell>
                                                                        <TableCell className="text-right font-mono font-black text-xs">{formatCurrency(item.amount)}</TableCell>
                                                                        <TableCell className="text-right font-mono font-black text-primary text-xs pr-6">{formatCurrency(item.balance_after)}</TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <LoanDetailsModal
                    open={isDetailsModalOpen}
                    onOpenChange={setIsDetailsModalOpen}
                    loanId={selectedLoanId}
                />
            </DialogContent>
        </Dialog>
    );
}
