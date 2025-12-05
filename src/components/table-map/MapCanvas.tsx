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
    offset,
    fitToView,
    zoomAtPoint,
    pan,
    toScreen,
  } = useFitToCanvas(containerRef, items, config);

  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomAtPoint, fitToView]);

  // Pan with mouse drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Left mouse only
    if (e.target !== stageRef.current && !stageRef.current?.contains(e.target as Node)) return;

    setIsPanning(true);
    setPanStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;

    const deltaX = e.clientX - panStart.x;
    const deltaY = e.clientY - panStart.y;

    pan(deltaX, deltaY);
    setPanStart({ x: e.clientX, y: e.clientY });
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
        className={cn(
          'relative h-[70vh] min-h-[520px] rounded-2xl glass neon-border overflow-hidden',
          'transition-colors duration-200',
          isPanning && 'cursor-grabbing',
          !isPanning && 'cursor-grab'
        )}
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
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: '0 0',
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
          <div className="absolute inset-0 pointer-events-auto">
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
