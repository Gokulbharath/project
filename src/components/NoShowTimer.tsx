import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock } from 'lucide-react';
import type { BookingDetail } from '@/types';

interface NoShowTimerProps {
  booking: BookingDetail;
  onMarkNoShow?: (id: string) => void;
}

export const NoShowTimer = ({ booking, onMarkNoShow }: NoShowTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const bookingTime = new Date(`${booking.date}T${booking.time}`).getTime();
    const graceMinutes = 15;
    const noShowTime = bookingTime + graceMinutes * 60 * 1000;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, noShowTime - now);
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [booking]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <Card className="glass-card p-4 border-destructive/30 hover-lift">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-destructive animate-pulse" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">{booking.guestName}</h3>
            <div className="text-xs text-muted-foreground mt-1">
              Table {booking.tableId} • {booking.groupSize} guests
            </div>
          </div>
        </div>

        <div className="text-right flex items-center gap-3">
          <div>
            <div className="text-lg font-bold text-destructive flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className="text-xs text-muted-foreground">Until no-show</div>
          </div>

          {onMarkNoShow && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onMarkNoShow(booking.id)}
              disabled={timeLeft > 0}
            >
              Mark No-Show
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
