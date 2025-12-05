import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { Viewport } from '@/types/floor';

interface SceneProps {
  viewport: Viewport;
  onWheelZoom?: (factor: number, cx: number, cy: number) => void;
  onDragPan?: (dx: number, dy: number) => void;
  children: React.ReactNode;
}

export const Scene = ({ viewport, onWheelZoom, onDragPan, children }: SceneProps) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  // Wheel zoom with Ctrl or trackpad
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!stageRef.current?.parentElement?.contains(e.target as Node)) return;

      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      // Trackpad pinch fires deltaMode=0; regular scroll fires deltaMode=1
      const isZoomGesture = isCtrlOrCmd || (e.deltaMode === 0 && Math.abs(e.deltaX) < 100);

      if (!isZoomGesture) return;
      if (!onWheelZoom) return;

      e.preventDefault();

      const rect = stageRef.current.parentElement?.getBoundingClientRect();
      if (!rect) return;

      const screenCx = e.clientX - rect.left;
      const screenCy = e.clientY - rect.top;

      // Invert delta: wheel up = zoom in
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      onWheelZoom(factor, screenCx, screenCy);
    };

    document.addEventListener('wheel', handleWheel, { passive: false });
    return () => document.removeEventListener('wheel', handleWheel);
  }, [onWheelZoom]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      if (!isCtrlOrCmd || !onWheelZoom) return;

      const rect = stageRef.current?.parentElement?.getBoundingClientRect();
      if (!rect) return;

      const cx = rect.width / 2;
      const cy = rect.height / 2;

      if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        onWheelZoom(0.9, cx, cy);
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        onWheelZoom(1.1, cx, cy);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onWheelZoom]);

  // Mouse drag pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 1 && e.button !== 2) return; // Middle or right mouse
    if (!(e.buttons === 4 || e.buttons === 2)) return;
    if (!onDragPan) return;

    setIsPanning(true);
    panStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning || !onDragPan) return;

    const dx = e.clientX - panStartRef.current.x;
    const dy = e.clientY - panStartRef.current.y;

    onDragPan(dx, dy);
    panStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Space + drag pan
  const spaceHeldRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        spaceHeldRef.current = true;
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        spaceHeldRef.current = false;
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleStageMouseDown = (e: React.MouseEvent) => {
    if (!spaceHeldRef.current || !onDragPan) return;
    setIsPanning(true);
    panStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleStageMouseMove = (e: React.MouseEvent) => {
    if (!isPanning || !spaceHeldRef.current || !onDragPan) return;

    const dx = e.clientX - panStartRef.current.x;
    const dy = e.clientY - panStartRef.current.y;

    onDragPan(dx, dy);
    panStartRef.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <div
      ref={stageRef}
      className={cn(
        'absolute inset-0 will-change-transform',
        isPanning && 'cursor-grabbing',
        !isPanning && 'cursor-grab'
      )}
      style={{
        transform: `translate(${viewport.tx}px, ${viewport.ty}px) scale(${viewport.scale})`,
        transformOrigin: '0 0',
      }}
      onMouseDown={(e) => {
        handleMouseDown(e);
        handleStageMouseDown(e);
      }}
      onMouseMove={(e) => {
        handleMouseMove(e);
        handleStageMouseMove(e);
      }}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {children}
    </div>
  );
};
