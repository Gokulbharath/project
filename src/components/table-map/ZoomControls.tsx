import Icon from '@/components/ui/Icon';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ZoomControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
}

export const ZoomControls = ({ scale, onZoomIn, onZoomOut, onFit }: ZoomControlsProps) => {

  return (
    <TooltipProvider>
      <div className="absolute top-4 right-4 z-20 pointer-events-auto flex flex-col gap-2 glass neon-border p-2 rounded-lg">
        {/* Zoom Out */}
        <Tooltip>
          <TooltipTrigger asChild>
              <Button
              size="sm"
              variant="outline"
               onClick={onZoomOut}
              disabled={scale <= 0.5}
              className="h-9 w-9 p-0 border-[rgba(138,92,255,.25)] hover:bg-neon/10 focus:ring-[rgba(138,92,255,.6)]"
              title="Zoom Out (Cmd -)"
            >
              <Icon name="zoom-out" size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="text-xs">
            Zoom Out (Cmd -)
          </TooltipContent>
        </Tooltip>

        {/* Scale indicator */}
        <div className="text-xs text-text-dim text-center font-medium w-9 py-1">
          {Math.round(scale * 100)}%
        </div>

        {/* Fit */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={onFit}
              className="h-9 w-9 p-0 border-[rgba(138,92,255,.25)] hover:bg-neon/10 focus:ring-[rgba(138,92,255,.6)]"
              title="Fit to Screen (Cmd 0)"
            >
              <Icon name="fit" size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="text-xs">
            Fit to Screen (Cmd 0)
          </TooltipContent>
        </Tooltip>

        {/* Zoom In */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
               onClick={onZoomIn}
              disabled={scale >= 2}
              className="h-9 w-9 p-0 border-[rgba(138,92,255,.25)] hover:bg-neon/10 focus:ring-[rgba(138,92,255,.6)]"
              title="Zoom In (Cmd +)"
            >
              <Icon name="zoom-in" size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="text-xs">
            Zoom In (Cmd +)
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
