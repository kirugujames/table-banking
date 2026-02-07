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
import { welfareService } from '@/app/lib/welfare-service';
import { toast } from 'sonner';
import { parseFrappeError } from '@/app/lib/error-handler';

interface ApproveClaimModalProps {
    isOpen: boolean;
    onClose: () => void;
    claimId: string;
    onSuccess: () => void;
}

export function ApproveClaimModal({ isOpen, onClose, claimId, onSuccess }: ApproveClaimModalProps) {
    const [amountPerMember, setAmountPerMember] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await welfareService.approveClaim({
                claim_id: claimId,
                amount_per_member: parseFloat(amountPerMember),
            });
            toast.success('Claim approved successfully');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to approve claim:', error);
            toast.error(parseFrappeError(error, 'Failed to approve claim'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Approve Welfare Claim</DialogTitle>
                    <DialogDescription>
                        Enter the contribution amount per member to approve this claim.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="claim-id" className="text-right">
                                Claim ID
                            </Label>
                            <Input
                                id="claim-id"
                                value={claimId}
                                disabled
                                className="col-span-3 bg-muted"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="contribution" className="text-right">
                                Contribution Per Member
                            </Label>
                            <div className="col-span-3 relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">KES</span>
                                <Input
                                    id="contribution"
                                    type="number"
                                    value={amountPerMember}
                                    onChange={(e) => setAmountPerMember(e.target.value)}
                                    className="pl-12"
                                    placeholder="0.00"
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Approving...' : 'Approve Claim'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
