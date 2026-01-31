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
import { Card, CardContent } from '@/app/components/ui/card';
import { DollarSign, Loader2, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/app/components/ui/alert';

interface RecordPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loan?: {
    id: string;
    memberName: string;
    memberId: string;
    loanAmount: string;
    outstandingBalance: string;
    nextPaymentDue: string;
    monthlyPayment: string;
  } | null;
}

export function RecordPaymentModal({ open, onOpenChange, loan }: RecordPaymentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    paymentAmount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: '',
    referenceNumber: '',
    penaltyAmount: '',
    notes: '',
  });

  const paymentMethods = [
    'Cash',
    'Bank Transfer',
    'Cheque',
    'Mobile Money',
    'Direct Debit',
  ];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    console.log('Payment recorded:', { ...formData, loanId: loan?.id });
    setIsSubmitting(false);
    onOpenChange(false);
    
    // Reset form
    setFormData({
      paymentAmount: '',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: '',
      referenceNumber: '',
      penaltyAmount: '',
      notes: '',
    });
  };

  const calculateNewBalance = () => {
    if (!loan) return '0.00';
    const outstanding = parseFloat(loan.outstandingBalance.replace(/[$,]/g, '')) || 0;
    const payment = parseFloat(formData.paymentAmount) || 0;
    const penalty = parseFloat(formData.penaltyAmount) || 0;
    return (outstanding - payment + penalty).toFixed(2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Record Loan Payment
          </DialogTitle>
          <DialogDescription>
            Record a payment for this loan. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        
        {loan && (
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Loan ID</p>
                  <p className="font-mono font-medium">{loan.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Member</p>
                  <p className="font-medium">{loan.memberName}</p>
                  <p className="text-xs text-muted-foreground">{loan.memberId}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Outstanding Balance</p>
                  <p className="text-lg font-semibold text-red-600">{loan.outstandingBalance}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Monthly Payment</p>
                  <p className="text-lg font-semibold">{loan.monthlyPayment}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* Payment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentAmount">Payment Amount *</Label>
                <Input
                  id="paymentAmount"
                  type="number"
                  placeholder="0.00"
                  value={formData.paymentAmount}
                  onChange={(e) => handleChange('paymentAmount', e.target.value)}
                  required
                  min="0"
                  step="0.01"
                />
                {loan && (
                  <p className="text-xs text-muted-foreground">
                    Suggested: {loan.monthlyPayment}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentDate">Payment Date *</Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) => handleChange('paymentDate', e.target.value)}
                  required
                />
              </div>

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
                <Label htmlFor="referenceNumber">Transaction Reference</Label>
                <Input
                  id="referenceNumber"
                  placeholder="Enter transaction reference"
                  value={formData.referenceNumber}
                  onChange={(e) => handleChange('referenceNumber', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="penaltyAmount">Late Payment Penalty (if any)</Label>
                <Input
                  id="penaltyAmount"
                  type="number"
                  placeholder="0.00"
                  value={formData.penaltyAmount}
                  onChange={(e) => handleChange('penaltyAmount', e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes about this payment"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
              />
            </div>

            {/* Payment Summary */}
            {formData.paymentAmount && loan && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Payment Amount:</span>
                      <span className="font-semibold text-green-600">
                        ${parseFloat(formData.paymentAmount).toFixed(2)}
                      </span>
                    </div>
                    {formData.penaltyAmount && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Late Penalty:</span>
                        <span className="font-semibold text-red-600">
                          +${parseFloat(formData.penaltyAmount).toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm font-semibold">New Balance:</span>
                      <span className="font-bold text-lg">
                        ${calculateNewBalance()}
                      </span>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
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
              {isSubmitting ? 'Recording...' : 'Record Payment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
