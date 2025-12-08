type FilterStatus = 'all' | 'available' | 'reserved' | 'occupied';

type Props = {
  active: FilterStatus;
  counts: Record<FilterStatus, number>;
  onChange: (status: FilterStatus) => void;
};

const colors: Record<Exclude<FilterStatus, 'all'>, string> = {
  available: 'bg-cyan/60',
  reserved: 'bg-blue/60',
  occupied: 'bg-pink/60',
};

export const Filters = ({ active, counts, onChange }: Props) => {
  const options: { key: FilterStatus; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'available', label: 'Available' },
    { key: 'reserved', label: 'Reserved' },
    { key: 'occupied', label: 'Occupied' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className={`px-3 py-1.5 rounded-full text-sm border transition ${
            active === opt.key ? 'border-neon text-text-high bg-neon/10' : 'border-white/5 text-text-dim hover:border-white/20'
          }`}
        >
          <span className="mr-2">{opt.label}</span>
          <span className="text-xs text-text-dim">({counts[opt.key] ?? 0})</span>
        </button>
      ))}

      <div className="flex items-center gap-3 ml-4 text-sm text-text-dim">
        <LegendDot className={colors.available} label="Available" />
        <LegendDot className={colors.reserved} label="Reserved" />
        <LegendDot className={colors.occupied} label="Occupied" />
      </div>
    </div>
  );
};

const LegendDot = ({ className, label }: { className: string; label: string }) => (
  <div className="flex items-center gap-2">
    <span className={`w-3 h-3 rounded-full ${className}`} />
    <span>{label}</span>
  </div>
);

export default Filters;

