import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/services/api';
import { toast } from 'sonner';
import type { Table, WalkInBookingForm } from '@/types';
import { UserPlus } from 'lucide-react';

export const WalkIns = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<WalkInBookingForm>({
    guestName: '',
    phone: '',
    tableId: '',
    groupSize: 2,
    minSpend: 0,
    notes: '',
  });

  useEffect(() => {
    const loadTables = async () => {
      const data = await api.tables.getAll();
      setTables(data.filter((t) => t.status === 'available'));
    };
    loadTables();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedTable = tables.find((t) => t.id === formData.tableId);
      await api.bookings.create({
        ...formData,
        minSpend: selectedTable?.minSpend || 0,
      });

      toast.success('Walk-in booking created successfully');
      setFormData({
        guestName: '',
        phone: '',
        tableId: '',
        groupSize: 2,
        minSpend: 0,
        notes: '',
      });
    } catch (error) {
      toast.error('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const selectedTable = tables.find((t) => t.id === formData.tableId);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Walk-in Booking</h1>
        <p className="text-muted-foreground">Create a new booking for walk-in guests</p>
      </div>

      <Card className="glass-card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guestName">Guest Name</Label>
              <Input
                id="guestName"
                placeholder="John Doe"
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                className="bg-white/5 border-white/10"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-white/5 border-white/10"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tableId">Table</Label>
              <Select value={formData.tableId} onValueChange={(value) => setFormData({ ...formData, tableId: value })}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Select a table" />
                </SelectTrigger>
                <SelectContent className="glass">
                  {tables.map((table) => (
                    <SelectItem key={table.id} value={table.id}>
                      {table.id} - {table.category} ({table.capacity} seats)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="groupSize">Group Size</Label>
              <Input
                id="groupSize"
                type="number"
                min="1"
                max="20"
                value={formData.groupSize}
                onChange={(e) => setFormData({ ...formData, groupSize: parseInt(e.target.value) })}
                className="bg-white/5 border-white/10"
                required
              />
            </div>
          </div>

          {selectedTable && (
            <div className="glass p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted-foreground">Minimum Spend</div>
                  <div className="text-2xl font-bold text-neon-success">
                    ${selectedTable.minSpend}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Category</div>
                  <div className="text-lg font-semibold text-white">{selectedTable.category}</div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Special requests or notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="bg-white/5 border-white/10 min-h-24"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-neon-primary hover:bg-neon-primary/80 shadow-neon-md"
            disabled={loading}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {loading ? 'Creating...' : 'Create Booking'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
