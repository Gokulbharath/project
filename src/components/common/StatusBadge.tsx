import { Badge } from '@/components/ui/badge';
import { BookingStatus, PaymentStatus } from '@/types/staff';
import { cn } from '@/lib/utils';

type StatusType = BookingStatus | PaymentStatus;

interface StatusBadgeProps {
  status: StatusType;
  type?: 'booking' | 'payment';
  className?: string;
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string }> = {
  // Booking statuses
  CONFIRMED: { label: 'Confirmed', variant: 'default', className: 'bg-blue/20 text-blue border-blue/30' },
  PENDING: { label: 'Pending', variant: 'secondary', className: 'bg-yellow/20 text-yellow border-yellow/30' },
  ARRIVED: { label: 'Arrived', variant: 'default', className: 'bg-green/20 text-green border-green/30' },
  NO_SHOW: { label: 'No Show', variant: 'destructive', className: 'bg-red/20 text-red border-red/30' },
  CANCELLED: { label: 'Cancelled', variant: 'outline', className: 'bg-surface text-text-dim border-border' },
  // Payment statuses
  PAID: { label: 'Paid', variant: 'default', className: 'bg-green/20 text-green border-green/30' },
  FAILED: { label: 'Failed', variant: 'destructive', className: 'bg-red/20 text-red border-red/30' },
  PARTIAL: { label: 'Partial', variant: 'secondary', className: 'bg-yellow/20 text-yellow border-yellow/30' },
};

export function StatusBadge({ status, type, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, variant: 'outline' as const };
  
  return (
    <Badge
      variant={config.variant}
      className={cn('text-xs font-medium', config.className, className)}
    >
      {config.label}
    </Badge>
  );
}

