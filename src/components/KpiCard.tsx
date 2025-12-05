import { TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  delta?: string | number;
  trend?: 'up' | 'down';
}

export const KpiCard = ({ title, value, delta, trend = 'up' }: KpiCardProps) => {
  const isUp = trend === 'up';

  return (
    <div className="glass-card neon-border p-6 rounded-2xl hover-lift">
      <p className="text-sm text-text-dim mb-2">{title}</p>
      <p className="stat-value mb-3">{value}</p>
      {delta !== undefined && (
        <div className="flex items-center gap-2">
          {isUp ? (
            <TrendingUp className="w-4 h-4 stat-delta-up" />
          ) : (
            <TrendingDown className="w-4 h-4 stat-delta-down" />
          )}
          <span className={isUp ? 'stat-delta-up text-sm font-medium' : 'stat-delta-down text-sm font-medium'}>
            {isUp ? '+' : ''}{delta}%
          </span>
        </div>
      )}
    </div>
  );
};
