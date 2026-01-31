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
            const newStatus = isInactive ? 'Active' : 'Disabled'; // Or 'Inactive', depending on requirements. Assuming 'Disabled' based on context but could be 'Inactive'. Let's stick effectively to 'enable' -> Active or similar.
            // Wait, let's verify exact status strings. The backend likely expects 'Active', 'Inactive', 'Suspended' etc.
            // Assuming 'Active' for enable, and 'Inactive' or 'Suspended' for disable.
            // Let's assume the backend handles specific logic or we send 'Active' to enable, and 'Inactive' to disable.
            const targetStatus = isInactive ? 'Active' : 'Inactive';

            await memberService.updateMemberStatus(member.name, targetStatus);
            toast.success(`Member ${isInactive ? 'enabled' : 'disabled'} successfully!`);
            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            console.error('Status update error:', error);
            toast.error(`Failed to ${action} member. Please try again.`);
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
