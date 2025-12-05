import { useState, useCallback } from 'react';
import { MapCanvas } from '@/components/table-map/MapCanvas';
import { TableDrawer } from '@/components/table-map/TableDrawer';
import { Filters } from '@/components/table-map/Filters';
import { TableLegend } from '@/components/table-map/TableLegend';
import { tables as mockTables } from '@/mock/tables';

type FilterStatus = 'all' | 'available' | 'reserved' | 'occupied';

export const TableMap = () => {
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');

  const selectedTable = mockTables.find((t) => t.id === selectedTableId) || null;

  const filteredTables = mockTables.filter((table) => {
    if (activeFilter === 'all') return true;
    return table.status === activeFilter;
  });

  const counts = {
    all: mockTables.length,
    available: mockTables.filter((t) => t.status === 'available').length,
    reserved: mockTables.filter((t) => t.status === 'reserved').length,
    occupied: mockTables.filter((t) => t.status === 'occupied').length,
  };

  const handleTableClick = useCallback((id?: string) => {
    setSelectedTableId(id || null);
  }, []);

  const handleFilterChange = (filter: FilterStatus) => {
    setActiveFilter(filter);
  };

  const handleDrawerClose = () => {
    setSelectedTableId(null);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="heading-hero">Table Map</h1>
        <p className="text-text-dim">Manage live seating with zoom, pan, and fit-to-screen</p>
      </div>

      {/* Filters */}
      <Filters activeFilter={activeFilter} onFilterChange={handleFilterChange} counts={counts} />

      {/* Legend */}
      <div className="flex items-center gap-8">
        <TableLegend />
      </div>

      {/* Canvas with zoom/pan */}
      <MapCanvas
        items={filteredTables.map((t) => ({
          id: t.id,
          label: t.label,
          section: t.section,
          capacity: t.capacity,
          status: t.status,
          x: t.x,
          y: t.y,
          w: 96,
          h: 128,
          guestName: t.guestName,
          arrivalTime: t.arrivalTime,
          paymentStatus: t.paymentStatus,
          subcodes: t.subcodes,
        }))}
        selectedId={selectedTableId || undefined}
        onSelect={handleTableClick}
        fitConfig={{ padding: 24, minScale: 0.5, maxScale: 2, grid: 8 }}
      />

      {/* Table Drawer */}
      <TableDrawer table={selectedTable} open={!!selectedTable} onOpenChange={handleDrawerClose} />
    </div>
  );
};
