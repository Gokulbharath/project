import { useRef, useState, useCallback, useEffect } from 'react';
import { useMemo } from 'react';
import type { TableItem, Viewport, FitOpts, BoundingBox } from '@/types/floor';

const DEFAULT_OPTS: FitOpts = {
  padding: 24,
  minScale: 0.5,
  maxScale: 2,
};

export const useViewport = (opts: Partial<FitOpts> = {}) => {
  const config = useMemo(() => ({ ...DEFAULT_OPTS, ...opts }), [opts]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState<Viewport>({ scale: 1, tx: 0, ty: 0 });
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

  // Compute bounding box of tables in design space
  const computeBBox = useCallback((items: TableItem[]): BoundingBox | null => {
    if (items.length === 0) return null;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    items.forEach((item) => {
      const w = item.w ?? 96;
      const h = item.h ?? 128;
      minX = Math.min(minX, item.x);
      minY = Math.min(minY, item.y);
      maxX = Math.max(maxX, item.x + w);
      maxY = Math.max(maxY, item.y + h);
    });

    const width = maxX - minX;
    const height = maxY - minY;

    return { minX, minY, maxX, maxY, width, height };
  }, []);

  // Fit all items to view with padding
  const fitAll = useCallback(
    (items: TableItem[]) => {
      if (!containerRef.current) return;

      const bbox = computeBBox(items);
      if (!bbox) {
        setViewport({ scale: 1, tx: 0, ty: 0 });
        return;
      }

      const vw = containerRef.current.clientWidth;
      const vh = containerRef.current.clientHeight;

      // Compute scale to fit bbox with padding
      const scaleX = (vw - 2 * config.padding) / bbox.width;
      const scaleY = (vh - 2 * config.padding) / bbox.height;
      const rawScale = Math.min(scaleX, scaleY);
      const scale = Math.max(config.minScale, Math.min(config.maxScale, rawScale));

      // Center bbox in view
      const scaledW = bbox.width * scale;
      const scaledH = bbox.height * scale;
      const tx = (vw - scaledW) / 2 - bbox.minX * scale;
      const ty = (vh - scaledH) / 2 - bbox.minY * scale;

      setViewport({ scale, tx, ty });
    },
    [computeBBox, config]
  );

  // Zoom at cursor position (preserves focal point)
  const zoomAt = useCallback(
    (factor: number, screenCx: number, screenCy: number) => {
      setViewport((prev) => {
        // Design coords at cursor before zoom
        const dx = (screenCx - prev.tx) / prev.scale;
        const dy = (screenCy - prev.ty) / prev.scale;

        // Apply zoom factor
        const newScale = Math.max(
          config.minScale,
          Math.min(config.maxScale, prev.scale * factor)
        );

        // Adjust translation to keep cursor point anchored
        const newTx = screenCx - dx * newScale;
        const newTy = screenCy - dy * newScale;

        return { scale: newScale, tx: newTx, ty: newTy };
      });
    },
    [config]
  );

  // Pan by delta (with clamping)
  const panBy = useCallback((dx: number, dy: number) => {
    setViewport((prev) => {
      // Simple pan without aggressive clamping (allows some overpan for feel)
      return {
        ...prev,
        tx: prev.tx + dx,
        ty: prev.ty + dy,
      };
    });
  }, []);

  // Set scale directly with clamping
  const setScale = useCallback((scale: number) => {
    setViewport((prev) => ({
      ...prev,
      scale: Math.max(config.minScale, Math.min(config.maxScale, scale)),
    }));
  }, [config]);

  // Set translation directly
  const setTranslate = useCallback((tx: number, ty: number) => {
    setViewport((prev) => ({ ...prev, tx, ty }));
  }, []);

  // Transform design coords to screen coords
  const toScreen = useCallback(
    (point: { x: number; y: number }) => {
      return {
        x: viewport.tx + point.x * viewport.scale,
        y: viewport.ty + point.y * viewport.scale,
      };
    },
    [viewport]
  );

  // Transform screen coords to design coords
  const toDesign = useCallback(
    (point: { x: number; y: number }) => {
      return {
        x: (point.x - viewport.tx) / viewport.scale,
        y: (point.y - viewport.ty) / viewport.scale,
      };
    },
    [viewport]
  );

  // Set up ResizeObserver to track container size
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current) {
        setContainerSize({
          w: containerRef.current.clientWidth,
          h: containerRef.current.clientHeight,
        });
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  return {
    ref: containerRef,
    viewport,
    containerSize,
    fitAll,
    zoomAt,
    panBy,
    setScale,
    setTranslate,
    toScreen,
    toDesign,
    computeBBox,
  };
};
