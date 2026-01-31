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
import { Separator } from '@/app/components/ui/separator';
import { CreditCard, Loader2, Calculator } from 'lucide-react';

interface LoanApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoanApplicationModal({ open, onOpenChange }: LoanApplicationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    memberSearch: '',
    loanType: '',
    amount: '',
    purpose: '',
    repaymentPeriod: '',
    guarantor1Name: '',
    guarantor1MemberId: '',
    guarantor2Name: '',
    guarantor2MemberId: '',
    collateralType: '',
    collateralValue: '',
    collateralDescription: '',
  });

  const [calculatedValues, setCalculatedValues] = useState({
    interestRate: 0,
    monthlyPayment: 0,
    totalRepayable: 0,
    processingFee: 0,
  });

  const loanTypes = [
    { value: 'personal', label: 'Personal Loan', rate: 12 },
    { value: 'business', label: 'Business Loan', rate: 10 },
    { value: 'emergency', label: 'Emergency Loan', rate: 9 },
    { value: 'education', label: 'Education Loan', rate: 8 },
  ];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Calculate loan estimates when relevant fields change
    if (field === 'amount' || field === 'repaymentPeriod' || field === 'loanType') {
      calculateLoan({
        ...formData,
        [field]: value,
      });
    }
  };

  const calculateLoan = (data: typeof formData) => {
    const amount = parseFloat(data.amount) || 0;
    const period = parseInt(data.repaymentPeriod) || 1;
    const selectedLoan = loanTypes.find((lt) => lt.value === data.loanType);
    const rate = selectedLoan ? selectedLoan.rate / 100 : 0.12;
    
    const monthlyRate = rate / 12;
    const processingFee = amount * 0.02; // 2% processing fee
    
    // Calculate monthly payment using loan amortization formula
    const monthlyPayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, period)) / 
                          (Math.pow(1 + monthlyRate, period) - 1);
    
    const totalRepayable = monthlyPayment * period;
    
    setCalculatedValues({
      interestRate: rate * 100,
      monthlyPayment: isFinite(monthlyPayment) ? monthlyPayment : 0,
      totalRepayable: isFinite(totalRepayable) ? totalRepayable : 0,
      processingFee,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    console.log('New loan application:', formData, calculatedValues);
    setIsSubmitting(false);
    onOpenChange(false);
    
    // Reset form
    setFormData({
      memberSearch: '',
      loanType: '',
      amount: '',
      purpose: '',
      repaymentPeriod: '',
      guarantor1Name: '',
      guarantor1MemberId: '',
      guarantor2Name: '',
      guarantor2MemberId: '',
      collateralType: '',
      collateralValue: '',
      collateralDescription: '',
    });
    setCalculatedValues({
      interestRate: 0,
      monthlyPayment: 0,
      totalRepayable: 0,
      processingFee: 0,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            New Loan Application
          </DialogTitle>
          <DialogDescription>
            Complete the loan application form. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* Member Selection */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Member Information</h3>
              <div className="space-y-2">
                <Label htmlFor="memberSearch">Search Member *</Label>
                <Input
                  id="memberSearch"
                  placeholder="Search by name, member ID, or email"
                  value={formData.memberSearch}
                  onChange={(e) => handleChange('memberSearch', e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Start typing to search for existing members
                </p>
              </div>
            </div>

            <Separator />

            {/* Loan Details */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Loan Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="loanType">Loan Type *</Label>
                  <Select value={formData.loanType} onValueChange={(value) => handleChange('loanType', value)}>
                    <SelectTrigger id="loanType">
                      <SelectValue placeholder="Select loan type" />
                    </SelectTrigger>
                    <SelectContent>
                      {loanTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label} ({type.rate}% interest)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Loan Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => handleChange('amount', e.target.value)}
                    required
                    min="1000"
                    max="50000"
                  />
                  <p className="text-xs text-muted-foreground">
                    Min: $1,000 | Max: $50,000
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="repaymentPeriod">Repayment Period (months) *</Label>
                  <Select 
                    value={formData.repaymentPeriod} 
                    onValueChange={(value) => handleChange('repaymentPeriod', value)}
                  >
                    <SelectTrigger id="repaymentPeriod">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 months</SelectItem>
                      <SelectItem value="12">12 months</SelectItem>
                      <SelectItem value="18">18 months</SelectItem>
                      <SelectItem value="24">24 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="purpose">Loan Purpose *</Label>
                  <Textarea
                    id="purpose"
                    placeholder="Describe the purpose of this loan"
                    value={formData.purpose}
                    onChange={(e) => handleChange('purpose', e.target.value)}
                    required
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Loan Calculation Summary */}
            {formData.amount && formData.loanType && formData.repaymentPeriod && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Calculator className="h-4 w-4 text-primary" />
                    <h4 className="text-sm font-semibold">Loan Calculation Summary</h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Interest Rate</p>
                      <p className="text-lg font-semibold">{calculatedValues.interestRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Processing Fee</p>
                      <p className="text-lg font-semibold">
                        ${calculatedValues.processingFee.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Monthly Payment</p>
                      <p className="text-lg font-semibold text-primary">
                        ${calculatedValues.monthlyPayment.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Repayable</p>
                      <p className="text-lg font-semibold">
                        ${calculatedValues.totalRepayable.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Separator />

            {/* Guarantors */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Guarantors (Required: 2)</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guarantor1Name">Guarantor 1 Name *</Label>
                    <Input
                      id="guarantor1Name"
                      placeholder="Enter guarantor name"
                      value={formData.guarantor1Name}
                      onChange={(e) => handleChange('guarantor1Name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guarantor1MemberId">Guarantor 1 Member ID *</Label>
                    <Input
                      id="guarantor1MemberId"
                      placeholder="MEM-00000"
                      value={formData.guarantor1MemberId}
                      onChange={(e) => handleChange('guarantor1MemberId', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guarantor2Name">Guarantor 2 Name *</Label>
                    <Input
                      id="guarantor2Name"
                      placeholder="Enter guarantor name"
                      value={formData.guarantor2Name}
                      onChange={(e) => handleChange('guarantor2Name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guarantor2MemberId">Guarantor 2 Member ID *</Label>
                    <Input
                      id="guarantor2MemberId"
                      placeholder="MEM-00000"
                      value={formData.guarantor2MemberId}
                      onChange={(e) => handleChange('guarantor2MemberId', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Collateral (Optional) */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Collateral (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="collateralType">Collateral Type</Label>
                  <Select 
                    value={formData.collateralType} 
                    onValueChange={(value) => handleChange('collateralType', value)}
                  >
                    <SelectTrigger id="collateralType">
                      <SelectValue placeholder="Select collateral type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="property">Property/Land</SelectItem>
                      <SelectItem value="vehicle">Vehicle</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="shares">Company Shares</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collateralValue">Estimated Value</Label>
                  <Input
                    id="collateralValue"
                    type="number"
                    placeholder="0.00"
                    value={formData.collateralValue}
                    onChange={(e) => handleChange('collateralValue', e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="collateralDescription">Description</Label>
                  <Textarea
                    id="collateralDescription"
                    placeholder="Describe the collateral"
                    value={formData.collateralDescription}
                    onChange={(e) => handleChange('collateralDescription', e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
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
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
