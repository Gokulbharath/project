import { useEffect, useRef, useState } from 'react';

export const HitTestProbe = () => {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Alt+H toggles probe
      if (e.altKey && (e.key === 'h' || e.key === 'H')) {
        setActive((v) => !v);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (active) {
      // create overlay
      if (!overlayRef.current) {
        const el = document.createElement('div');
        el.style.position = 'fixed';
        el.style.pointerEvents = 'none';
        el.style.border = '2px solid red';
        el.style.zIndex = '99999';
        el.style.transition = 'all 120ms ease';
        document.body.appendChild(el);
        overlayRef.current = el;
      }

      const probe = () => {
        try {
          // left-sidebar point (20px in)
          const sideX = 20;
          const sideY = 20;
          const topbarX = Math.max(window.innerWidth - 20, 0);
          const topbarY = 20;

          const elSide = document.elementFromPoint(sideX, sideY);
          const elTop = document.elementFromPoint(topbarX, topbarY);

          const logInfo = (label: string, el: Element | null) => {
            if (!el) {
              console.log(`[HitTestProbe] ${label}: no element`);
              return;
            }
            const cs = window.getComputedStyle(el as Element);
            console.log(
              `[HitTestProbe] ${label}:`,
              el.tagName,
              el.className || '(no class)',
              'zIndex=', cs.zIndex,
              'pointerEvents=', cs.pointerEvents
            );

            const rect = el.getBoundingClientRect();
            if (overlayRef.current) {
              overlayRef.current.style.left = `${rect.left}px`;
              overlayRef.current.style.top = `${rect.top}px`;
              overlayRef.current.style.width = `${rect.width}px`;
              overlayRef.current.style.height = `${rect.height}px`;
            }
          };

          // run for sidebar then topbar (overlay will match last one)
          logInfo('sidebar (20,20)', elSide);
          logInfo('topbar (right-20,20)', elTop);
        } catch (err) {
          console.error('[HitTestProbe] probe error', err);
        }
      };

      probe();
      intervalRef.current = window.setInterval(probe, 600);
    } else {
      // deactivate
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (overlayRef.current) {
        overlayRef.current.remove();
        overlayRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (overlayRef.current) overlayRef.current.remove();
    };
  }, [active]);

  return null;
};

export default HitTestProbe;
