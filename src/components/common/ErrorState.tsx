import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred while loading data. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
      <div className="mb-4 p-4 rounded-full bg-destructive/10">
        <Icon name="alert-circle" size={32} className="text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-text-high mb-2">{title}</h3>
      <p className="text-text-dim text-sm mb-4 max-w-md text-center">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" aria-label="Retry">
          <Icon name="refresh-cw" size={16} className="mr-2" />
          Retry
        </Button>
      )}
    </div>
  );
}

