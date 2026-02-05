import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
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

interface MemberStatusDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    member: MemberListItem | null;
    onSuccess?: () => void;
}

export function MemberStatusDialog({
    open,
    onOpenChange,
    member,
    onSuccess,
}: MemberStatusDialogProps) {
    const [loading, setLoading] = useState(false);

    if (!member) return null;

    const isInactive = member.status.toLowerCase().includes('inactive') || member.status.toLowerCase().includes('rejected');
    const action = isInactive ? 'enable' : 'disable';

    const handleStatusChange = async () => {
        setLoading(true);
        try {
            if (isInactive) {
                await memberService.enableMember(member.name);
                toast.success('Member enabled successfully!');
            } else {
                await memberService.disableMember(member.name);
                toast.success('Member disabled successfully!');
            }
            onOpenChange(false);
            onSuccess?.();
        } catch (error: any) {
            console.error('Status update error:', error);
            // Extract error message from API response
            let errorMessage = `Failed to ${action} member. Please try again.`;
            if (error?.response?.data?.exception) {
                const exceptionMsg = error.response.data.exception;
                const match = exceptionMsg.match(/ValidationError: (.+?)(?:"|$)/);
                if (match && match[1]) {
                    errorMessage = match[1];
                }
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="capitalize">
                        {action} Member
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to {action} {member.member_name}?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        variant={isInactive ? 'default' : 'destructive'}
                        onClick={handleStatusChange}
                        disabled={loading}
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
