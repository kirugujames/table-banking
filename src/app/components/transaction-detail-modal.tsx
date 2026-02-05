import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';
import {
  Download,
  Printer,
  CheckCircle,
  Clock,
  User,
  Calendar,
  Hash,
  FileText,
  Loader2,
  ArrowRightLeft,
  Users,
} from 'lucide-react';
import { transactionService, TransactionDetails } from '@/app/lib/transaction-service';

interface TransactionDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId: string | null;
}

export function TransactionDetailModal({
  open,
  onOpenChange,
  transactionId
}: TransactionDetailModalProps) {
  const [details, setDetails] = useState<TransactionDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && transactionId) {
      const fetchDetails = async () => {
        setLoading(true);
        try {
          const data = await transactionService.getTransactionDetails(transactionId);
          setDetails(data);
        } catch (error) {
          console.error('Error fetching transaction details:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    } else if (!open) {
      setDetails(null);
    }
  }, [open, transactionId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    console.log('Downloading receipt for:', transactionId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl lg:max-w-[50vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Transaction Details
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex h-[300px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : details ? (
          <div className="space-y-6 py-4">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-muted/50 rounded-lg gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <Hash className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transaction ID</p>
                  <p className="font-mono font-bold text-lg">{details.transaction_id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transaction Date</p>
                  <p className="font-bold">{details.date}</p>
                </div>
              </div>
            </div>

            {/* Parties Involved */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 font-semibold">
                <Users className="h-4 w-4 text-primary" />
                Parties Involved
              </h3>
              <div className="grid gap-2">
                {details.parties_involved.map((party, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{party.name}</p>
                        <p className="text-xs text-muted-foreground">{party.id}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{party.type}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Accounts Affected (Ledger) */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 font-semibold">
                <ArrowRightLeft className="h-4 w-4 text-primary" />
                Accounts Affected
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="text-left p-3 font-medium">Account</th>
                      <th className="text-right p-3 font-medium">Debit</th>
                      <th className="text-right p-3 font-medium">Credit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {details.accounts_affected.map((item, index) => (
                      <tr key={index} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-medium">{item.account}</td>
                        <td className="p-3 text-right text-red-600">
                          {item.debit > 0 ? `KSH ${item.debit.toLocaleString()}` : '-'}
                        </td>
                        <td className="p-3 text-right text-green-600">
                          {item.credit > 0 ? `KSH ${item.credit.toLocaleString()}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted/50 font-bold border-t">
                    <tr>
                      <td className="p-3">Total</td>
                      <td className="p-3 text-right text-red-600">
                        KSH {details.accounts_affected.reduce((acc, curr) => acc + curr.debit, 0).toLocaleString()}
                      </td>
                      <td className="p-3 text-right text-green-600">
                        KSH {details.accounts_affected.reduce((acc, curr) => acc + curr.credit, 0).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Remarks */}
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 font-semibold">
                <FileText className="h-4 w-4 text-primary" />
                Remarks
              </h3>
              <div className="p-4 bg-muted/30 border rounded-lg whitespace-pre-wrap text-sm italic">
                {details.remarks || 'No additional remarks provided.'}
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 gap-2" onClick={handlePrint}>
                <Printer className="h-4 w-4" />
                Print Receipt
              </Button>
              <Button variant="outline" className="flex-1 gap-2" onClick={handleDownload}>
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            Failed to load transaction details.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

