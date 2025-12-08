import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  icon?: ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {items.map((item, index) => (
        <div key={item.id} className="relative flex gap-4">
          {/* Timeline line */}
          {index < items.length - 1 && (
            <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-border" />
          )}
          
          {/* Icon */}
          <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
            {item.icon || (
              <div className="h-2 w-2 rounded-full bg-primary" />
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 pb-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-text-high">{item.title}</p>
                {item.description && (
                  <p className="text-sm text-text-dim mt-1">{item.description}</p>
                )}
              </div>
              <time className="text-xs text-text-dim whitespace-nowrap ml-4">
                {new Date(item.timestamp).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </time>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

