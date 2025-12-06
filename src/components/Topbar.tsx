import Icon from '@/components/ui/Icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

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
    <header className="sticky top-0 z-30 border-b border-[rgba(138,92,255,.1)]">
      <div
        className="glass p-4 md:p-6 flex items-center justify-between gap-4"
        style={{
          background: 'linear-gradient(to bottom, rgba(14,14,32,.8), rgba(14,14,32,0))',
        }}
      >
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

        {/* Right: Icons & Controls */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Date Display */}
          <div className="hidden sm:block text-xs text-text-dim border-r border-[rgba(138,92,255,.15)] pr-3 md:pr-4">
            {formattedDate}
          </div>

          {/* Notification Bell */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 text-text-dim hover:text-text-high hover:bg-white/5 transition-colors"
          >
            <Icon name="notifications" size={18} />
            <span className="absolute top-1 right-1 h-2 w-2 bg-error rounded-full" />
          </Button>

          {/* Shield Icon */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-text-dim hover:text-text-high hover:bg-white/5 transition-colors"
          >
            <Icon name="info" size={18} />
          </Button>

          {/* User Avatar */}
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-neon-primary to-neon-accent flex items-center justify-center text-white font-semibold text-sm">
            A
          </div>

          {/* Balance Button */}
          
        </div>
      </div>
    </header>
  );
};
