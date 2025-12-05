import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const KpiCard = ({ title, value, icon: Icon, trend, className }: KpiCardProps) => {
  return (
    <Card className={cn('glass-card hover-lift hover-glow', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="w-5 h-5 text-neon-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-white">{value}</div>
        {trend && (
          <p className={cn('text-xs mt-1', trend.isPositive ? 'text-neon-success' : 'text-destructive')}>
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}% from last period
          </p>
        )}
      </CardContent>
    </Card>
  );
};
