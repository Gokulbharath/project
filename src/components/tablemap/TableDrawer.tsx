import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Icon from '@/components/ui/Icon';
import { Button } from '@/components/ui/button';
import type { TableItem } from '@/types/table';

type Props = {
  table: TableItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const subcodes = ['K1', 'K2', 'K3', 'K4', 'K5', 'K6', 'K7'];

export const TableDrawer = ({ table, open, onOpenChange }: Props) => {
  const location = useLocation();

  useEffect(() => {
    onOpenChange(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  if (!open || !table) return null;

  return (
    <>
      <div
        className={cn(
          'absolute left-0 top-0 w-full h-full z-5 transition-opacity duration-200 overlay pointer-events-auto',
          open ? 'opacity-100 visible' : 'opacity-0 invisible'
        )}
        onClick={() => onOpenChange(false)}
        style={{ background: 'rgba(0,0,0,.35)', backdropFilter: 'blur(4px)' }}
      />
      <div
        className={cn(
          'absolute right-0 top-0 z-10 h-full w-full max-w-sm glass neon-border flex flex-col pointer-events-auto',
          'transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-start justify-between p-6 border-b border-white/5">
          <div>
            <h2 className="text-xl font-semibold text-text-high">Table {table.label}</h2>
            <p className="text-xs text-text-dim mt-1">{table.section} Section</p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors focus:ring-2 focus:ring-[rgba(138,92,255,.6)]"
          >
            <Icon name="close" size={18} className="text-text-dim" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Info label="Guest" value="—" />
            <Info label="Group Size" value={`${table.capacity} guests`} />
            <Info label="Arrival Time" value="—" />
            <Info label="Payment" value="—" />
          </div>

          <div>
            <p className="text-xs font-semibold text-text-dim mb-3 uppercase tracking-wider">Subcodes</p>
            <div className="flex flex-wrap gap-2">
              {subcodes.map((code) => (
                <span
                  key={code}
                  className="px-2 py-1 rounded text-xs bg-white/5 text-text-dim border border-white/10"
                >
                  {code}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 p-6 space-y-3">
          <Button className="w-full bg-neon hover:bg-neon/80 text-white shadow-glow transition-all duration-200">
            <Icon name="check" size={14} className="mr-2" />
            Check-In Guest
          </Button>
          <Button variant="outline" className="w-full border-white/20 text-neon hover:bg-neon/5">
            Update Booking
          </Button>
        </div>
      </div>
    </>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-text-dim mb-1">{label}</p>
    <p className="text-sm font-medium text-text-high">{value}</p>
  </div>
);

export default TableDrawer;

