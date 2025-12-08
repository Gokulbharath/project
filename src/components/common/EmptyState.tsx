import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon = 'inbox', title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
      <div className="mb-4 p-4 rounded-full bg-surface/50">
        <Icon name={icon} size={32} className="text-text-dim" />
      </div>
      <h3 className="text-lg font-semibold text-text-high mb-2">{title}</h3>
      {description && <p className="text-text-dim text-sm mb-4 max-w-md text-center">{description}</p>}
      {action && (
        <Button onClick={action.onClick} variant="default" aria-label={action.label}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

