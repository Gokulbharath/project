import { Skeleton } from '@/components/ui/skeleton';

interface LoadingStateProps {
  rows?: number;
  className?: string;
}

export function LoadingState({ rows = 5, className }: LoadingStateProps) {
  return (
    <div className={className}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full mb-2 rounded-lg" />
      ))}
    </div>
  );
}

