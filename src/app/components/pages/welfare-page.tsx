import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/components/ui/table';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { MoreHorizontal, Plus, Search, Filter, Loader2, CheckCircle, CreditCard, Eye, HeartHandshake, AlertCircle, Banknote, ListTodo } from 'lucide-react';
import { welfareService, WelfareClaim, WelfareStats } from '@/app/lib/welfare-service';
import { toast } from 'sonner';
import { ApproveClaimModal } from '@/app/components/welfare/approve-claim-modal';
import { PayClaimModal } from '@/app/components/welfare/pay-claim-modal';
import { CreateClaimModal } from '@/app/components/welfare/create-claim-modal';
// import { ViewClaimModal } from '@/app/components/welfare/view-claim-modal'; // Will create this next
import { cn } from '@/app/components/ui/utils';
import { StatCard } from '@/app/components/stat-card';

export function WelfarePage() {
    const [claims, setClaims] = useState<WelfareClaim[]>([]);
    const [stats, setStats] = useState<WelfareStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Modals state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isPayModalOpen, setIsPayModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedClaim, setSelectedClaim] = useState<WelfareClaim | null>(null);

    const fetchClaims = async () => {
        setIsLoading(true);
        try {
            const status = statusFilter === 'All Statuses' ? '' : statusFilter;
            const response = await welfareService.getClaims(currentPage, 20, searchQuery, status); // Updated limit to 20 as per prompt

            setClaims(response.data);
            if (response.pagination) {
                const total = response.pagination.total;
                const limit = response.pagination.limit_page_length;
                setTotalPages(Math.ceil(total / limit));
            } else {
                setTotalPages(1);
            }

        } catch (error) {
            console.error('Failed to fetch welfare claims:', error);
            toast.error('Failed to load welfare claims');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const data = await welfareService.getWelfareStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    useEffect(() => {
        fetchClaims();
        fetchStats();
    }, [currentPage, searchQuery, statusFilter]);

    const handleApproveClick = (claim: WelfareClaim) => {
        setSelectedClaim(claim);
        setIsApproveModalOpen(true);
    };

    const handlePayClick = (claim: WelfareClaim) => {
        setSelectedClaim(claim);
        setIsPayModalOpen(true);
    };

    const handleViewClick = (claim: WelfareClaim) => {
        setSelectedClaim(claim);
        setIsViewModalOpen(true);
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Welfare Management</h2>
                    <p className="text-muted-foreground">
                        Manage welfare claims, approvals, and payments.
                    </p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Create Claim
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Claims"
                    value={stats?.total_claims.toString() || "0"}
                    icon={ListTodo}
                    iconColor="text-primary"
                    iconBgColor="bg-primary/10"
                />
                <StatCard
                    title="Pending Claims"
                    value={stats?.pending_claims.toString() || "0"}
                    icon={AlertCircle}
                    iconColor="text-amber-600"
                    iconBgColor="bg-amber-100"
                />
                <StatCard
                    title="Approved Claims"
                    value={stats?.approved_claims.toString() || "0"}
                    icon={CheckCircle}
                    iconColor="text-green-600"
                    iconBgColor="bg-green-100"
                />
                <StatCard
                    title="Total Contributions"
                    value={`KES ${(stats?.total_contributions || 0).toLocaleString()}`}
                    icon={Banknote}
                    iconColor="text-blue-600"
                    iconBgColor="bg-blue-100"
                />
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-1 max-w-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search claims..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <Filter className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All Statuses">All Statuses</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Approved">Approved</SelectItem>
                            <SelectItem value="Paid">Paid</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Claim ID</TableHead>
                            <TableHead>Member</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Total Collected</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Loading claims...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : claims.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">
                                    No claims found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            claims.map((claim) => (
                                <TableRow key={claim.name}>
                                    <TableCell className="font-medium">{claim.name}</TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{claim.member_name}</div>
                                            <div className="text-xs text-muted-foreground">{claim.member}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{claim.reason}</TableCell>
                                    <TableCell>KES {claim.claim_amount.toLocaleString()}</TableCell>
                                    <TableCell>KES {(claim.total_collected || 0).toLocaleString()}</TableCell>
                                    <TableCell>{new Date(claim.claim_date).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={cn("font-normal", getStatusColor(claim.status))}>
                                            {claim.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleViewClick(claim)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                {claim.status === 'Pending' && (
                                                    <DropdownMenuItem onClick={() => handleApproveClick(claim)}>
                                                        <CheckCircle className="mr-2 h-4 w-4" />
                                                        Approve/Reject
                                                    </DropdownMenuItem>
                                                )}
                                                {claim.status === 'Approved' && (
                                                    <DropdownMenuItem onClick={() => handlePayClick(claim)}>
                                                        <CreditCard className="mr-2 h-4 w-4" />
                                                        Pay Claim
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || isLoading}
                >
                    Previous
                </Button>
                <div className="text-sm font-medium">
                    Page {currentPage} of {totalPages}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || isLoading}
                >
                    Next
                </Button>
            </div>

            {isCreateModalOpen && (
                <CreateClaimModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={() => {
                        fetchClaims();
                        fetchStats();
                    }}
                />
            )}

            {selectedClaim && (
                <>
                    <ApproveClaimModal
                        isOpen={isApproveModalOpen}
                        onClose={() => {
                            setIsApproveModalOpen(false);
                            setSelectedClaim(null);
                        }}
                        claimId={selectedClaim.name}
                        onSuccess={() => {
                            fetchClaims();
                            fetchStats();
                        }}
                    />
                    <PayClaimModal
                        isOpen={isPayModalOpen}
                        onClose={() => {
                            setIsPayModalOpen(false);
                            setSelectedClaim(null);
                        }}
                        claimId={selectedClaim.name}
                        defaultAmount={selectedClaim.claim_amount}
                        defaultMemberId={selectedClaim.member}
                        onSuccess={() => {
                            fetchClaims();
                            fetchStats();
                        }}
                    />
                    {/* <ViewClaimModal 
             isOpen={isViewModalOpen}
             onClose={() => {
                 setIsViewModalOpen(false);
                 setSelectedClaim(null);
             }}
             claimId={selectedClaim.name}
          /> */}
                </>
            )}
        </div>
    );
}
