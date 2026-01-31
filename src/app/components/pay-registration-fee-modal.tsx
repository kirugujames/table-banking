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
import { toast } from 'react-hot-toast';
import { memberService, MemberListItem } from '@/app/lib/member-service';
import { Loader2 } from 'lucide-react';

interface PayRegistrationFeeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    member: MemberListItem | null;
    onSuccess?: () => void;
}

export function PayRegistrationFeeModal({
    open,
    onOpenChange,
    member,
    onSuccess,
}: PayRegistrationFeeModalProps) {
    const [amount, setAmount] = useState('1000');
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        if (!member) return;

        setLoading(true);
        try {
            await memberService.payRegistrationFee(member.name, Number(amount));
            toast.success('Registration fee paid successfully!');
            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            console.error('Payment error:', error);
            toast.error('Failed to process payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!member) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Pay Registration Fee</DialogTitle>
                    <DialogDescription>
                        Process registration fee payment for {member.member_name}.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Member ID:</span>
                        <span className="font-mono">{member.name}</span>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="registration_amount">Registration Fee Amount (KES)</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                                KES
                            </span>
                            <Input
                                id="registration_amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="pl-12"
                                placeholder="Enter amount"
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handlePayment} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirm Payment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
