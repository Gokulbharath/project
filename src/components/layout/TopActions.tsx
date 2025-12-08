import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/Icon';
import { listNotifications, markNotificationRead, updatePreferences, getProfile } from '@/services/staff';
import { formatTimeAgo } from '@/utils/format';
import type { TNotificationItem } from '@/types/staff';
import { useAuth } from '@/hooks/useAuth';

const triggerCls = 'inline-flex h-9 w-9 items-center justify-center rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition relative';

export default function TopActions() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<TNotificationItem[]>([]);
  const [loadingNotif, setLoadingNotif] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'black'>('dark');

  const unreadCount = useMemo(() => notifications.filter((n) => !n.readAt).length, [notifications]);

  const loadNotifications = async () => {
    try {
      setLoadingNotif(true);
      const res = await listNotifications({ page: 1 });
      setNotifications(res.items);
    } finally {
      setLoadingNotif(false);
    }
  };

  const loadProfilePrefs = async () => {
    const profile = await getProfile();
    if (profile?.preferences?.theme === 'black') setTheme('black');
    else setTheme('dark');
  };

  useEffect(() => {
    loadNotifications();
    loadProfilePrefs();
  }, []);

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n)));
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.readAt);
    await Promise.all(unread.map((n) => markNotificationRead(n.id)));
    setNotifications((prev) => prev.map((n) => ({ ...n, readAt: new Date().toISOString() })));
  };

  const handleTheme = async (next: 'dark' | 'black') => {
    setTheme(next);
    await updatePreferences({
      theme: next,
      density: 'comfortable',
      sounds: false,
      language: 'en',
      timeFormat: '24h',
      reducedMotion: false,
    });
  };

  return (
    <div className="ml-auto flex items-center gap-2 md:gap-3">
      {/* Search placeholder */}
      <Button variant="ghost" size="icon" className={triggerCls} aria-label="Search">
        <Icon name="search" size={18} />
      </Button>

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={triggerCls} aria-label="Notifications">
            <Icon name="notifications" size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#8A5CFF] shadow-[0_0_8px_rgba(138,92,255,.6)]" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          portalled={false}
          align="end"
          className="z-40 w-80 bg-[rgba(18,18,41,.98)] border border-white/10 rounded-xl p-2"
        >
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="text-sm font-semibold text-text-high">Notifications</span>
            <div className="text-xs text-text-dim">{loadingNotif ? 'Loading…' : `${notifications.length} items`}</div>
          </div>
          <DropdownMenuSeparator />
          <div className="max-h-80 overflow-auto space-y-1">
            {notifications.length === 0 && (
              <div className="text-sm text-text-dim px-2 py-3">No notifications</div>
            )}
            {notifications.map((n) => (
              <DropdownMenuItem
                key={n.id}
                className="flex items-start gap-2 rounded-lg px-3 py-2 hover:bg-white/5 text-sm"
                onClick={() => handleMarkRead(n.id)}
              >
                <span
                  className={`mt-1 h-2 w-2 rounded-full ${
                    n.severity === 'ERROR' ? 'bg-red' : n.severity === 'WARN' ? 'bg-yellow' : 'bg-cyan'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-text-high truncate">{n.title}</span>
                    <span className="text-[11px] text-text-dim whitespace-nowrap">{formatTimeAgo(n.createdAt)}</span>
                  </div>
                  <p className="text-xs text-text-dim truncate">{n.body}</p>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
          <DropdownMenuSeparator />
          <div className="flex items-center justify-between px-2 py-1.5 text-sm">
            <button className="text-text-dim hover:text-text-high" onClick={handleMarkAllRead}>
              Mark all read
            </button>
            <button className="text-neon hover:text-white" onClick={() => navigate('/staff/notifications')}>
              View all
            </button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Settings */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={triggerCls} aria-label="Settings">
            <Icon name="settings" size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          portalled={false}
          align="end"
          className="z-40 w-64 bg-[rgba(18,18,41,.98)] border border-white/10 rounded-xl p-2"
        >
          <DropdownMenuItem
            className="rounded-lg px-3 py-2 hover:bg-white/5 text-sm"
            onClick={() => navigate('/staff/settings')}
          >
            Preferences
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div className="px-3 py-2">
            <div className="text-xs text-text-dim mb-2">Theme</div>
            <div className="flex gap-2">
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleTheme('dark')}
              >
                Dark
              </Button>
              <Button
                variant={theme === 'black' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleTheme('black')}
              >
                Pure Black
              </Button>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="rounded-lg px-3 py-2 hover:bg-white/5 text-sm"
            onClick={() => setShortcutsOpen(true)}
          >
            Keyboard Shortcuts
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="relative h-9 w-9 rounded-full bg-gradient-to-br from-neon to-cyan text-white text-sm font-semibold flex items-center justify-center shadow-glow"
            aria-label="Profile"
          >
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          portalled={false}
          align="end"
          className="z-40 w-64 bg-[rgba(18,18,41,.98)] border border-white/10 rounded-xl p-2"
        >
          <DropdownMenuItem className="rounded-lg px-3 py-2 hover:bg-white/5 text-sm" onClick={() => navigate('/staff/profile')}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-lg px-3 py-2 hover:bg-white/5 text-sm" onClick={() => navigate('/staff/support')}>
            Support
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-lg px-3 py-2 hover:bg-white/5 text-sm" onClick={() => navigate('/staff/settings')}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="rounded-lg px-3 py-2 hover:bg-white/5 text-sm text-red"
            onClick={() => {
              logout();
              window.location.href = '/login';
            }}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Keyboard shortcuts dialog */}
      <Dialog open={shortcutsOpen} onOpenChange={setShortcutsOpen}>
        <DialogContent portalled={false} className="max-w-md bg-[rgba(18,18,41,.98)] border border-white/10">
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
            <DialogDescription>Quick navigation hints</DialogDescription>
          </DialogHeader>
          <ul className="text-sm text-text-dim space-y-2">
            <li><span className="font-medium text-text-high">/</span> Focus search</li>
            <li><span className="font-medium text-text-high">Esc</span> Close menus/dialogs</li>
            <li><span className="font-medium text-text-high">Ctrl/Cmd + ,</span> Open settings</li>
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
}

