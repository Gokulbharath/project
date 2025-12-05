import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface FiltersProps {
  activeFilter: 'all' | 'available' | 'reserved' | 'occupied';
  onFilterChange: (filter: 'all' | 'available' | 'reserved' | 'occupied') => void;
  counts: {
    all: number;
    available: number;
    reserved: number;
    occupied: number;
  };
}

export const Filters = ({ activeFilter, onFilterChange, counts }: FiltersProps) => {
  const filters = [
    { value: 'all' as const, label: 'All', count: counts.all },
    { value: 'available' as const, label: 'Available', count: counts.available },
    { value: 'reserved' as const, label: 'Reserved', count: counts.reserved },
    { value: 'occupied' as const, label: 'Occupied', count: counts.occupied },
  ];

  return (
    <Tabs value={activeFilter} onValueChange={(v) => onFilterChange(v as typeof activeFilter)} className="w-full">
      <TabsList className="glass neon-border bg-transparent p-1 h-auto gap-1">
        {filters.map((filter) => (
          <TabsTrigger
            key={filter.value}
            value={filter.value}
            className={cn(
              'relative px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200',
              'data-[state=active]:bg-neon/20 data-[state=active]:text-neon',
              'data-[state=inactive]:text-text-dim hover:text-text-high',
              'focus:ring-2 focus:ring-[rgba(138,92,255,.6)]',
            )}
          >
            {filter.label}
            <span className="k-badge ml-2 bg-white/10">{filter.count}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
