import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { welfareService, WelfareClaim } from '@/app/lib/welfare-service';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { cn } from '@/app/components/ui/utils';

interface ViewClaimModalProps {
    isOpen: boolean;
    onClose: () => void;
    claimId: string;
}

export function ViewClaimModal({ isOpen, onClose, claimId }: ViewClaimModalProps) {
    const [claim, setClaim] = useState<WelfareClaim | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen && claimId) {
            fetchClaimDetails();
        } else {
            setClaim(null);
        }
    }, [isOpen, claimId]);

    const fetchClaimDetails = async () => {
        setIsLoading(true);
        try {
            const data = await welfareService.getClaimById(claimId);
            setClaim(data);
        } catch (error) {
            console.error('Failed to fetch claim details:', error);
            toast.error('Failed to load claim details');
            onClose();
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-100 text-green-800';
            case 'Paid':
                return 'bg-blue-100 text-blue-800';
            case 'Rejected':
                return 'bg-red-100 text-red-800';
            case 'Pending':
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Welfare Claim Details</DialogTitle>
                    <DialogDescription>
                        View detailed information for claim {claimId}.
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex h-40 items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : claim ? (
                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="text-muted-foreground">Claim ID</Label>
                                <div className="font-medium">{claim.name}</div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-muted-foreground">Status</Label>
                                <div>
                                    <Badge variant="secondary" className={cn("font-normal", getStatusColor(claim.status))}>
                                        {claim.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="text-muted-foreground">Member</Label>
                                <div className="font-medium">{claim.member_name}</div>
                                <div className="text-xs text-muted-foreground">{claim.member}</div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-muted-foreground">Contact</Label>
                                <div className="text-sm">{claim.member_email || 'N/A'}</div>
                                <div className="text-sm">{claim.member_phone || 'N/A'}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="text-muted-foreground">Amount</Label>
                                <div className="font-medium">KES {claim.claim_amount.toLocaleString()}</div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-muted-foreground">Date</Label>
                                <div className="font-medium">{new Date(claim.claim_date).toLocaleDateString()}</div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label className="text-muted-foreground">Reason</Label>
                            <div className="font-medium">{claim.reason}</div>
                        </div>

                        <div className="space-y-1">
                            <Label className="text-muted-foreground">Description</Label>
                            <div className="text-sm bg-muted p-3 rounded-md min-h-[60px]">
                                {claim.description || "No description provided."}
                            </div>
                        </div>

                        {claim.status === 'Paid' && (
                            <div className="grid grid-cols-2 gap-4 border-t pt-4">
                                <div className="space-y-1">
                                    <Label className="text-muted-foreground">Total Collected</Label>
                                    <div className="font-medium text-green-600">KES {claim.total_collected.toLocaleString()}</div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-muted-foreground">Payment Date</Label>
                                    <div className="font-medium">{claim.payment_date}</div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-muted-foreground">Payment Mode</Label>
                                    <div className="font-medium">{claim.payment_mode}</div>
                                </div>
                            </div>
                        )}

                        {claim.status === 'Approved' && claim.amount_per_member > 0 && (
                            <div className="space-y-1 border-t pt-4">
                                <Label className="text-muted-foreground">Contribution Per Member</Label>
                                <div className="font-medium">KES {claim.amount_per_member.toLocaleString()}</div>
                            </div>
                        )}

                    </div>
                ) : (
                    <div className="flex h-40 items-center justify-center text-muted-foreground">
                        Failed to load claim details.
                    </div>
                )}

                <div className="flex justify-end">
                    <Button onClick={onClose}>Close</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
