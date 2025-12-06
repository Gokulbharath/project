import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useFitToCanvas } from './useFitToCanvas';
import { TableCard } from './TableCard';
import { ZoomControls } from './ZoomControls.tsx';
import type { TableItem, FitConfig } from './types';

interface MapCanvasProps {
  items: TableItem[];
  selectedId?: string;
  onSelect: (id?: string) => void;
  fitConfig?: Partial<FitConfig>;
}

const defaultFitConfig: FitConfig = {
  padding: 24,
  minScale: 0.5,
  maxScale: 2,
  grid: 8,
};

export const MapCanvas = ({
  items,
  selectedId,
  onSelect,
  fitConfig = {},
}: MapCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const config = { ...defaultFitConfig, ...fitConfig };

  const {
    scale,
    fitToView,
    zoomAtPoint,
    pan,
    toScreen,
  } = useFitToCanvas(containerRef, items, config);

  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  // Mouse wheel zoom
  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;

    const handleWheel = (e: WheelEvent) => {
      // Only zoom when Ctrl/Cmd is held to avoid hijacking scroll
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      if (!isCtrlOrCmd) return;

      // Make sure the event occurred inside our container
      if (!el.contains(e.target as Node)) return;

      e.preventDefault();

      const rect = el.getBoundingClientRect();
      const screenPoint = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      const delta = e.deltaY < 0 ? 0.1 : -0.1;
      zoomAtPoint(delta, screenPoint);
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [zoomAtPoint]);

  // Keyboard shortcuts
  // Keyboard shortcuts scoped to the container (container must be focused)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    if (!isCtrlOrCmd) return;

    if (e.key === '-' || e.key === '_') {
      e.preventDefault();
      zoomAtPoint(-0.1, {
        x: (containerRef.current?.clientWidth ?? 0) / 2,
        y: (containerRef.current?.clientHeight ?? 0) / 2,
      });
    } else if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      zoomAtPoint(0.1, {
        x: (containerRef.current?.clientWidth ?? 0) / 2,
        y: (containerRef.current?.clientHeight ?? 0) / 2,
      });
    } else if (e.key === '0') {
      e.preventDefault();
      fitToView();
    }
  };

  // Pan with mouse drag. Attach global listeners so dragging won't get stuck
  // when the pointer moves over interactive children (like table buttons).
  const handleMouseDown = (e: React.MouseEvent) => {
    // Allow left-button drags when clicking the empty background only,
    // or allow middle-button drags anywhere to enable natural panning.
    const isLeft = e.button === 0;
    const isMiddle = e.button === 1;

    if (!isLeft && !isMiddle) return;

    // Start panning only when clicking the container background (not interactive children)
    const clickedContainer = e.target === containerRef.current;
    if (!clickedContainer && !isMiddle) return;

    e.preventDefault();
    setIsPanning(true);
    panStartRef.current = { x: e.clientX, y: e.clientY };

    // Global move/up handlers to keep pan responsive across children
    const handleDocMove = (ev: MouseEvent) => {
      const deltaX = ev.clientX - panStartRef.current.x;
      const deltaY = ev.clientY - panStartRef.current.y;
      pan(deltaX, deltaY);
      panStartRef.current = { x: ev.clientX, y: ev.clientY };
    };

    const handleDocUp = () => {
      setIsPanning(false);
      document.removeEventListener('mousemove', handleDocMove);
      document.removeEventListener('mouseup', handleDocUp);
    };

    document.addEventListener('mousemove', handleDocMove);
    document.addEventListener('mouseup', handleDocUp);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // keep legacy handler for React events (no-op when global listeners are attached)
    if (!isPanning) return;
    const deltaX = e.clientX - panStartRef.current.x;
    const deltaY = e.clientY - panStartRef.current.y;
    pan(deltaX, deltaY);
    panStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Touch support
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.touches.length !== 1) return;

    const deltaX = e.touches[0].clientX - touchStartRef.current.x;
    const deltaY = e.touches[0].clientY - touchStartRef.current.y;

    pan(deltaX, deltaY);
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
  };

  const handleZoomIn = () => {
    if (!containerRef.current) return;
    const centerX = (containerRef.current.clientWidth ?? 0) / 2;
    const centerY = (containerRef.current.clientHeight ?? 0) / 2;
    zoomAtPoint(0.1, { x: centerX, y: centerY });
  };

  const handleZoomOut = () => {
    if (!containerRef.current) return;
    const centerX = (containerRef.current.clientWidth ?? 0) / 2;
    const centerY = (containerRef.current.clientHeight ?? 0) / 2;
    zoomAtPoint(-0.1, { x: centerX, y: centerY });
  };

  return (
    <div className="relative">
      {/* Canvas Container */}
      <div
        ref={containerRef}
        tabIndex={0}
        className={cn(
          'relative z-0 h-[72vh] min-h-[520px] rounded-2xl glass neon-border overflow-hidden',
          'transition-colors duration-200',
          isPanning && 'cursor-grabbing',
          !isPanning && 'cursor-grab'
        )}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Stage (transformed) */}
        <div
          ref={stageRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          {/* Background grid (optional, subtle) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-5"
            style={{ width: `${items.length ? 1200 : 600}px`, height: `${items.length ? 800 : 400}px` }}
          >
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Table Cards */}
          <div className="absolute inset-0 pointer-events-none">
            {items.map((table) => {
              const screenPos = toScreen({ x: table.x, y: table.y });
              const w = (table.w ?? 96) * scale;
              const h = (table.h ?? 128) * scale;

              return (
                <TableCard
                  key={table.id}
                  table={table}
                  selected={selectedId === table.id}
                  onOpen={() => onSelect(table.id)}
                  className="pointer-events-auto"
                  viewportScale={scale}
                  style={{
                    position: 'absolute',
                    left: `${screenPos.x}px`,
                    top: `${screenPos.y}px`,
                    width: `${w}px`,
                    height: `${h}px`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Zoom Controls (floating, top-right) */}
      <ZoomControls scale={scale} onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onFit={fitToView} />
    </div>
  );
};
