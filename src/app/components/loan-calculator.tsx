import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Slider } from '@/app/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Separator } from '@/app/components/ui/separator';

export function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(10000);
  const [interestRate, setInterestRate] = useState(12);
  const [duration, setDuration] = useState(12);

  const monthlyInterestRate = interestRate / 100 / 12;
  const monthlyPayment = 
    (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, duration)) / 
    (Math.pow(1 + monthlyInterestRate, duration) - 1);
  const totalPayment = monthlyPayment * duration;
  const totalInterest = totalPayment - loanAmount;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Loan Amount */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Loan Amount</Label>
            <span className="text-sm font-semibold">${loanAmount.toLocaleString()}</span>
          </div>
          <Slider
            value={[loanAmount]}
            onValueChange={(value) => setLoanAmount(value[0])}
            min={1000}
            max={50000}
            step={500}
            className="py-4"
          />
        </div>

        {/* Interest Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Interest Rate</Label>
            <span className="text-sm font-semibold">{interestRate}%</span>
          </div>
          <Slider
            value={[interestRate]}
            onValueChange={(value) => setInterestRate(value[0])}
            min={5}
            max={20}
            step={0.5}
            className="py-4"
          />
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <Label>Loan Duration</Label>
          <Select value={duration.toString()} onValueChange={(val) => setDuration(Number(val))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6 months</SelectItem>
              <SelectItem value="12">12 months</SelectItem>
              <SelectItem value="18">18 months</SelectItem>
              <SelectItem value="24">24 months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Results */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Monthly Payment</span>
            <span className="text-xl font-bold text-primary">
              ${monthlyPayment.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Interest</span>
            <span className="text-sm font-semibold text-amber-600">
              ${totalInterest.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Payment</span>
            <span className="text-sm font-semibold">
              ${totalPayment.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
