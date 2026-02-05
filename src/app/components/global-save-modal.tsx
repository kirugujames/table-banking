import { useState, useEffect } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/app/components/ui/select';
import { toast } from 'react-hot-toast';
import { memberService } from '@/app/lib/member-service';
import { savingsService } from '@/app/lib/savings-service';
import { Loader2, PiggyBank, User } from 'lucide-react';

interface GlobalSaveModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function GlobalSaveModal({
    open,
    onOpenChange,
    onSuccess,
}: GlobalSaveModalProps) {
    const [members, setMembers] = useState<any[]>([]);
    const [selectedMember, setSelectedMember] = useState('');
    const [amount, setAmount] = useState('');
    const [mode, setMode] = useState('Cash');
    const [reference, setReference] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingMembers, setLoadingMembers] = useState(false);

    useEffect(() => {
        if (open) {
            fetchMembers();
        } else {
            // Reset form on close
            setSelectedMember('');
            setAmount('');
            setReference('');
        }
    }, [open]);

    const fetchMembers = async () => {
        setLoadingMembers(true);
        try {
            const data = await memberService.getAllMembers();
            setMembers(data);
        } catch (error) {
            console.error('Error fetching members:', error);
            toast.error('Failed to load members');
        } finally {
            setLoadingMembers(false);
        }
    };

    const handleSave = async () => {
        if (!selectedMember) {
            toast.error('Please select a member');
            return;
        }

        if (!amount || Number(amount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        setLoading(true);
        try {
            const response = await savingsService.recordDeposit(selectedMember, Number(amount), mode, reference);
            toast.success(response.message?.message || 'Savings deposit recorded successfully!');
            onOpenChange(false);
            onSuccess?.();
        } catch (error: any) {
            console.error('Save error:', error);
            let errorMessage = 'Failed to record savings. Please try again.';
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
            <DialogContent className="max-w-md [&>button:last-child]:top-6 [&>button:last-child]:right-6">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <PiggyBank className="h-5 w-5 text-primary" />
                        Record Savings Deposit
                    </DialogTitle>
                    <DialogDescription>
                        Select a member and record their savings deposit.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-6 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="member_select">Select Member</Label>
                        <Select value={selectedMember} onValueChange={setSelectedMember}>
                            <SelectTrigger id="member_select" className="h-12">
                                <SelectValue placeholder={loadingMembers ? "Loading members..." : "Choose a member"} />
                            </SelectTrigger>
                            <SelectContent>
                                {members.map((m) => (
                                    <SelectItem key={m.name} value={m.name}>
                                        <div className="flex flex-col">
                                            <span className="font-bold">{m.member_name}</span>
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{m.name}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="save_amount">Deposit Amount (KES)</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-black">
                                KES
                            </span>
                            <Input
                                id="save_amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="pl-12 h-12 font-black text-lg"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="payment_mode">Payment Method</Label>
                            <Select value={mode} onValueChange={setMode}>
                                <SelectTrigger id="payment_mode" className="h-11">
                                    <SelectValue placeholder="Select method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Cash">Cash</SelectItem>
                                    <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                    <SelectItem value="Cheque">Cheque</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="payment_reference">Reference (Optional)</Label>
                            <Input
                                id="payment_reference"
                                type="text"
                                value={reference}
                                onChange={(e) => setReference(e.target.value)}
                                className="h-11"
                                placeholder="Ref #"
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter className="gap-2">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading} className="font-bold uppercase tracking-widest text-[10px]">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={loading || loadingMembers} className="h-11 px-8 rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Record Deposit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
