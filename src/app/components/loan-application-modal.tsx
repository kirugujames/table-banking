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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { CreditCard, Loader2, Calculator, Plus, Trash2 } from 'lucide-react';
import { memberService } from '@/app/lib/member-service';
import { loanService } from '@/app/lib/loan-service';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';

interface LoanApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Guarantor {
  member: string;
  amount: number;
}

export function LoanApplicationModal({ open, onOpenChange }: LoanApplicationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [loanProducts, setLoanProducts] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    member: '',
    loanType: '',
    amount: '',
    purpose: '',
    repaymentPeriod: '',
    // Guarantors will now be managed in a separate state
    selectedGuarantor: '',
  });

  const [guarantors, setGuarantors] = useState<Guarantor[]>([]);

  const [calculatedValues, setCalculatedValues] = useState({
    interestRate: 0,
    monthlyPayment: 0,
    totalRepayable: 0,
    processingFee: 0,
  });

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const [membersData, productsData] = await Promise.all([
            memberService.getAllMembers(),
            loanService.getAllLoanProducts()
          ]);
          setMembers(membersData);
          setLoanProducts(productsData);
        } catch (error) {
          console.error('Error fetching data:', error);
          toast.error('Failed to load form data');
        }
      };
      fetchData();
    }
  }, [open]);

  const handleChange = (field: string, value: string) => {
    let finalValue = value;

    // Validation for repayment period
    if (field === 'repaymentPeriod' && formData.loanType) {
      const selectedProduct = loanProducts.find(lp => lp.name === formData.loanType);
      if (selectedProduct && parseInt(value) > selectedProduct.max_repayment_period) {
        finalValue = selectedProduct.max_repayment_period.toString();
        toast.error(`Maximum repayment period for this product is ${selectedProduct.max_repayment_period} months`);
      }
    }

    setFormData((prev) => {
      const newData = { ...prev, [field]: finalValue };

      // Auto-fill repayment period when loan product changes
      if (field === 'loanType') {
        const selectedProduct = loanProducts.find(lp => lp.name === value);
        if (selectedProduct) {
          newData.repaymentPeriod = selectedProduct.max_repayment_period.toString();
        }
      }

      return newData;
    });

    // Calculate loan estimates when relevant fields change
    if (field === 'amount' || field === 'repaymentPeriod' || field === 'loanType') {
      const updateData = { ...formData, [field]: finalValue };
      if (field === 'loanType') {
        const selectedProduct = loanProducts.find(lp => lp.name === value);
        if (selectedProduct) {
          updateData.repaymentPeriod = selectedProduct.max_repayment_period.toString();
        }
      }
      calculateLoan(updateData);
    }
  };

  const calculateLoan = (data: typeof formData) => {
    const amount = parseFloat(data.amount) || 0;
    const period = parseInt(data.repaymentPeriod) || 1;
    const selectedLoan = loanProducts.find((lp) => lp.name === data.loanType);
    const rate = selectedLoan ? selectedLoan.interest_rate / 100 : 0.12;

    const monthlyRate = rate / 12;
    const processingFee = amount * 0.02; // 2% processing fee

    // Calculate monthly payment using loan amortization formula
    let monthlyPayment = 0;
    if (monthlyRate > 0) {
      monthlyPayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, period)) /
        (Math.pow(1 + monthlyRate, period) - 1);
    } else {
      monthlyPayment = amount / period;
    }

    const totalRepayable = monthlyPayment * period;

    setCalculatedValues({
      interestRate: rate * 100,
      monthlyPayment: isFinite(monthlyPayment) ? monthlyPayment : 0,
      totalRepayable: isFinite(totalRepayable) ? totalRepayable : 0,
      processingFee,
    });
  };

  const handleAddGuarantor = () => {
    if (!formData.selectedGuarantor) return;

    // Check if submitting guarantor is the same as the applicant
    if (formData.selectedGuarantor === formData.member) {
      toast.error("Applicant cannot be their own guarantor");
      return;
    }

    // Check if guarantor is already added
    if (guarantors.some(g => g.member === formData.selectedGuarantor)) {
      toast.error("This member is already added as a guarantor");
      return;
    }

    setGuarantors([...guarantors, { member: formData.selectedGuarantor, amount: 0 }]);
    setFormData(prev => ({ ...prev, selectedGuarantor: '' }));
  };

  const handleRemoveGuarantor = (memberId: string) => {
    setGuarantors(guarantors.filter(g => g.member !== memberId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await loanService.applyForLoan({
        member: formData.member,
        amount: parseFloat(formData.amount),
        loan_product: formData.loanType,
        purpose: formData.purpose,
        repayment_period: parseInt(formData.repaymentPeriod),
        guarantors: guarantors
      });

      toast.success('Loan application submitted successfully');
      onOpenChange(false);

      // Reset form
      setFormData({
        member: '',
        loanType: '',
        amount: '',
        purpose: '',
        repaymentPeriod: '',
        selectedGuarantor: '',
      });
      setGuarantors([]);
      setCalculatedValues({
        interestRate: 0,
        monthlyPayment: 0,
        totalRepayable: 0,
        processingFee: 0,
      });

    } catch (error: any) {
      console.error('Error submitting loan:', error);
      const errorMsg = error.response?.data?.exception?.split(':').pop() || 'Failed to submit loan application';
      // Try to parse server messages if available
      if (error.response?.data?._server_messages) {
        try {
          const messages = JSON.parse(error.response.data._server_messages);
          const firstMsg = JSON.parse(messages[0]);
          toast.error(firstMsg.message);
          setIsSubmitting(false);
          return;
        } catch (e) { }
      }
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMemberName = (id: string) => {
    const member = members.find(m => m.name === id);
    return member ? `${member.member_name} (${member.name})` : id;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl lg:max-w-[50vw] max-h-[90vh] overflow-y-auto [&>button:last-child]:top-6 [&>button:last-child]:right-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            New Loan Application {formData.member ? `- ${getMemberName(formData.member)}` : ''}
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
                <Label htmlFor="member">Select Member *</Label>
                <Select value={formData.member} onValueChange={(value) => handleChange('member', value)}>
                  <SelectTrigger id="member">
                    <SelectValue placeholder="Select a member" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((m) => (
                      <SelectItem key={m.name} value={m.name}>
                        {m.member_name} ({m.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Loan Details */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Loan Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="loanType">Loan Product *</Label>
                  <Select value={formData.loanType} onValueChange={(value) => handleChange('loanType', value)}>
                    <SelectTrigger id="loanType">
                      <SelectValue placeholder="Select loan product" />
                    </SelectTrigger>
                    <SelectContent>
                      {loanProducts.map((type) => (
                        <SelectItem key={type.name} value={type.name}>
                          {type.name} ({type.interest_rate}% interest)
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="repaymentPeriod">Repayment Period (months) *</Label>
                  <Input
                    id="repaymentPeriod"
                    type="number"
                    placeholder="Enter period in months"
                    value={formData.repaymentPeriod}
                    onChange={(e) => handleChange('repaymentPeriod', e.target.value)}
                    required
                    min="1"
                  />
                  {formData.loanType && (
                    <p className="text-xs text-muted-foreground">
                      Max period: {loanProducts.find(lp => lp.name === formData.loanType)?.max_repayment_period} months
                    </p>
                  )}
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
                        KES {calculatedValues.processingFee.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Monthly Payment</p>
                      <p className="text-lg font-semibold text-primary">
                        KES {calculatedValues.monthlyPayment.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Repayable</p>
                      <p className="text-lg font-semibold">
                        KES {calculatedValues.totalRepayable.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Separator />

            {/* Guarantors */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Guarantors</h3>
              <div className="space-y-4">
                <div className="flex items-end gap-2">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="guarantorSelect">Add Guarantor</Label>
                    <Select
                      value={formData.selectedGuarantor}
                      onValueChange={(value) => handleChange('selectedGuarantor', value)}
                    >
                      <SelectTrigger id="guarantorSelect">
                        <SelectValue placeholder="Select a member to add as guarantor" />
                      </SelectTrigger>
                      <SelectContent>
                        {members
                          .filter(m => m.name !== formData.member && !guarantors.some(g => g.member === m.name))
                          .map((m) => (
                            <SelectItem key={m.name} value={m.name}>
                              {m.member_name} ({m.name})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddGuarantor}
                    disabled={!formData.selectedGuarantor}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>

                {guarantors.length > 0 ? (
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Member</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {guarantors.map((g) => (
                          <TableRow key={g.member}>
                            <TableCell>{getMemberName(g.member)}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleRemoveGuarantor(g.member)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-4 border rounded-md border-dashed">
                    No guarantors added yet. Please add at least one guarantor if required.
                  </div>
                )}
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
