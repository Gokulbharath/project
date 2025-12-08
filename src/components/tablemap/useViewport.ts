import { useEffect, useRef, useState } from 'react';
import type { TableItem } from '@/types/table';

type Viewport = { scale: number; tx: number; ty: number };
type FitOpts = { padding: number; minScale: number; maxScale: number };

const defaultSize = { w: 96, h: 128 };

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

const getBounds = (items: TableItem[]) => {
  if (!items.length) return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  const minX = Math.min(...items.map((t) => t.x));
  const minY = Math.min(...items.map((t) => t.y));
  const maxX = Math.max(...items.map((t) => t.x + (t.w ?? defaultSize.w)));
  const maxY = Math.max(...items.map((t) => t.y + (t.h ?? defaultSize.h)));
  return { minX, minY, maxX, maxY };
};

export function useViewport(opts: FitOpts, items: TableItem[]) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<TableItem[]>(items);
  const [viewport, setViewport] = useState<Viewport>({ scale: 1, tx: 0, ty: 0 });

  itemsRef.current = items;

  const fitToView = () => {
    const el = containerRef.current;
    if (!el) return;
    const { padding, minScale, maxScale } = opts;
    const { minX, minY, maxX, maxY } = getBounds(itemsRef.current);
    const viewW = el.clientWidth - padding * 2;
    const viewH = el.clientHeight - padding * 2;
    if (viewW <= 0 || viewH <= 0 || maxX - minX === 0 || maxY - minY === 0) return;

    const scale = clamp(Math.min(viewW / (maxX - minX), viewH / (maxY - minY)), minScale, maxScale);
    const tx = padding - minX * scale + (viewW - (maxX - minX) * scale) / 2;
    const ty = padding - minY * scale + (viewH - (maxY - minY) * scale) / 2;
    setViewport({ scale, tx, ty });
  };

  const zoomAt = (factor: number, cx: number, cy: number) => {
    setViewport((prev) => {
      const nextScale = clamp(prev.scale * factor, opts.minScale, opts.maxScale);
      const dx = cx - prev.tx;
      const dy = cy - prev.ty;
      return {
        scale: nextScale,
        tx: cx - (dx * nextScale) / prev.scale,
        ty: cy - (dy * nextScale) / prev.scale,
      };
    });
  };

  const panBy = (dx: number, dy: number) => {
    const el = containerRef.current;
    if (!el) return;
    const { padding } = opts;
    const { minX, minY, maxX, maxY } = getBounds(itemsRef.current);
    setViewport((prev) => {
      const nextTx = prev.tx + dx;
      const nextTy = prev.ty + dy;
      const minTx = padding - minX * prev.scale;
      const maxTx = el.clientWidth - padding - maxX * prev.scale;
      const minTy = padding - minY * prev.scale;
      const maxTy = el.clientHeight - padding - maxY * prev.scale;
      return {
        scale: prev.scale,
        tx: clamp(nextTx, maxTx, minTx),
        ty: clamp(nextTy, maxTy, minTy),
      };
    });
  };

  useEffect(() => {
    fitToView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => fitToView());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { containerRef, viewport, fitToView, zoomAt, panBy };
}

