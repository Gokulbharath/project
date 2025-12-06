import { Card } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { formatTimeAgo } from '@/utils/format';
import type { Arrival } from '@/types';
import Icon from '@/components/ui/Icon';

interface ArrivalItemProps {
  arrival: Arrival;
}

export const ArrivalItem = ({ arrival }: ArrivalItemProps) => {
  return (
    <Card className="glass-card p-4 hover-lift hover-glow animate-slide-in">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-semibold text-white">{arrival.guestName}</h3>
            <StatusBadge type="subcode" value={arrival.subCode} />
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Icon name="group" size={12} className="w-3 h-3" />
              <span>{arrival.groupSize} guests</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="clock" size={12} className="w-3 h-3" />
              <span>{formatTimeAgo(arrival.timestamp)}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm font-semibold text-neon-primary">{arrival.tableId}</div>
          <div className="text-xs text-muted-foreground">Table</div>
        </div>
      </div>
    </Card>
  );
};
