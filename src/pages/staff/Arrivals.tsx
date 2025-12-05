import { useEffect, useState } from 'react';
import { ArrivalItem } from '@/components/ArrivalItem';
import { api } from '@/services/api';
import { useSocket } from '@/hooks/useSocket';
import type { Arrival } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const Arrivals = () => {
  const [arrivals, setArrivals] = useState<Arrival[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'today' | 'all'>('today');
  const { on } = useSocket();

  useEffect(() => {
    const loadArrivals = async () => {
      try {
        const data = filter === 'today' ? await api.arrivals.getToday() : await api.arrivals.getAll();
        setArrivals(data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      } catch (error) {
        console.error('Failed to load arrivals:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArrivals();
  }, [filter]);

  useEffect(() => {
    const cleanup = on('arrival:new', (newArrival: Arrival) => {
      setArrivals((prev) => [newArrival, ...prev]);
    });

    return cleanup;
  }, [on]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Arrival Logs</h1>
          <p className="text-muted-foreground">Real-time guest arrivals</p>
        </div>

        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Arrival Logs</h1>
        <p className="text-muted-foreground">Real-time guest arrivals</p>
      </div>

      <Tabs defaultValue="today" onValueChange={(v) => setFilter(v as 'today' | 'all')}>
        <TabsList className="glass">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="all">All Time</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-3 mt-6">
          {arrivals.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-muted-foreground">No arrivals yet today</p>
            </div>
          ) : (
            arrivals.map((arrival) => <ArrivalItem key={arrival.id} arrival={arrival} />)
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-3 mt-6">
          {arrivals.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-muted-foreground">No arrivals recorded</p>
            </div>
          ) : (
            arrivals.map((arrival) => <ArrivalItem key={arrival.id} arrival={arrival} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
