import Icon from '@/components/ui/Icon';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import TopActions from '@/components/layout/TopActions';

interface TopbarProps {
  venueName?: string;
}

export const Topbar = ({ venueName = 'AURA Nightclub' }: TopbarProps) => {
  const [date] = useState(new Date());

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(138,92,255,.1)] bg-[rgba(14,14,32,.7)] backdrop-blur-md">
      <div className="flex h-14 items-center gap-3 px-4">
        {/* Left: Venue Name */}
        <div className="flex-shrink-0">
          <h2 className="text-sm md:text-base font-semibold text-text-high">{venueName}</h2>
        </div>

        {/* Center: Search (hidden on small screens) */}
        <div className="flex-1 max-w-xs hidden md:block">
          <div className="relative">
            <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
            <Input
              placeholder="Search..."
              className="pl-10 h-9 bg-white/5 border-white/10 focus:border-neon-primary/50 placeholder:text-text-dim"
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="hidden sm:block text-xs text-text-dim border-r border-[rgba(138,92,255,.15)] pr-3 md:pr-4">
          {formattedDate}
        </div>
        <TopActions />
      </div>
    </header>
  );
};
