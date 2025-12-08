import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Timeline, TimelineItem } from '@/components/common/Timeline';
import Icon from '@/components/ui/Icon';
import { TBooking } from '@/types/staff';
import { formatDate, formatTime, formatTimeAgo } from '@/utils/format';
import { SUB_CODE_COLORS } from '@/utils/constants';

interface DetailDrawerProps {
  booking: TBooking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onMarkPaid: () => void;
  onMarkArrived: () => void;
  onCancel: () => void;
}

export function DetailDrawer({
  booking,
  open,
  onOpenChange,
  onEdit,
  onMarkPaid,
  onMarkArrived,
  onCancel,
}: DetailDrawerProps) {
  if (!booking) return null;

  const timelineItems: TimelineItem[] = [
    {
      id: 'created',
      title: 'Booking Created',
      description: `Created by system`,
      timestamp: booking.createdAt,
    },
    ...(booking.paymentStatus === 'PAID'
      ? [
          {
            id: 'paid',
            title: 'Payment Received',
            description: 'Payment marked as paid',
            timestamp: booking.updatedAt,
          },
        ]
      : []),
    ...(booking.bookingStatus === 'ARRIVED'
      ? [
          {
            id: 'arrived',
            title: 'Guest Arrived',
            description: `Arrived at ${booking.tableLabel || 'table'}`,
            timestamp: booking.updatedAt,
          },
        ]
      : []),
    {
      id: 'updated',
      title: 'Last Updated',
      description: formatTimeAgo(booking.updatedAt),
      timestamp: booking.updatedAt,
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Booking Details</span>
            <span className="font-mono text-sm text-text-dim">{booking.code}</span>
          </SheetTitle>
          <SheetDescription>View and manage booking information</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status Badges */}
          <div className="flex gap-2">
            <StatusBadge status={booking.bookingStatus} type="booking" />
            <StatusBadge status={booking.paymentStatus} type="payment" />
          </div>

          {/* Guest Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-high">Guest Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-text-dim">Name:</span>
                <span className="font-medium">{booking.guestName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-dim">Phone:</span>
                <span>{booking.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-dim">Group Size:</span>
                <span>{booking.groupSize} guests</span>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-high">Booking Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-text-dim">Date:</span>
                <span>{formatDate(booking.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-dim">Time:</span>
                <span>{booking.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-dim">Table:</span>
                <span>{booking.tableLabel || 'Not assigned'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-dim">Category:</span>
                <span className="text-xs px-2 py-1 rounded bg-surface">{booking.category}</span>
              </div>
            </div>
          </div>

          {/* Subcodes */}
          {booking.arrivalSubcodes && booking.arrivalSubcodes.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-high">Arrival Subcodes</h3>
              <div className="flex flex-wrap gap-2">
                {booking.arrivalSubcodes.map((code) => (
                  <span
                    key={code}
                    className="px-2 py-1 rounded text-xs font-mono"
                    style={{
                      backgroundColor: `${SUB_CODE_COLORS[code]}20`,
                      color: SUB_CODE_COLORS[code],
                      border: `1px solid ${SUB_CODE_COLORS[code]}40`,
                    }}
                  >
                    {code}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {booking.notes && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-text-high">Notes</h3>
              <p className="text-sm text-text-dim bg-surface p-3 rounded-lg">{booking.notes}</p>
            </div>
          )}

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-high">Timeline</h3>
            <Timeline items={timelineItems} />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-4 border-t border-border">
            {booking.bookingStatus !== 'ARRIVED' && booking.bookingStatus !== 'CANCELLED' && (
              <Button onClick={onMarkArrived} variant="default" className="w-full">
                <Icon name="check" size={16} className="mr-2" />
                Mark Arrived
              </Button>
            )}
            {booking.paymentStatus !== 'PAID' && (
              <Button onClick={onMarkPaid} variant="default" className="w-full">
                <Icon name="dollar-sign" size={16} className="mr-2" />
                Mark Paid
              </Button>
            )}
            <Button onClick={onEdit} variant="outline" className="w-full">
              <Icon name="edit" size={16} className="mr-2" />
              Reschedule
            </Button>
            {booking.bookingStatus !== 'CANCELLED' && (
              <Button onClick={onCancel} variant="destructive" className="w-full">
                <Icon name="x" size={16} className="mr-2" />
                Cancel Booking
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

