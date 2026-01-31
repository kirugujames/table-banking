import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { StatusBadge } from '@/app/components/status-badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  PiggyBank,
  CreditCard,
  Target,
  Loader2,
} from 'lucide-react';

import { memberService, MemberListItem, MemberFullDetails } from '@/app/lib/member-service';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getImageUrl = (path: string | null | undefined) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

interface MemberDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: MemberListItem | null;
}

export function MemberDetailModal({ open, onOpenChange, member }: MemberDetailModalProps) {
  const [details, setDetails] = useState<MemberFullDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && member) {
      const fetchDetails = async () => {
        setIsLoading(true);
        try {
          const data = await memberService.getMemberFullDetails(member.name);
          setDetails(data);
        } catch (error) {
          console.error('Failed to fetch member details:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetails();
    } else if (!open) {
      setDetails(null);
    }
  }, [open, member]);

  const reg = details?.registration_details;
  const fin = details?.financial_summary;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl lg:max-w-[50vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Member Details{reg ? `: ${reg.member_name}` : ''}</DialogTitle>
          <DialogDescription>Comprehensive member information and financial history</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : details ? (
          <div className="space-y-6">
            {/* Member Header */}
            <div className="flex items-start gap-6 pb-6 border-b">
              <Avatar className="h-24 w-24 border-2 border-primary/10">
                <AvatarImage src={getImageUrl(reg?.passport_photo)} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {reg?.member_name?.split(' ').map(n => n[0]).join('') || 'M'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{reg?.member_name}</h2>
                    <p className="text-sm font-mono text-muted-foreground">{reg?.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <StatusBadge status={(reg?.status?.toLowerCase() || 'pending') as any} />
                    {reg?.registration_fee_paid ? (
                      <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                        Fee Paid
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                        Fee Pending
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="truncate">{reg?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{reg?.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="truncate">{reg?.ward}, {reg?.sub_county}, {reg?.county}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-primary/5 border-primary/10 shadow-none">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <PiggyBank className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Savings</p>
                    <p className="text-lg font-bold">KES {fin?.total_savings?.toLocaleString() || '0'}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-amber-500/5 border-amber-500/10 shadow-none">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <CreditCard className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Loans Outstanding</p>
                    <p className="text-lg font-bold">KES {fin?.total_loan_outstanding?.toLocaleString() || '0'}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-emerald-500/5 border-emerald-500/10 shadow-none">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <Target className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Welfare Contribution</p>
                    <p className="text-lg font-bold">KES {fin?.total_welfare_contribution?.toLocaleString() || '0'}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Details Tabs */}
            <Tabs defaultValue="registration" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="registration">Registration</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="registration" className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground font-medium">Full Name</p>
                    <p>{reg?.member_name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground font-medium">ID Number</p>
                    <p>{reg?.national_id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground font-medium">County</p>
                    <p>{reg?.county}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground font-medium">Sub County</p>
                    <p>{reg?.sub_county}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground font-medium">Ward</p>
                    <p>{reg?.ward}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground font-medium">Village</p>
                    <p>{reg?.village}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="financials" className="pt-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Account</TableHead>
                        <TableHead className="text-right">Balance (KES)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Total Savings</TableCell>
                        <TableCell className="text-right">{fin?.total_savings?.toLocaleString() || '0'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Welfare Contribution</TableCell>
                        <TableCell className="text-right">{fin?.total_welfare_contribution?.toLocaleString() || '0'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-amber-600">Outstanding Loans</TableCell>
                        <TableCell className="text-right text-amber-600 font-bold">{fin?.total_loan_outstanding?.toLocaleString() || '0'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="pt-4 grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Passport Photo</p>
                  {reg?.passport_photo ? (
                    <img src={getImageUrl(reg.passport_photo)} alt="Passport" className="w-32 h-32 object-cover rounded-lg border shadow-sm" />
                  ) : (
                    <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center text-xs text-muted-foreground border border-dashed">No Photo</div>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">National ID Image</p>
                  {reg?.national_id_image ? (
                    <img src={getImageUrl(reg.national_id_image)} alt="National ID" className="w-full aspect-video object-contain rounded-lg border shadow-sm" />
                  ) : (
                    <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center text-xs text-muted-foreground border border-dashed">No ID Image</div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="history" className="pt-4">
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Full transaction history loading...
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No member details found.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
