import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';
import { Loader2, Receipt, Calendar, Tag, User, FileText, Banknote } from 'lucide-react';
import { expenseService, ExpenseDetails } from '@/app/lib/expense-service';
import { toast } from 'react-hot-toast';

interface ExpenseDetailModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    expenseId: string | null;
}

export function ExpenseDetailModal({ open, onOpenChange, expenseId }: ExpenseDetailModalProps) {
    const [details, setDetails] = useState<ExpenseDetails | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && expenseId) {
            fetchDetails();
        } else if (!open) {
            setDetails(null);
        }
    }, [open, expenseId]);

    const fetchDetails = async () => {
        if (!expenseId) return;
        setLoading(true);
        try {
            const data = await expenseService.getExpenseDetails(expenseId);
            setDetails(data);
        } catch (error) {
            console.error('Error fetching expense details:', error);
            toast.error('Failed to load expense details');
            onOpenChange(false);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
        }).format(amount);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Receipt className="h-5 w-5" />
                        Expense Details
                    </DialogTitle>
                    <DialogDescription>
                        Detailed information for the selected expense transaction.
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Loading details...</p>
                    </div>
                ) : details ? (
                    <div className="space-y-6 py-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Expense ID</p>
                                <p className="text-lg font-mono font-bold text-primary">{details.id}</p>
                            </div>
                            <Badge variant={details.status.toLowerCase() === 'completed' ? 'default' : 'secondary'} className="capitalize">
                                {details.status}
                            </Badge>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    <span>Date</span>
                                </div>
                                <p className="text-sm font-medium">{details.date}</p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Tag className="h-3 w-3" />
                                    <span>Category</span>
                                </div>
                                <p className="text-sm font-medium">{details.category}</p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <User className="h-3 w-3" />
                                    <span>Vendor</span>
                                </div>
                                <p className="text-sm font-medium">{details.vendor || 'N/A'}</p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <FileText className="h-3 w-3" />
                                    <span>Voucher Type</span>
                                </div>
                                <p className="text-sm font-medium">{details.voucher_type}</p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <FileText className="h-3 w-3" />
                                <span>Description</span>
                            </div>
                            <p className="text-sm bg-muted/50 p-3 rounded-md italic">
                                {details.description || 'No description provided.'}
                            </p>
                        </div>

                        <div className="pt-4 mt-4 border-t-2 border-primary/10">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Banknote className="h-5 w-5 text-red-600" />
                                    <span className="font-bold text-muted-foreground">Amount Paid</span>
                                </div>
                                <span className="text-2xl font-black text-red-600">
                                    {formatCurrency(details.amount)}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-12 text-center text-muted-foreground">
                        No expense data found.
                    </div>
                )}

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                    <Button
                        type="button"
                        variant="default"
                        className="w-full sm:w-auto gap-2"
                    >
                        <Banknote className="h-4 w-4" />
                        Print Receipt
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
