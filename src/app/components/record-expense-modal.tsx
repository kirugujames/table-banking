import { useState } from 'react';
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
import { Switch } from '@/app/components/ui/switch';
import { Receipt, Loader2, Upload } from 'lucide-react';

interface RecordExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecordExpenseModal({ open, onOpenChange }: RecordExpenseModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    vendor: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: '',
    referenceNumber: '',
    isRecurring: false,
    receiptFile: null as File | null,
  });

  const expenseCategories = [
    'Salaries',
    'Rent',
    'Utilities',
    'Marketing',
    'Supplies',
    'Insurance',
    'Maintenance',
    'Transportation',
    'Legal & Professional',
    'Other',
  ];

  const paymentMethods = [
    'Cash',
    'Bank Transfer',
    'Cheque',
    'Mobile Money',
    'Credit Card',
  ];

  const handleChange = (field: string, value: string | boolean | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleChange('receiptFile', file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    console.log('New expense recorded:', formData);
    setIsSubmitting(false);
    onOpenChange(false);
    
    // Reset form
    setFormData({
      category: '',
      amount: '',
      vendor: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: '',
      referenceNumber: '',
      isRecurring: false,
      receiptFile: null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Record New Expense
          </DialogTitle>
          <DialogDescription>
            Enter the expense details to record it in the system.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Expense Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((cat) => (
                      <SelectItem key={cat} value={cat.toLowerCase()}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor/Payee *</Label>
                <Input
                  id="vendor"
                  placeholder="Enter vendor name"
                  value={formData.vendor}
                  onChange={(e) => handleChange('vendor', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Expense Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Enter a detailed description of the expense"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  required
                  rows={3}
                />
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Payment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method *</Label>
                  <Select 
                    value={formData.paymentMethod} 
                    onValueChange={(value) => handleChange('paymentMethod', value)}
                  >
                    <SelectTrigger id="paymentMethod">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method.toLowerCase().replace(' ', '-')}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referenceNumber">Reference/Transaction Number</Label>
                  <Input
                    id="referenceNumber"
                    placeholder="Enter reference number"
                    value={formData.referenceNumber}
                    onChange={(e) => handleChange('referenceNumber', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Receipt Upload */}
            <div className="space-y-2">
              <Label htmlFor="receipt">Upload Receipt/Invoice</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="receipt"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
              {formData.receiptFile && (
                <p className="text-xs text-muted-foreground">
                  Selected: {formData.receiptFile.name}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Accepted formats: JPG, PNG, PDF (Max 5MB)
              </p>
            </div>

            {/* Recurring Expense */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="isRecurring">Recurring Expense</Label>
                <p className="text-sm text-muted-foreground">
                  Mark if this is a recurring monthly expense
                </p>
              </div>
              <Switch
                id="isRecurring"
                checked={formData.isRecurring}
                onCheckedChange={(checked) => handleChange('isRecurring', checked)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Recording...' : 'Record Expense'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
