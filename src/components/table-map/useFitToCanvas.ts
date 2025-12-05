import { useEffect, useRef, useState, useCallback } from 'react';
import type { TableItem, FitConfig, Point, BoundingBox, CanvasState } from './types';

export const useFitToCanvas = (
  containerRef: React.RefObject<HTMLDivElement>,
  items: TableItem[],
  config: FitConfig
) => {
  const [state, setState] = useState<CanvasState>({ scale: 1, offset: { x: 0, y: 0 } });
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Compute bounding box of all tables in design space
  const getBoundingBox = useCallback((): BoundingBox | null => {
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

    return { minX, minY, maxX, maxY };
  }, [items]);

  // Fit design-space bbox to viewport with padding
  const fitToView = useCallback(() => {
    if (!containerRef.current) return;

    const bbox = getBoundingBox();
    if (!bbox) return;

    const viewW = containerRef.current.clientWidth;
    const viewH = containerRef.current.clientHeight;

    const bboxW = bbox.maxX - bbox.minX;
    const bboxH = bbox.maxY - bbox.minY;

    // Compute scale: fit bbox in view minus padding, aspect-ratio preserving
    const scaleX = (viewW - 2 * config.padding) / bboxW;
    const scaleY = (viewH - 2 * config.padding) / bboxH;
    const rawScale = Math.min(scaleX, scaleY);

    // Clamp scale
    const scale = Math.max(config.minScale, Math.min(config.maxScale, rawScale));

    // Compute offset to center the scaled bbox in the view
    const scaledW = bboxW * scale;
    const scaledH = bboxH * scale;
    const offsetX = (viewW - scaledW) / 2 - bbox.minX * scale;
    const offsetY = (viewH - scaledH) / 2 - bbox.minY * scale;

    setState({ scale, offset: { x: offsetX, y: offsetY } });
  }, [containerRef, getBoundingBox, config]);

  // Transform design coords to screen coords
  const toScreen = useCallback(
    (point: Point): Point => {
      return {
        x: state.offset.x + point.x * state.scale,
        y: state.offset.y + point.y * state.scale,
      };
    },
    [state]
  );

  // Transform screen coords to design coords
  const toDesign = useCallback(
    (point: Point): Point => {
      return {
        x: (point.x - state.offset.x) / state.scale,
        y: (point.y - state.offset.y) / state.scale,
      };
    },
    [state]
  );

  // Snap design coord to grid
  const snapToGrid = useCallback(
    (value: number): number => {
      return Math.round(value / config.grid) * config.grid;
    },
    [config.grid]
  );

  // Clamp design coords to bbox with margin
  const clampToDesignBounds = useCallback(
    (point: Point, itemW: number = 96, itemH: number = 128): Point => {
      const bbox = getBoundingBox();
      if (!bbox) return point;

      return {
        x: Math.max(bbox.minX, Math.min(bbox.maxX - itemW, point.x)),
        y: Math.max(bbox.minY, Math.min(bbox.maxY - itemH, point.y)),
      };
    },
    [getBoundingBox]
  );

  // Update scale with clamping
  const setScale = useCallback((scale: number) => {
    const clampedScale = Math.max(config.minScale, Math.min(config.maxScale, scale));
    setState((prev) => ({ ...prev, scale: clampedScale }));
  }, [config]);

  // Update offset
  const setOffset = useCallback((offset: Point) => {
    setState((prev) => ({ ...prev, offset }));
  }, []);

  // Zoom at cursor point (preserves cursor anchor)
  const zoomAtPoint = useCallback(
    (delta: number, screenPoint: Point) => {
      setState((prev) => {
        // Design coords of cursor before zoom
        const designBefore = {
          x: (screenPoint.x - prev.offset.x) / prev.scale,
          y: (screenPoint.y - prev.offset.y) / prev.scale,
        };

        const newScale = Math.max(config.minScale, Math.min(config.maxScale, prev.scale + delta));

        // New offset to keep design point at cursor after zoom
        const newOffset = {
          x: screenPoint.x - designBefore.x * newScale,
          y: screenPoint.y - designBefore.y * newScale,
        };

        return { scale: newScale, offset: newOffset };
      });
    },
    [config]
  );

  // Pan with clamping
  const pan = useCallback((deltaX: number, deltaY: number) => {
    setState((prev) => {
      // Clamp offset so content doesn't drift too far
      const bbox = getBoundingBox();
      if (!bbox) return prev;

      const scaledW = (bbox.maxX - bbox.minX) * prev.scale;
      const scaledH = (bbox.maxY - bbox.minY) * prev.scale;

      // Allow some overpan but not excessive
      const maxOverpan = 100;
      const minOffsetX = -scaledW + maxOverpan;
      const maxOffsetX = containerRef.current?.clientWidth ?? 0 - maxOverpan;
      const minOffsetY = -scaledH + maxOverpan;
      const maxOffsetY = containerRef.current?.clientHeight ?? 0 - maxOverpan;

      return {
        ...prev,
        offset: {
          x: Math.max(minOffsetX, Math.min(maxOffsetX, prev.offset.x + deltaX)),
          y: Math.max(minOffsetY, Math.min(maxOffsetY, prev.offset.y + deltaY)),
        },
      };
    });
  }, [containerRef, getBoundingBox]);

  // Set up ResizeObserver to refit on container resize
  useEffect(() => {
    if (!containerRef.current) return;

    resizeObserverRef.current = new ResizeObserver(() => {
      fitToView();
    });

    resizeObserverRef.current.observe(containerRef.current);

    return () => {
      resizeObserverRef.current?.disconnect();
    };
  }, [containerRef, fitToView]);

  // Fit on mount and when items change
  useEffect(() => {
    fitToView();
  }, [fitToView]);

  return {
    scale: state.scale,
    offset: state.offset,
    fitToView,
    setScale,
    setOffset,
    zoomAtPoint,
    pan,
    toScreen,
    toDesign,
    snapToGrid,
    clampToDesignBounds,
    getBoundingBox,
  };
};
