import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/app/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/app/components/ui/select';
import { toast } from 'react-hot-toast';
import { MemberListItem } from '@/app/lib/member-service';
import { Loader2 } from 'lucide-react';

interface LoanRepaymentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    member: MemberListItem | null;
    onSuccess?: () => void;
}

export function LoanRepaymentModal({
    open,
    onOpenChange,
    member,
    onSuccess,
}: LoanRepaymentModalProps) {
    const [amount, setAmount] = useState('');
    const [mode, setMode] = useState('Cash');
    const [reference, setReference] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRepayment = async () => {
        if (!member) return;

        if (!amount || Number(amount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        setLoading(true);
        try {
            // TODO: Implement loan repayment API call
            // await loanService.recordRepayment(member.name, Number(amount), mode, reference);

            // Placeholder success
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Loan repayment recorded successfully!');
            onOpenChange(false);
            setAmount('');
            setReference('');
            onSuccess?.();
        } catch (error: any) {
            console.error('Repayment error:', error);
            let errorMessage = 'Failed to record repayment. Please try again.';
            if (error?.response?.data?.exception) {
                const exceptionMsg = error.response.data.exception;
                const match = exceptionMsg.match(/ValidationError: (.+?)(?:"|$)/);
                if (match && match[1]) {
                    errorMessage = match[1];
                }
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!member) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Record Loan Repayment</DialogTitle>
                    <DialogDescription>
                        Record a loan repayment for {member.member_name}.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Member ID:</span>
                        <span className="font-mono">{member.name}</span>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="repayment_amount">Repayment Amount (KES)</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                                KES
                            </span>
                            <Input
                                id="repayment_amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="pl-12"
                                placeholder="Enter amount"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="payment_mode">Payment Method</Label>
                        <Select value={mode} onValueChange={setMode}>
                            <SelectTrigger id="payment_mode">
                                <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Cash">Cash</SelectItem>
                                <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                <SelectItem value="Cheque">Cheque</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="payment_reference">Reference Number (Optional)</Label>
                        <Input
                            id="payment_reference"
                            type="text"
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            placeholder="Enter transaction reference"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleRepayment} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Record Repayment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
