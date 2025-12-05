import { useEffect, useState } from 'react';
import { TableBlock } from '@/components/TableBlock';
import { TableDrawer } from '@/components/TableDrawer';
import { api } from '@/services/api';
import { useSocket } from '@/hooks/useSocket';
import type { Table } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export const TableMap = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [loading, setLoading] = useState(true);
  const { connected, on } = useSocket();

  useEffect(() => {
    const loadTables = async () => {
      try {
        const data = await api.tables.getAll();
        setTables(data);
      } catch (error) {
        console.error('Failed to load tables:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTables();
  }, []);

  useEffect(() => {
    const cleanup = on('table:updated', (updatedTable: Table) => {
      setTables((prev) => prev.map((t) => (t.id === updatedTable.id ? updatedTable : t)));
    });

    return cleanup;
  }, [on]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Live Table Map</h1>
            <p className="text-muted-foreground">Real-time table status</p>
          </div>
          <Skeleton className="h-6 w-32" />
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Live Table Map</h1>
          <p className="text-muted-foreground">Real-time table status</p>
        </div>

        <Badge
          variant={connected ? 'default' : 'destructive'}
          className={connected ? 'bg-neon-success/20 text-neon-success border-neon-success/30' : ''}
        >
          {connected ? 'Live' : 'Disconnected'}
        </Badge>
      </div>

      <div className="glass-card p-6">
        <div className="grid grid-cols-4 gap-4">
          {tables.map((table) => (
            <TableBlock key={table.id} table={table} onClick={() => setSelectedTable(table)} />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-neon-success/30 border-2 border-neon-success" />
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-neon-reserved/30 border-2 border-neon-reserved" />
          <span className="text-muted-foreground">Reserved</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-neon-occupied/30 border-2 border-neon-occupied" />
          <span className="text-muted-foreground">Occupied</span>
        </div>
      </div>

      <TableDrawer table={selectedTable} open={!!selectedTable} onClose={() => setSelectedTable(null)} />
    </div>
  );
};
