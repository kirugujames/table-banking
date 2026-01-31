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
  DollarSign,
  FileText,
} from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  time: string;
  member: string;
  memberId: string;
  type: string;
  category: string;
  amount: number;
  balanceAfter: number;
  reference: string;
  status: 'completed' | 'pending' | 'failed';
  processedBy?: string;
  notes?: string;
}

interface TransactionDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
}

export function TransactionDetailModal({ 
  open, 
  onOpenChange, 
  transaction 
}: TransactionDetailModalProps) {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    console.log('Downloading receipt for:', transaction.id);
    // Implement download logic
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Transaction Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Transaction Status */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              {transaction.status === 'completed' ? (
                <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              ) : (
                <div className="rounded-full bg-amber-100 dark:bg-amber-900/20 p-2">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
              )}
              <div>
                <p className="font-semibold">Transaction {transaction.status}</p>
                <p className="text-sm text-muted-foreground">
                  {transaction.date} at {transaction.time}
                </p>
              </div>
            </div>
            <Badge
              variant={
                transaction.status === 'completed'
                  ? 'default'
                  : transaction.status === 'pending'
                  ? 'secondary'
                  : 'destructive'
              }
              className="text-sm"
            >
              {transaction.status.toUpperCase()}
            </Badge>
          </div>

          {/* Transaction Amount */}
          <div className="text-center py-6 border rounded-lg bg-gradient-to-br from-primary/5 to-primary/10">
            <p className="text-sm text-muted-foreground mb-2">Transaction Amount</p>
            <p
              className={`text-4xl font-bold ${
                transaction.amount > 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Balance After: ${transaction.balanceAfter.toLocaleString()}
            </p>
          </div>

          <Separator />

          {/* Transaction Details */}
          <div className="space-y-4">
            <h3 className="font-semibold">Transaction Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Hash className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Transaction ID</p>
                  <p className="font-mono font-medium">{transaction.id}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Reference</p>
                  <p className="font-mono font-medium">{transaction.reference}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Member</p>
                  <p className="font-medium">{transaction.member}</p>
                  <p className="text-sm text-muted-foreground">{transaction.memberId}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-medium">{transaction.date}</p>
                  <p className="text-sm text-muted-foreground">{transaction.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Transaction Type</p>
                  <p className="font-medium">{transaction.type}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <Badge variant="outline">{transaction.category}</Badge>
                </div>
              </div>
            </div>
          </div>

          {transaction.processedBy && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold">Processing Information</h3>
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Processed By</p>
                    <p className="font-medium">{transaction.processedBy}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {transaction.notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold">Notes</h3>
                <p className="text-sm text-muted-foreground">{transaction.notes}</p>
              </div>
            </>
          )}

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
      </DialogContent>
    </Dialog>
  );
}
