import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/services/api';
import type { Log } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDateTime } from '@/utils/format';
import { SEVERITY_COLORS } from '@/utils/constants';
import { ScrollArea } from '@/components/ui/scroll-area';

export const SystemLogs = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const data = await api.logs.getAll();
        setLogs(data);
      } catch (error) {
        console.error('Failed to load logs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">System Logs</h1>
          <p className="text-muted-foreground">Audit trail and system events</p>
        </div>

        <div className="space-y-2">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">System Logs</h1>
        <p className="text-muted-foreground">Audit trail and system events</p>
      </div>

      <Card className="glass-card">
        <ScrollArea className="h-[600px]">
          <div className="p-4 space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="glass p-4 rounded-lg hover-lift transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge
                        variant="outline"
                        style={{
                          borderColor: `${SEVERITY_COLORS[log.severity]}50`,
                          color: SEVERITY_COLORS[log.severity],
                        }}
                      >
                        {log.severity.toUpperCase()}
                      </Badge>
                      <h3 className="text-sm font-semibold text-white">{log.action}</h3>
                    </div>

                    <p className="text-xs text-muted-foreground mb-2">{log.details}</p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{log.user}</span>
                      <span>•</span>
                      <span>{formatDateTime(log.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};
