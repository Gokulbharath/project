import Icon from '@/components/ui/Icon';
import { Button } from '@/components/ui/button';

type Props = {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
};

export const ZoomControls = ({ scale, onZoomIn, onZoomOut, onFit }: Props) => {
  return (
    <div className="absolute right-4 top-4 z-20 pointer-events-auto flex flex-col gap-2 glass neon-border p-2 rounded-lg">
      <Button size="sm" variant="outline" onClick={onZoomOut} disabled={scale <= 0.5} className="h-9 w-9 p-0">
        <Icon name="zoom-out" size={16} />
      </Button>
      <div className="text-xs text-text-dim text-center font-medium w-9 py-1">{Math.round(scale * 100)}%</div>
      <Button size="sm" variant="outline" onClick={onFit} className="h-9 w-9 p-0">
        <Icon name="fit" size={16} />
      </Button>
      <Button size="sm" variant="outline" onClick={onZoomIn} disabled={scale >= 2} className="h-9 w-9 p-0">
        <Icon name="zoom-in" size={16} />
      </Button>
    </div>
  );
};

export default ZoomControls;

