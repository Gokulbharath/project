import { cn } from '@/lib/utils';
import type { Table } from '@/types';
import { STATUS_COLORS } from '@/utils/constants';
import { Users } from 'lucide-react';

interface TableBlockProps {
  table: Table;
  onClick?: () => void;
  className?: string;
}

export const TableBlock = ({ table, onClick, className }: TableBlockProps) => {
  const statusColor = STATUS_COLORS[table.status];

  return (
    <button
      onClick={onClick}
      className={cn(
        'p-4 rounded-xl transition-all duration-300 hover-lift relative overflow-hidden group',
        'border-2 backdrop-blur-sm',
        table.shape === 'round' ? 'rounded-full aspect-square' : 'aspect-square',
        className
      )}
      style={{
        backgroundColor: `${statusColor}15`,
        borderColor: `${statusColor}40`,
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `radial-gradient(circle at center, ${statusColor}20 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-2">
        <div className="text-xl font-bold" style={{ color: statusColor }}>
          {table.id}
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="w-3 h-3" />
          <span>{table.capacity}</span>
        </div>

        <div className="text-[10px] uppercase font-semibold" style={{ color: statusColor }}>
          {table.category}
        </div>

        {table.booking && (
          <div className="text-[10px] text-muted-foreground truncate w-full text-center">
            {table.booking.name}
          </div>
        )}
      </div>
    </button>
  );
};
