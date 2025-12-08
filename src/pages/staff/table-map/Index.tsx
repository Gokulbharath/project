import { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import Filters from '@/components/tablemap/Filters';
import Scene from '@/components/tablemap/Scene';
import { TableCard } from '@/components/tablemap/TableCard';
import { TableDrawer } from '@/components/tablemap/TableDrawer';
import { ZoomControls } from '@/components/tablemap/ZoomControls';
import { useViewport } from '@/components/tablemap/useViewport';
import { tables as mockTables } from '@/mock/tables';
import type { TableItem } from '@/types/table';

const fitOpts = { padding: 24, minScale: 0.5, maxScale: 2 };
const statuses = ['all', 'available', 'reserved', 'occupied'] as const;
type FilterStatus = (typeof statuses)[number];

export default function TableMapIndex() {
  const [selected, setSelected] = useState<TableItem | null>(null);
  const [filter, setFilter] = useState<FilterStatus>('all');

  const filtered = useMemo(
    () => mockTables.filter((t) => (filter === 'all' ? true : t.status === filter)),
    [filter]
  );

  const { containerRef, viewport, fitToView, zoomAt, panBy } = useViewport(fitOpts, filtered);

  useEffect(() => {
    fitToView();
  }, [fitToView, filter]);

  const counts = {
    all: mockTables.length,
    available: mockTables.filter((t) => t.status === 'available').length,
    reserved: mockTables.filter((t) => t.status === 'reserved').length,
    occupied: mockTables.filter((t) => t.status === 'occupied').length,
  };

  return (
    <div className="space-y-6 pb-8" data-testid="table-map-page">
      <PageHeader title="Table Map" subtitle="Manage live seating" />

      <Filters active={filter} counts={counts} onChange={setFilter as (s: FilterStatus) => void} />

      <div
        id="tablemap-container"
        className="relative w-full h-[72vh] min-h-[520px] overflow-hidden rounded-2xl glass neon-border z-0 isolate"
        ref={containerRef}
      >
        <Scene viewport={viewport} items={filtered} onPan={panBy} onZoom={zoomAt}>
          {filtered.map((t) => (
            <TableCard key={t.id} table={t} scale={viewport.scale} onOpen={() => setSelected(t)} />
          ))}
        </Scene>

        <ZoomControls
          scale={viewport.scale}
          onZoomIn={() =>
            zoomAt(1.1, (containerRef.current?.clientWidth ?? 0) / 2, (containerRef.current?.clientHeight ?? 0) / 2)
          }
          onZoomOut={() =>
            zoomAt(0.9, (containerRef.current?.clientWidth ?? 0) / 2, (containerRef.current?.clientHeight ?? 0) / 2)
          }
          onFit={fitToView}
        />

        <TableDrawer table={selected} open={!!selected} onOpenChange={(open) => !open && setSelected(null)} />
      </div>
    </div>
  );
}
