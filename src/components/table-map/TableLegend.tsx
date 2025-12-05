export const TableLegend = () => {
  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-cyan" />
        <span className="text-xs text-text-dim font-medium">Available</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-blue" />
        <span className="text-xs text-text-dim font-medium">Reserved</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-pink" />
        <span className="text-xs text-text-dim font-medium">Occupied</span>
      </div>
    </div>
  );
};
