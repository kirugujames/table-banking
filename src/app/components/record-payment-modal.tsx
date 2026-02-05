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
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Loader2, Banknote } from 'lucide-react';
import { loanService } from '@/app/lib/loan-service';
import { toast } from 'react-hot-toast';

interface RecordPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loan?: {
    id: string;
    memberName: string;
    memberId: string;
    loanAmount: string;
    outstandingBalance: string;
  } | null;
  onSuccess?: () => void;
}

export function RecordPaymentModal({ open, onOpenChange, loan, onSuccess }: RecordPaymentModalProps) {
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('Cash');
  const [reference, setReference] = useState('');
  const [isFromSavings, setIsFromSavings] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isFromSavings) {
      setMode('Savings');
    } else if (mode === 'Savings') {
      setMode('Cash');
    }
  }, [isFromSavings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loan) return;

    if (!amount || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        loan: loan.id,
        amount: Number(amount),
        mode: isFromSavings ? 'Savings' : mode,
        reference: reference
      };

      const response = await loanService.recordLoanRepayment(payload);
      toast.success(response.message || 'Repayment recorded successfully!');

      onOpenChange(false);
      // Reset form
      setAmount('');
      setReference('');
      setIsFromSavings(false);
      setMode('Cash');

      onSuccess?.();
    } catch (error: any) {
      console.error('Repayment error:', error);
      let errorMessage = 'Failed to record repayment. Please try again.';

      const errorData = error.response?.data;
      if (errorData) {
        if (errorData._server_messages) {
          try {
            const messages = JSON.parse(errorData._server_messages);
            const parsedMessage = JSON.parse(messages[0]);
            errorMessage = parsedMessage.message;
          } catch (e) {
            console.error('Failed to parse _server_messages', e);
          }
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.exception) {
          errorMessage = errorData.exception.split(':').pop()?.trim() || errorMessage;
        }
      }

      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  if (!loan) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5" />
            Pay Loan
          </DialogTitle>
          <DialogDescription>
            Record a repayment for loan {loan.id}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="loan_id">Loan ID</Label>
            <Input
              id="loan_id"
              value={loan.id}
              disabled
              className="bg-muted font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="member">Member</Label>
            <Input
              id="member"
              value={`${loan.memberName} (${loan.memberId})`}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Repayment Amount (KES)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                KES
              </span>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-12"
                placeholder="0.00"
                required
                min="0.01"
                step="0.01"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 py-2">
            <Checkbox
              id="savings"
              checked={isFromSavings}
              onCheckedChange={(checked) => setIsFromSavings(checked as boolean)}
            />
            <Label htmlFor="savings" className="text-sm font-normal cursor-pointer text-primary font-medium">
              Pay from Savings Account
            </Label>
          </div>

          {!isFromSavings && (
            <div className="space-y-2">
              <Label htmlFor="mode">Payment Mode</Label>
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger id="mode">
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
          )}

          <div className="space-y-2">
            <Label htmlFor="reference">
              Reference Number
              {(mode !== 'Cash' && mode !== 'Savings') && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder={(mode === 'M-Pesa') ? "e.g. QWE123RTY" : "e.g. M-Pesa Code or Check No."}
              required={mode !== 'Cash' && mode !== 'Savings'}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Record Repayment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

