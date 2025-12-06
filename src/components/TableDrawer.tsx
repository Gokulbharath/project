import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Table } from '@/types';
import { formatCurrency } from '@/utils/format';
import Icon from '@/components/ui/Icon';

interface TableDrawerProps {
  table: Table | null;
  open: boolean;
  onClose: () => void;
}

export const TableDrawer = ({ table, open, onClose }: TableDrawerProps) => {
  if (!table) return null;

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="glass-card border-t border-white/10">
        <DrawerHeader>
          <DrawerTitle className="text-2xl font-bold text-white flex items-center gap-3">
            Table {table.id}
            <StatusBadge type="table" value={table.status} />
          </DrawerTitle>
          <DrawerDescription>Table details and booking information</DrawerDescription>
        </DrawerHeader>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Icon name="group" size={16} className="" />
                <span className="text-xs font-semibold uppercase">Capacity</span>
              </div>
              <div className="text-2xl font-bold text-white">{table.capacity}</div>
            </div>

            <div className="glass p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Icon name="tag" size={16} className="" />
                <span className="text-xs font-semibold uppercase">Category</span>
              </div>
              <div className="text-2xl font-bold text-neon-primary">{table.category}</div>
            </div>

            <div className="glass p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Icon name="seat" size={16} className="" />
                <span className="text-xs font-semibold uppercase">Shape</span>
              </div>
              <div className="text-2xl font-bold text-white capitalize">{table.shape}</div>
            </div>

            <div className="glass p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Icon name="money" size={16} className="" />
                <span className="text-xs font-semibold uppercase">Min Spend</span>
              </div>
              <div className="text-2xl font-bold text-neon-success">{formatCurrency(table.minSpend)}</div>
            </div>
          </div>

          {table.booking && (
            <>
              <Separator className="bg-white/10" />

              <div>
                <h3 className="text-sm font-semibold text-white mb-4">Booking Information</h3>
                <div className="glass p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Guest Name</span>
                    <span className="text-sm font-semibold text-white">{table.booking.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Group Size</span>
                    <span className="text-sm font-semibold text-white">{table.booking.groupSize} guests</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Sub Code</span>
                    <StatusBadge type="subcode" value={table.booking.subCode} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Payment Status</span>
                    <StatusBadge type="payment" value={table.booking.paymentStatus} />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-neon-primary hover:bg-neon-primary/80">
                  View Full Booking
                </Button>
                <Button variant="outline" className="flex-1">
                  Contact Guest
                </Button>
              </div>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
