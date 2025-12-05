import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { TableData } from '@/mock/tables';

interface TableDrawerProps {
  table: TableData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const subcodeBadgeColors = {
  K1: 'bg-cyan/20 text-cyan',
  K2: 'bg-blue/20 text-blue',
  K3: 'bg-neon/20 text-neon',
  K4: 'bg-green/20 text-green',
  K5: 'bg-yellow/20 text-yellow',
  K6: 'bg-pink/20 text-pink',
  K7: 'bg-red/20 text-red',
};

export const TableDrawer = ({ table, open, onOpenChange }: TableDrawerProps) => {
  if (!open || !table) return null;

  const paymentStatusColors = {
    pending: 'bg-yellow/20 text-yellow',
    paid: 'bg-cyan/20 text-cyan',
    failed: 'bg-red/20 text-red',
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 transition-opacity duration-200',
          open ? 'opacity-100 visible' : 'opacity-0 invisible',
        )}
        onClick={() => onOpenChange(false)}
        style={{
          background: 'rgba(0,0,0,.4)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed right-0 top-0 z-50 h-screen w-full max-w-sm glass neon-border flex flex-col',
          'transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[rgba(138,92,255,.15)]">
          <div>
            <h2 className="text-xl font-semibold text-text-high">Table {table.label}</h2>
            <p className="text-xs text-text-dim mt-1">{table.section} Section</p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors focus:ring-2 focus:ring-[rgba(138,92,255,.6)]"
          >
            <X className="w-5 h-5 text-text-dim" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-text-dim mb-1">Guest Name</p>
              <p className="text-sm font-medium text-text-high">
                {table.guestName || '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-dim mb-1">Group Size</p>
              <p className="text-sm font-medium text-text-high">
                {table.capacity} Guests
              </p>
            </div>
            <div>
              <p className="text-xs text-text-dim mb-1">Arrival Time</p>
              <p className="text-sm font-medium text-text-high">
                {table.arrivalTime || '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-dim mb-1">Payment Status</p>
              {table.paymentStatus && (
                <span className={cn('k-badge', paymentStatusColors[table.paymentStatus])}>
                  {table.paymentStatus === 'paid' ? 'Deposit Paid' : table.paymentStatus === 'pending' ? 'Pending' : 'Failed'}
                </span>
              )}
            </div>
          </div>

          {/* Subcodes */}
          {table.subcodes && table.subcodes.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-text-dim mb-3 uppercase tracking-wider">
                Subcodes
              </p>
              <div className="flex flex-wrap gap-2">
                {['K1', 'K2', 'K3', 'K4', 'K5', 'K6', 'K7'].map((code) => {
                  const isActive = table.subcodes?.includes(code);
                  return (
                    <button
                      key={code}
                      className={cn(
                        'k-badge transition-all duration-200 focus:ring-2 focus:ring-[rgba(138,92,255,.6)]',
                        isActive
                          ? cn('bg-gradient-to-r from-neon to-cyan shadow-glow', subcodeBadgeColors[code as keyof typeof subcodeBadgeColors])
                          : 'bg-white/5 text-text-dim hover:bg-white/10',
                      )}
                    >
                      {code}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="border-t border-[rgba(138,92,255,.15)] p-6 space-y-3">
          <Button
            className="w-full bg-neon hover:bg-neon/80 text-white shadow-glow transition-all duration-200"
          >
            <Check className="w-4 h-4 mr-2" />
            Check-In Guest
          </Button>
          <Button
            variant="outline"
            className="w-full border-[rgba(138,92,255,.25)] text-neon hover:bg-neon/5"
          >
            Update Booking
          </Button>
        </div>
      </div>
    </>
  );
};
