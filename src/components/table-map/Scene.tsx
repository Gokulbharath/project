import { useRef, useState } from 'react';
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

  // Wheel and keyboard handlers are attached to the stage element via
  // props (onWheel, onKeyDown, onKeyUp) so events are scoped to the canvas.

  // Pointer-based pan with pointer capture so panning won't get stuck
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!onDragPan) return;

    const isMiddleOrRight = e.button === 1 || e.button === 2;
    const isSpacePan = spaceHeldRef.current && e.button === 0;

    if (!isMiddleOrRight && !isSpacePan) return;

    // Capture pointer on the stage element so child elements (buttons) don't
    // retain capture and block subsequent interactions/navigation.
    try {
      stageRef.current?.setPointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
    setIsPanning(true);
    panStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPanning || !onDragPan) return;

    const dx = e.clientX - panStartRef.current.x;
    const dy = e.clientY - panStartRef.current.y;

    onDragPan(dx, dy);
    panStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    try {
      stageRef.current?.releasePointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
    setIsPanning(false);
  };

  // Space + drag pan state (scoped to stage focus)
  const spaceHeldRef = useRef(false);

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

  const handleWheel = (e: React.WheelEvent) => {
    if (!stageRef.current) return;
    // Only handle wheel when event is inside this stage's parent container
    if (!stageRef.current.parentElement?.contains(e.target as Node)) return;

    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    const native = e.nativeEvent as WheelEvent;
    const isZoomGesture = isCtrlOrCmd || (native.deltaMode === 0 && Math.abs(native.deltaX) < 100);
    if (!isZoomGesture || !onWheelZoom) return;

    e.preventDefault();

    const rect = stageRef.current.parentElement.getBoundingClientRect();
    const screenCx = e.clientX - rect.left;
    const screenCy = e.clientY - rect.top;
    const factor = native.deltaY < 0 ? 1.1 : 0.9;
    onWheelZoom(factor, screenCx, screenCy);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Space handling
    if (e.code === 'Space') {
      spaceHeldRef.current = true;
      e.preventDefault();
      return;
    }

    // Cmd/Ctrl + +/- zoom while focused on stage
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
    } else if (e.key === '0') {
      // allow fit-to-view via keyboard if desired (handled outside)
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.code === 'Space') {
      spaceHeldRef.current = false;
      e.preventDefault();
    }
  };

  return (
    <div
      ref={stageRef}
      tabIndex={0}
      className={cn(
        'absolute inset-0 will-change-transform z-0',
        isPanning && 'cursor-grabbing',
        !isPanning && 'cursor-grab'
      )}
      style={{
        transform: `translate(${viewport.tx}px, ${viewport.ty}px) scale(${viewport.scale})`,
        transformOrigin: '0 0',
      }}
      onWheel={handleWheel}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onPointerDown={(e) => {
        handlePointerDown(e);
        handleStageMouseDown(e as unknown as React.MouseEvent);
      }}
      onPointerMove={(e) => {
        handlePointerMove(e);
        handleStageMouseMove(e as unknown as React.MouseEvent);
      }}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* visual-only background (does not eat events) */}
      <div className="absolute inset-0 pointer-events-none z-0">{/* decorative grid/gradients */}</div>

      {/* interactive layer */}
      <div className="absolute inset-0 z-10 pointer-events-auto">{children}</div>
    </div>
  );
};
