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
import { FilePlus } from 'lucide-react';

interface CreateClaimModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateClaimModal({ isOpen, onClose, onSuccess }: CreateClaimModalProps) {
    const [memberId, setMemberId] = useState('');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [members, setMembers] = useState<MemberListItem[]>([]);

    useEffect(() => {
        if (isOpen) {
            fetchMembers();
        }
    }, [isOpen]);

    const fetchMembers = async () => {
        try {
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

        if (!reason) {
            toast.error('Please select a reason');
            return;
        }

        setIsLoading(true);

        try {
            await welfareService.createClaim({
                member_id: memberId,
                claim_amount: parseFloat(amount),
                reason: reason,
                description: description,
            });
            toast.success('Claim created successfully');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to create claim:', error);
            toast.error(parseFrappeError(error, 'Failed to create claim'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl lg:max-w-[50vw]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FilePlus className="h-5 w-5" />
                        Create Welfare Claim
                    </DialogTitle>
                    <DialogDescription>
                        Enter details to create a new welfare claim.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 py-4">
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
                            <Label htmlFor="reason" className="text-right">
                                Reason
                            </Label>
                            <div className="col-span-3">
                                <Select value={reason} onValueChange={setReason}>
                                    <SelectTrigger id="reason">
                                        <SelectValue placeholder="Select reason" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Medical Emergency">Medical Emergency</SelectItem>
                                        <SelectItem value="Bereavement">Bereavement</SelectItem>
                                        <SelectItem value="Education">Education</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
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

                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="description" className="text-right pt-2">
                                Description
                            </Label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="col-span-3 min-h-[100px] flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Detailed description of the claim..."
                                required
                            />
                        </div>

                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create Claim'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
