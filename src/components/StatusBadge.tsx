import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { TableStatus, PaymentStatus, SubCode } from '@/types';
import { SUB_CODE_COLORS } from '@/utils/constants';

interface StatusBadgeProps {
  type: 'table' | 'payment' | 'subcode';
  value: TableStatus | PaymentStatus | SubCode;
  className?: string;
}

export const StatusBadge = ({ type, value, className }: StatusBadgeProps) => {
  const getStyles = () => {
    if (type === 'table') {
      const colors = {
        available: 'bg-neon-success/20 text-neon-success border-neon-success/30',
        reserved: 'bg-neon-reserved/20 text-neon-reserved border-neon-reserved/30',
        occupied: 'bg-neon-occupied/20 text-neon-occupied border-neon-occupied/30',
      };
      return colors[value as TableStatus];
    }

    if (type === 'payment') {
      const colors = {
        pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        paid: 'bg-neon-success/20 text-neon-success border-neon-success/30',
        overdue: 'bg-neon-occupied/20 text-neon-occupied border-neon-occupied/30',
      };
      return colors[value as PaymentStatus];
    }

    if (type === 'subcode') {
      const color = SUB_CODE_COLORS[value as SubCode];
      return `border-[${color}]/30 text-[${color}]`;
    }

    return '';
  };

  return (
    <Badge
      variant="outline"
      className={cn('text-xs font-semibold uppercase', getStyles(), className)}
      style={
        type === 'subcode'
          ? {
              borderColor: `${SUB_CODE_COLORS[value as SubCode]}50`,
              color: SUB_CODE_COLORS[value as SubCode],
            }
          : undefined
      }
    >
      {value}
    </Badge>
  );
};
