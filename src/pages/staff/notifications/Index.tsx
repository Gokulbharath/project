import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Icon from '@/components/ui/Icon';
import { listNotifications, markNotificationRead, addMockNotification } from '@/services/staff';
import { TNotificationItem } from '@/types/staff';
import { formatTimeAgo } from '@/utils/format';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const severityIcons: Record<string, string> = {
  INFO: 'info',
  WARN: 'alert-triangle',
  ERROR: 'alert-circle',
};

const severityColors: Record<string, string> = {
  INFO: 'text-blue',
  WARN: 'text-yellow',
  ERROR: 'text-red',
};

export default function NotificationsIndex() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<TNotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await listNotifications({
        onlyUnread: filter === 'unread',
        type: typeFilter === 'all' ? undefined : typeFilter,
      });
      setNotifications(result.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);

    // Mock socket: add notification every 20-30s
    const mockSocketInterval = setInterval(() => {
      const types: Array<TNotificationItem['type']> = ['SYSTEM', 'PAYMENT', 'ARRIVAL', 'BOT'];
      const severities: Array<TNotificationItem['severity']> = ['INFO', 'WARN'];
      const mockNotification: TNotificationItem = {
        id: `N${Date.now()}`,
        type: types[Math.floor(Math.random() * types.length)],
        title: 'New Notification',
        body: `This is a mock notification created at ${new Date().toLocaleTimeString()}`,
        severity: severities[Math.floor(Math.random() * severities.length)],
        createdAt: new Date().toISOString(),
        readAt: null,
        link: null,
      };
      addMockNotification(mockNotification);
      toast.info(mockNotification.title, { description: mockNotification.body });
      loadNotifications();
    }, 20000 + Math.random() * 10000);

    return () => {
      clearInterval(interval);
      clearInterval(mockSocketInterval);
    };
  }, [filter, typeFilter]);

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
      );
      toast.success('Notification marked as read');
    } catch (err) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleLinkClick = (link: string | null) => {
    if (link) {
      navigate(link);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (search) {
      const query = search.toLowerCase();
      return (
        n.title.toLowerCase().includes(query) || n.body.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6" data-testid="notifications-page">
      <PageHeader
        title="Notifications"
        subtitle="Stay updated with venue activities"
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread')}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
            aria-label="Search notifications"
          />
        </div>
        <Select
          value={typeFilter}
          onValueChange={(v) => setTypeFilter(v)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="SYSTEM">System</SelectItem>
            <SelectItem value="PAYMENT">Payment</SelectItem>
            <SelectItem value="ARRIVAL">Arrival</SelectItem>
            <SelectItem value="NO_SHOW">No Show</SelectItem>
            <SelectItem value="BOT">Bot</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notifications List */}
      {loading ? (
        <LoadingState rows={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadNotifications} />
      ) : filteredNotifications.length === 0 ? (
        <EmptyState
          icon="bell"
          title="No notifications"
          description="You're all caught up!"
        />
      ) : (
        <div className="space-y-2">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                'glass p-4 rounded-lg border transition-colors',
                !notification.readAt && 'border-primary/30 bg-primary/5'
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    'p-2 rounded-full',
                    severityColors[notification.severity] || 'text-blue',
                    'bg-surface'
                  )}
                >
                  <Icon
                    name={severityIcons[notification.severity] || 'info'}
                    size={20}
                    className={severityColors[notification.severity] || 'text-blue'}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-text-high">{notification.title}</h4>
                        <span className="text-xs px-2 py-0.5 rounded bg-surface text-text-dim">
                          {notification.type}
                        </span>
                      </div>
                      <p className="text-sm text-text-dim mb-2">{notification.body}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-text-dim">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                        {notification.link && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLinkClick(notification.link)}
                            className="h-6 text-xs"
                          >
                            View <Icon name="arrow-right" size={12} className="ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                    {!notification.readAt && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMarkRead(notification.id)}
                        className="h-8 w-8"
                        aria-label="Mark as read"
                      >
                        <Icon name="check" size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

