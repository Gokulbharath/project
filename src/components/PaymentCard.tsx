import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { formatCurrency } from '@/utils/format';
import type { Payment } from '@/types';
import { CreditCard, DollarSign } from 'lucide-react';

interface PaymentCardProps {
  payment: Payment;
  onMarkPaid?: (id: string) => void;
}

export const PaymentCard = ({ payment, onMarkPaid }: PaymentCardProps) => {
  return (
    <Card className="glass-card p-4 hover-lift hover-glow">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-neon-primary/10 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-neon-primary" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">{payment.guestName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">Table {payment.tableId}</span>
              <StatusBadge type="payment" value={payment.status} />
            </div>
          </div>
        </div>

        <div className="text-right flex items-center gap-3">
          <div>
            <div className="text-lg font-bold text-white">{formatCurrency(payment.amount)}</div>
            {payment.method && (
              <div className="text-xs text-muted-foreground capitalize">{payment.method.replace('_', ' ')}</div>
            )}
          </div>

          {payment.status === 'pending' && onMarkPaid && (
            <Button
              size="sm"
              onClick={() => onMarkPaid(payment.id)}
              className="bg-neon-success/20 hover:bg-neon-success/30 text-neon-success border border-neon-success/30"
            >
              <CreditCard className="w-4 h-4 mr-1" />
              Mark Paid
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
