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
import { Textarea } from '@/app/components/ui/textarea';
import { Receipt, Loader2, Banknote } from 'lucide-react';
import { expenseService } from '@/app/lib/expense-service';
import { toast } from 'react-hot-toast';

interface RecordExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function RecordExpenseModal({ open, onOpenChange, onSuccess }: RecordExpenseModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expenseAccounts, setExpenseAccounts] = useState<{ name: string; account_name: string }[]>([]);
  const [formData, setFormData] = useState({
    expense_account: '',
    amount: '',
    vendor_name: '',
    description: '',
    mode_of_payment: 'Cash',
  });

  useEffect(() => {
    if (open) {
      fetchAccounts();
    }
  }, [open]);

  const fetchAccounts = async () => {
    try {
      const accounts = await expenseService.getExpenseAccounts();
      setExpenseAccounts(accounts);
    } catch (error) {
      console.error('Error fetching expense accounts:', error);
      toast.error('Failed to load expense categories');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!formData.expense_account) {
      toast.error('Please select an expense account');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await expenseService.recordExpense({
        amount: Number(formData.amount),
        expense_account: formData.expense_account,
        description: formData.description,
        mode_of_payment: formData.mode_of_payment,
        vendor_name: formData.vendor_name,
      });

      if (result.status === 'success') {
        toast.success(result.message || 'Expense recorded successfully');
        onOpenChange(false);
        onSuccess?.();

        // Reset form
        setFormData({
          expense_account: '',
          amount: '',
          vendor_name: '',
          description: '',
          mode_of_payment: 'Cash',
        });
      }
    } catch (error: any) {
      console.error('Error recording expense:', error);
      const errorMsg = error.response?.data?.message || 'Failed to record expense';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl lg:max-w-[50vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Receipt className="h-6 w-6 text-primary" />
            Record New Expense
          </DialogTitle>
          <DialogDescription>
            Enter the details below to record a new business expense.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category / Account */}
            <div className="space-y-2">
              <Label htmlFor="expense_account" className="text-sm font-semibold">Expense Category *</Label>
              <Select
                value={formData.expense_account}
                onValueChange={(value) => handleChange('expense_account', value)}
              >
                <SelectTrigger id="expense_account" className="h-11">
                  <SelectValue placeholder="Select expense category" />
                </SelectTrigger>
                <SelectContent>
                  {expenseAccounts.map((acc) => (
                    <SelectItem key={acc.name} value={acc.account_name}>
                      {acc.account_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-semibold">Amount (KES) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">KES</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-12 h-11"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  required
                  min="0.01"
                  step="0.01"
                />
              </div>
            </div>

            {/* Vendor */}
            <div className="space-y-2">
              <Label htmlFor="vendor_name" className="text-sm font-semibold">Vendor / Payee *</Label>
              <Input
                id="vendor_name"
                placeholder="Who was paid?"
                className="h-11"
                value={formData.vendor_name}
                onChange={(e) => handleChange('vendor_name', e.target.value)}
                required
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="mode_of_payment" className="text-sm font-semibold">Payment Mode *</Label>
              <Select
                value={formData.mode_of_payment}
                onValueChange={(value) => handleChange('mode_of_payment', value)}
              >
                <SelectTrigger id="mode_of_payment" className="h-11">
                  <SelectValue placeholder="How was it paid?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description" className="text-sm font-semibold">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the purpose of this expense..."
                className="min-h-[100px] resize-none"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-6 border-t pt-6">
            <Button
              type="button"
              variant="outline"
              className="h-11 px-8"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="h-11 px-8 gap-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Banknote className="h-4 w-4" />
              )}
              {isSubmitting ? 'Recording...' : 'Save Expense'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
