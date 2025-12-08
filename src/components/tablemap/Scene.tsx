import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { TableItem } from '@/types/table';

type Props = {
  viewport: { scale: number; tx: number; ty: number };
  items: TableItem[];
  onPan: (dx: number, dy: number) => void;
  onZoom: (factor: number, cx: number, cy: number) => void;
  children: React.ReactNode;
};

export const Scene = ({ viewport, onPan, onZoom, children }: Props) => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const start = useRef({ x: 0, y: 0 });

  const handleWheel = (e: React.WheelEvent) => {
    if (!stageRef.current?.parentElement) return;
    if (!stageRef.current.parentElement.contains(e.target as Node)) return;
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    if (!isCtrlOrCmd) return;
    e.preventDefault();
    const rect = stageRef.current.parentElement.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    onZoom(factor, cx, cy);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.button !== 1) return;
    setDragging(true);
    start.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    onPan(dx, dy);
    start.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // ensure cleanup of dragging state
  useEffect(() => {
    if (!dragging) return;
    const stop = () => setDragging(false);
    window.addEventListener('blur', stop);
    return () => window.removeEventListener('blur', stop);
  }, [dragging]);

  return (
    <div
      ref={stageRef}
      className={cn(
        'absolute left-0 top-0 w-full h-full z-0',
        dragging ? 'cursor-grabbing' : 'cursor-grab'
      )}
      style={{
        transform: `translate(${viewport.tx}px, ${viewport.ty}px) scale(${viewport.scale})`,
        transformOrigin: '0 0',
      }}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="absolute left-0 top-0 w-full h-full pointer-events-none z-0">
        {/* background grid placeholder */}
      </div>
      <div className="absolute left-0 top-0 w-full h-full z-10 pointer-events-auto">
        {children}
      </div>
    </div>
  );
};

export default Scene;

