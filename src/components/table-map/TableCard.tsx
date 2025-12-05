import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TableItem } from '@/types/floor';

interface TableCardProps {
  table: TableItem;
  selected?: boolean;
  onOpen?: () => void;
  viewportScale: number;
  style?: React.CSSProperties;
}

const statusColors = {
  available: 'border-cyan shadow-[0_0_0_1px_rgba(77,212,255,.35)]',
  reserved: 'border-blue shadow-[0_0_0_1px_rgba(46,177,255,.35)]',
  occupied: 'border-pink shadow-[0_0_0_1px_rgba(255,77,141,.35)]',
};

const sectionColors: Record<string, string> = {
  VIP: 'bg-neon/20 text-neon',
  Premium: 'bg-blue/20 text-blue',
  Standard: 'bg-cyan/20 text-cyan',
};

export const TableCard = ({
  table,
  selected,
  onOpen,
  viewportScale,
  style,
}: TableCardProps) => {
  const { label, section, capacity, status } = table;
  const w = table.w ?? 96;
  const h = table.h ?? 128;

  const defaultStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${table.x}px`,
    top: `${table.y}px`,
    width: `${w}px`,
    height: `${h}px`,
  };

  const mergedStyle = { ...defaultStyle, ...(style || {}) } as React.CSSProperties;


  return (
    <button
      onClick={onOpen}
      style={mergedStyle}
      className={cn(
        'group relative rounded-2xl border glass transition-all duration-200',
        'cursor-pointer focus:outline-none focus:ring-2 focus:ring-[rgba(138,92,255,.6)]',
        'hover:shadow-glow',
        statusColors[status],
        selected && 'ring-2 ring-neon shadow-glow'
      )}
    >
      {/* Anti-scale content wrapper */}
      <div
        className="absolute inset-0 p-2 flex flex-col justify-between"
        style={{
          transform: `scale(${1 / viewportScale})`,
          transformOrigin: 'top left',
          width: `${w * viewportScale}px`,
          height: `${h * viewportScale}px`,
        }}
      >
        {/* Top row: Label + Section */}
        <div className="flex items-start justify-between">
          <div className="text-xs font-bold text-text-high tracking-wider opacity-80 truncate">
            {label}
          </div>
          <span className={cn('k-badge text-[10px]', sectionColors[section])}>
            {section.slice(0, 3)}
          </span>
        </div>

        {/* Bottom row: Capacity */}
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3 text-text-dim flex-shrink-0" />
          <span className="text-xs text-text-dim font-medium">{capacity}</span>
        </div>
      </div>

    </button>
  );
};
