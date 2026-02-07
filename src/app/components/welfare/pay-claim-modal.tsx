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
import { welfareService } from '@/app/lib/welfare-service';
import { memberService, MemberListItem } from '@/app/lib/member-service';
import { toast } from 'sonner';
import { parseFrappeError } from '@/app/lib/error-handler';

interface PayClaimModalProps {
    isOpen: boolean;
    onClose: () => void;
    claimId: string;
    defaultAmount?: number;
    defaultMemberId?: string;
    onSuccess: () => void;
}

export function PayClaimModal({ isOpen, onClose, claimId, defaultAmount, defaultMemberId, onSuccess }: PayClaimModalProps) {
    const [memberId, setMemberId] = useState(defaultMemberId || '');
    const [amount, setAmount] = useState(defaultAmount ? defaultAmount.toString() : '');
    const [mode, setMode] = useState<'Cash' | 'Mpesa'>('Cash');
    const [referenceId, setReferenceId] = useState('');
    const [purpose, setPurpose] = useState('Welfare Claim Payment');
    const [isLoading, setIsLoading] = useState(false);
    const [members, setMembers] = useState<MemberListItem[]>([]);

    useEffect(() => {
        if (isOpen) {
            fetchMembers();
            if (defaultAmount) setAmount(defaultAmount.toString());
            if (defaultMemberId) setMemberId(defaultMemberId);
        }
    }, [isOpen, defaultAmount, defaultMemberId]);

    const fetchMembers = async () => {
        try {
            // Fetch all members for the dropdown
            const response = await memberService.getMemberList(0, 1000);
            setMembers(response);
        } catch (error) {
            console.error('Failed to fetch members:', error);
            toast.error('Failed to load members');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!memberId) {
            toast.error('Please select a member');
            return;
        }

        if (mode === 'Mpesa' && !referenceId) {
            toast.error('Reference ID is required for M-Pesa payments');
            return;
        }

        setIsLoading(true);

        try {
            await welfareService.payClaim({
                member: memberId,
                amount: parseFloat(amount),
                purpose: purpose,
                type: 'Contribution',
                claim_id: claimId,
                mode,
                reference: referenceId,
            });
            toast.success('Claim paid successfully');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to pay claim:', error);
            toast.error(parseFrappeError(error, 'Failed to pay claim'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Pay Welfare Claim</DialogTitle>
                    <DialogDescription>
                        Process payment for this welfare claim.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="member" className="text-right">
                                Member
                            </Label>
                            <div className="col-span-3">
                                <Select value={memberId} onValueChange={setMemberId}>
                                    <SelectTrigger id="member">
                                        <SelectValue placeholder="Select member" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {members.map((member) => (
                                            <SelectItem key={member.name} value={member.name}>
                                                {member.member_name} ({member.name})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                                Amount
                            </Label>
                            <div className="col-span-3 relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">KES</span>
                                <Input
                                    id="amount"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="pl-12"
                                    placeholder="0.00"
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="purpose" className="text-right">
                                Purpose
                            </Label>
                            <Input
                                id="purpose"
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                className="col-span-3"
                                placeholder="Payment purpose"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="mode" className="text-right">
                                Mode
                            </Label>
                            <div className="col-span-3">
                                <Select value={mode} onValueChange={(value: 'Cash' | 'Mpesa') => setMode(value)}>
                                    <SelectTrigger id="mode">
                                        <SelectValue placeholder="Select mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Cash">Cash</SelectItem>
                                        <SelectItem value="Mpesa">M-Pesa</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {mode === 'Mpesa' && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="reference" className="text-right">
                                    Reference ID
                                </Label>
                                <Input
                                    id="reference"
                                    value={referenceId}
                                    onChange={(e) => setReferenceId(e.target.value)}
                                    className="col-span-3"
                                    placeholder="e.g. QWE123TYU"
                                    required
                                />
                            </div>
                        )}

                        {mode === 'Cash' && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="reference-opt" className="text-right">
                                    Reference ID
                                </Label>
                                <Input
                                    id="reference-opt"
                                    value={referenceId}
                                    onChange={(e) => setReferenceId(e.target.value)}
                                    className="col-span-3"
                                    placeholder="Optional for Cash"
                                />
                            </div>
                        )}

                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Processing...' : 'Pay Claim'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
