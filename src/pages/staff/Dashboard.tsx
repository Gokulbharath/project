import { useEffect, useState } from 'react';
import { KpiCard } from '@/components/KpiCard';
import { api } from '@/services/api';
import { Users, Calendar, Clock, CreditCard } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const StaffDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    liveOccupancy: 0,
    tablesReserved: 0,
    arrivalsToday: 0,
    pendingPayments: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tables, , arrivals, payments] = await Promise.all([
          api.tables.getAll(),
          api.bookings.getAll(),
          api.arrivals.getToday(),
          api.payments.getPending(),
        ]);

        setKpis({
          liveOccupancy: tables.filter((t) => t.status === 'occupied').length,
          tablesReserved: tables.filter((t) => t.status === 'reserved').length,
          arrivalsToday: arrivals.length,
          pendingPayments: payments.length,
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Staff Dashboard</h1>
          <p className="text-muted-foreground">Real-time venue overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Staff Dashboard</h1>
        <p className="text-muted-foreground">Real-time venue overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Live Occupancy" value={kpis.liveOccupancy} icon={Users} />
        <KpiCard title="Tables Reserved" value={kpis.tablesReserved} icon={Calendar} />
        <KpiCard title="Arrivals Today" value={kpis.arrivalsToday} icon={Clock} />
        <KpiCard title="Pending Payments" value={kpis.pendingPayments} icon={CreditCard} />
      </div>
    </div>
  );
};
