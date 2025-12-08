import { cn } from '@/lib/utils';
import Icon from '@/components/ui/Icon';
import type { TableItem } from '@/types/table';

type Props = {
  table: TableItem;
  scale: number;
  onOpen: () => void;
};

const statusBorder: Record<TableItem['status'], string> = {
  available: 'border-cyan/60 hover:shadow-glow',
  reserved: 'border-blue/60 hover:shadow-glow',
  occupied: 'border-pink/60 hover:shadow-glow',
};

export const TableCard = ({ table, scale, onOpen }: Props) => {
  const w = table.w ?? 96;
  const h = table.h ?? 128;

  return (
    <div
      className="absolute"
      style={{ left: table.x, top: table.y, width: w, height: h }}
    >
      <button
        onClick={onOpen}
        className={cn(
          'relative w-full h-full glass rounded-2xl border transition-all duration-200 focus:ring-2 focus:ring-[rgba(138,92,255,.6)]',
          statusBorder[table.status]
        )}
      >
        <div
          className="absolute left-0 top-0 w-full h-full p-2 flex flex-col justify-between"
          style={{
            transform: `scale(${1 / scale})`,
            transformOrigin: 'top left',
            width: `${w * scale}px`,
            height: `${h * scale}px`,
          }}
        >
          <div className="flex items-start justify-between">
            <div className="text-xs font-bold text-text-high tracking-wider opacity-80 truncate">
              {table.label}
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-text-high uppercase">
              {table.section.slice(0, 3)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="group" size={12} className="text-text-dim flex-shrink-0" />
            <span className="text-xs text-text-dim font-medium">{table.capacity}</span>
          </div>
        </div>
      </button>
    </div>
  );
};

export default TableCard;

