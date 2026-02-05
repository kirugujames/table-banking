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
import { CreditCard, Loader2 } from 'lucide-react';
import { loanService } from '@/app/lib/loan-service';
import { toast } from 'react-hot-toast';

interface CreateLoanProductModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function CreateLoanProductModal({ open, onOpenChange, onSuccess }: CreateLoanProductModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        product_name: '',
        interest_rate: '',
        interest_period: 'Monthly',
        interest_method: 'Flat Rate',
        max_repayment_period: '',
        min_loan_amount: '0',
        max_loan_amount: '0',
        requires_guarantor: false,
        min_guarantors: '0',
        description: '',
    });

    const handleChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                interest_rate: Number(formData.interest_rate),
                max_repayment_period: Number(formData.max_repayment_period),
                min_loan_amount: Number(formData.min_loan_amount),
                max_loan_amount: Number(formData.max_loan_amount),
                min_guarantors: Number(formData.min_guarantors),
                requires_guarantor: formData.requires_guarantor ? 1 : 0,
            };

            const result = await loanService.createLoanProduct(payload);
            if (result.status === 'success') {
                toast.success(result.message || 'Loan product created successfully');
                onOpenChange(false);
                onSuccess?.();

                // Reset form
                setFormData({
                    product_name: '',
                    interest_rate: '',
                    interest_period: 'Monthly',
                    interest_method: 'Flat Rate',
                    max_repayment_period: '',
                    min_loan_amount: '0',
                    max_loan_amount: '0',
                    requires_guarantor: false,
                    min_guarantors: '0',
                    description: '',
                });
            }
        } catch (error: any) {
            console.error('Error creating loan product:', error);
            const errorMsg = error.response?.data?.message || 'Failed to create loan product';
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
                        <CreditCard className="h-6 w-6 text-primary" />
                        Create Loan Product
                    </DialogTitle>
                    <DialogDescription>
                        Define the rules and constraints for a new loan offering.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Product Name */}
                        <div className="space-y-2">
                            <Label htmlFor="product_name" className="text-sm font-semibold">Product Name *</Label>
                            <Input
                                id="product_name"
                                placeholder="e.g. Emergency Loan"
                                className="h-11"
                                value={formData.product_name}
                                onChange={(e) => handleChange('product_name', e.target.value)}
                                required
                            />
                        </div>

                        {/* Interest Rate */}
                        <div className="space-y-2">
                            <Label htmlFor="interest_rate" className="text-sm font-semibold">Interest Rate (%) *</Label>
                            <Input
                                id="interest_rate"
                                type="number"
                                placeholder="0.00"
                                className="h-11"
                                value={formData.interest_rate}
                                onChange={(e) => handleChange('interest_rate', e.target.value)}
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>

                        {/* Interest Period */}
                        <div className="space-y-2">
                            <Label htmlFor="interest_period" className="text-sm font-semibold">Interest Period *</Label>
                            <Select
                                value={formData.interest_period}
                                onValueChange={(value) => handleChange('interest_period', value)}
                            >
                                <SelectTrigger id="interest_period" className="h-11">
                                    <SelectValue placeholder="Select period" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                    <SelectItem value="Annually">Annually</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Interest Method */}
                        <div className="space-y-2">
                            <Label htmlFor="interest_method" className="text-sm font-semibold">Interest Method *</Label>
                            <Select
                                value={formData.interest_method}
                                onValueChange={(value) => handleChange('interest_method', value)}
                            >
                                <SelectTrigger id="interest_method" className="h-11">
                                    <SelectValue placeholder="Select method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Flat Rate">Flat Rate</SelectItem>
                                    <SelectItem value="Reducing Balance">Reducing Balance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Max Repayment Period */}
                        <div className="space-y-2">
                            <Label htmlFor="max_repayment_period" className="text-sm font-semibold">Max Repayment Period (Months) *</Label>
                            <Input
                                id="max_repayment_period"
                                type="number"
                                placeholder="e.g. 12"
                                className="h-11"
                                value={formData.max_repayment_period}
                                onChange={(e) => handleChange('max_repayment_period', e.target.value)}
                                required
                                min="1"
                            />
                        </div>

                        {/* Min Loan Amount */}
                        <div className="space-y-2">
                            <Label htmlFor="min_loan_amount" className="text-sm font-semibold">Min Loan Amount (KES)</Label>
                            <Input
                                id="min_loan_amount"
                                type="number"
                                placeholder="0.00"
                                className="h-11"
                                value={formData.min_loan_amount}
                                onChange={(e) => handleChange('min_loan_amount', e.target.value)}
                                min="0"
                            />
                        </div>

                        {/* Max Loan Amount */}
                        <div className="space-y-2">
                            <Label htmlFor="max_loan_amount" className="text-sm font-semibold">Max Loan Amount (KES)</Label>
                            <Input
                                id="max_loan_amount"
                                type="number"
                                placeholder="0.00"
                                className="h-11"
                                value={formData.max_loan_amount}
                                onChange={(e) => handleChange('max_loan_amount', e.target.value)}
                                min="0"
                            />
                        </div>

                        {/* Guarantor Settings */}
                        <div className="space-y-4 rounded-lg border p-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="requires_guarantor" className="font-semibold">Requires Guarantor</Label>
                                    <p className="text-xs text-muted-foreground">Force members to have guarantors for this loan</p>
                                </div>
                                <Switch
                                    id="requires_guarantor"
                                    checked={formData.requires_guarantor}
                                    onCheckedChange={(checked) => handleChange('requires_guarantor', checked)}
                                />
                            </div>

                            {formData.requires_guarantor && (
                                <div className="space-y-2 pt-2 animate-in fade-in slide-in-from-top-2">
                                    <Label htmlFor="min_guarantors" className="text-xs font-semibold">Min Number of Guarantors</Label>
                                    <Input
                                        id="min_guarantors"
                                        type="number"
                                        placeholder="2"
                                        className="h-10"
                                        value={formData.min_guarantors}
                                        onChange={(e) => handleChange('min_guarantors', e.target.value)}
                                        min="1"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the loan product and eligibility criteria..."
                                className="min-h-[100px] resize-none"
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
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
                                <CreditCard className="h-4 w-4" />
                            )}
                            {isSubmitting ? 'Creating...' : 'Create Product'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
